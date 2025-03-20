<?php
/**
 * Social Authentication for WordPress REST API
 * Supports Google and GitHub login
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class MemberFun_Social_Auth {
    
    // Class instance
    private static $instance = null;
    
    // Provider settings
    private $providers = [];
    
    /**
     * Get class instance
     */
    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        // Initialize providers
        $this->providers = [
            'google' => [
                'client_id' => get_option('memberfun_google_client_id', ''),
                'client_secret' => get_option('memberfun_google_client_secret', ''),
                'redirect_uri' => site_url('/wp-json/memberfun/v1/auth/google/callback'),
                'auth_url' => 'https://accounts.google.com/o/oauth2/auth',
                'token_url' => 'https://oauth2.googleapis.com/token',
                'user_info_url' => 'https://www.googleapis.com/oauth2/v2/userinfo',
                'scope' => 'email profile',
            ],
            'github' => [
                'client_id' => get_option('memberfun_github_client_id', ''),
                'client_secret' => get_option('memberfun_github_client_secret', ''),
                'redirect_uri' => site_url('/wp-json/memberfun/v1/auth/github/callback'),
                'auth_url' => 'https://github.com/login/oauth/authorize',
                'token_url' => 'https://github.com/login/oauth/access_token',
                'user_info_url' => 'https://api.github.com/user',
                'scope' => 'read:user user:email',
            ],
        ];
        
        // Register REST API routes
        add_action('rest_api_init', [$this, 'register_routes']);
        
        // Add admin settings
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_menu', [$this, 'add_settings_page']);
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Auth endpoints for each provider
        foreach (array_keys($this->providers) as $provider) {
            register_rest_route('memberfun/v1', "/auth/{$provider}", [
                'methods' => 'GET',
                'callback' => [$this, 'get_auth_url'],
                'permission_callback' => '__return_true',
                'args' => [
                    'provider' => [
                        'default' => $provider,
                    ],
                ],
            ]);
            
            register_rest_route('memberfun/v1', "/auth/{$provider}/callback", [
                'methods' => 'GET',
                'callback' => [$this, 'handle_callback'],
                'permission_callback' => '__return_true',
                'args' => [
                    'provider' => [
                        'default' => $provider,
                    ],
                    'code' => [
                        'required' => true,
                    ],
                    'from' => [
                        'required' => false,
                    ],
                ],
            ]);
        }
    }
    
    /**
     * Get authorization URL
     */
    public function get_auth_url($request) {
        $provider = $request->get_param('provider');
        
        if (!isset($this->providers[$provider])) {
            return new WP_Error('invalid_provider', 'Invalid provider', ['status' => 400]);
        }
        
        $provider_data = $this->providers[$provider];
        
        // Generate state parameter for security
        $state = wp_generate_password(12, false);
        set_transient('memberfun_auth_state', $state, 3600);
        
        // Build auth URL
        $auth_url = add_query_arg([
            'client_id' => $provider_data['client_id'],
            'redirect_uri' => $provider_data['redirect_uri'],
            'scope' => $provider_data['scope'],
            'response_type' => 'code',
            'state' => $state,
        ], $provider_data['auth_url']);
        
        return rest_ensure_response(['auth_url' => $auth_url]);
    }
    
    /**
     * Handle OAuth callback
     */
    public function handle_callback($request) {
        $provider = $request->get_param('provider');
        $code = $request->get_param('code');
        $state = $request->get_param('state');

        // Verify state parameter
        $saved_state = get_transient('memberfun_auth_state');
        if (!$saved_state || $saved_state !== $state) {
            return new WP_Error('invalid_state', 'Invalid state parameter', ['status' => 400]);
        }
        
        // Delete used state
        delete_transient('memberfun_auth_state');
        
        if (!isset($this->providers[$provider])) {
            return new WP_Error('invalid_provider', 'Invalid provider', ['status' => 400]);
        }
        
        $provider_data = $this->providers[$provider];
        
        // Exchange code for access token
        $token_response = $this->get_access_token($provider_data, $code);
        if (is_wp_error($token_response)) {
            return $token_response;
        }
        
        // Get user info with access token
        $user_info = $this->get_user_info($provider_data, $token_response['access_token'], $provider);
        if (is_wp_error($user_info)) {
            return $user_info;
        }
        
        // Process user login or registration
        $user_id = $this->process_user($user_info, $provider);
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        
        // Generate JWT token for authentication
        $token = $this->generate_auth_token($user_id);
        
        // Redirect to frontend with token
        // $redirect_url = home_url('/?auth_token=' . $token);
        
        $user_info['token'] = $token;
        $redirect_url = add_query_arg([
          // 'user_info' => $user_info
          'id' => $user_info['id'],
          'email' => $user_info['email'],
          'name' => $user_info['name'],
          'token' => $token,
        ], 'http://localhost:5173/social-auth-callback/');
        // $redirect_url = 'http://localhost:5173/social-auth-callback/' . $token;
        wp_redirect($redirect_url);
        exit;
    }
    
    /**
     * Get access token from provider
     */
    private function get_access_token($provider_data, $code) {
        $args = [
            'body' => [
                'client_id' => $provider_data['client_id'],
                'client_secret' => $provider_data['client_secret'],
                'code' => $code,
                'redirect_uri' => $provider_data['redirect_uri'],
                'grant_type' => 'authorization_code',
            ],
            'headers' => [
                'Accept' => 'application/json',
            ],
        ];
        
        $response = wp_remote_post($provider_data['token_url'], $args);
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!isset($data['access_token'])) {
            return new WP_Error('token_error', 'Failed to get access token', ['status' => 401]);
        }
        
        return $data;
    }
    
    /**
     * Get user info from provider
     */
    private function get_user_info($provider_data, $access_token, $provider) {
        $args = [
            'headers' => [
                'Authorization' => 'Bearer ' . $access_token,
                'Accept' => 'application/json',
            ],
        ];
        
        $response = wp_remote_get($provider_data['user_info_url'], $args);
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = wp_remote_retrieve_body($response);
        $user_data = json_decode($body, true);
        
        if (empty($user_data)) {
            return new WP_Error('user_info_error', 'Failed to get user info', ['status' => 401]);
        }
        
        // Get email for GitHub if not included in user data
        if ($provider === 'github' && empty($user_data['email'])) {
            $email_response = wp_remote_get('https://api.github.com/user/emails', $args);
            if (!is_wp_error($email_response)) {
                $emails = json_decode(wp_remote_retrieve_body($email_response), true);
                foreach ($emails as $email_data) {
                    if (!empty($email_data['primary']) && $email_data['verified']) {
                        $user_data['email'] = $email_data['email'];
                        break;
                    }
                }
            }
        }
        
        return $user_data;
    }
    
    /**
     * Process user login or registration
     */
    private function process_user($user_info, $provider) {
        // Extract user data based on provider
        $email = '';
        $name = '';
        $username = '';
        
        if ($provider === 'google') {
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            $name = isset($user_info['name']) ? $user_info['name'] : '';
            $username = isset($user_info['email']) ? explode('@', $user_info['email'])[0] : '';
        } elseif ($provider === 'github') {
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            $name = isset($user_info['name']) ? $user_info['name'] : '';
            $username = isset($user_info['login']) ? $user_info['login'] : '';
        }
        
        if (empty($email)) {
            return new WP_Error('missing_email', 'Email is required for authentication', ['status' => 400]);
        }
        
        // Check if user exists
        $user = get_user_by('email', $email);
        
        if ($user) {
            // User exists, update social profile data
            update_user_meta($user->ID, "memberfun_{$provider}_id", $user_info['id']);
            return $user->ID;
        } else {
            // Create new user
            if (empty($username)) {
                $username = sanitize_user(substr($email, 0, strpos($email, '@')), true);
            }
            
            // Ensure username is unique
            $username = $this->get_unique_username($username);
            
            // Create user
            $user_id = wp_insert_user([
                'user_login' => $username,
                'user_email' => $email,
                'display_name' => $name,
                'user_pass' => wp_generate_password(),
                'role' => 'subscriber',
            ]);
            
            if (is_wp_error($user_id)) {
                return $user_id;
            }
            
            // Save provider data
            update_user_meta($user_id, "memberfun_{$provider}_id", $user_info['id']);
            
            return $user_id;
        }
    }
    
    /**
     * Generate a unique username
     */
    private function get_unique_username($username) {
        $original_username = $username;
        $count = 1;
        
        while (username_exists($username)) {
            $username = $original_username . $count;
            $count++;
        }
        
        return $username;
    }
    
    /**
     * Generate authentication token
     */
    private function generate_auth_token($user_id) {

        $token = memberfun_generate_jwt_token_by_user_id($user_id);
        return $token;
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('memberfun_social_auth', 'memberfun_google_client_id');
        register_setting('memberfun_social_auth', 'memberfun_google_client_secret');
        register_setting('memberfun_social_auth', 'memberfun_github_client_id');
        register_setting('memberfun_social_auth', 'memberfun_github_client_secret');
    }
    
    /**
     * Add settings page
     */
    public function add_settings_page() {
        add_submenu_page(
            'options-general.php',
            'Social Login Settings',
            'Social Login',
            'manage_options',
            'memberfun-social-auth',
            [$this, 'render_settings_page']
        );
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Social Login Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('memberfun_social_auth'); ?>
                <?php do_settings_sections('memberfun_social_auth'); ?>
                
                <h2>Google</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Client ID</th>
                        <td>
                            <input type="text" name="memberfun_google_client_id" value="<?php echo esc_attr(get_option('memberfun_google_client_id')); ?>" class="regular-text" />
                            <p class="description">Enter your Google OAuth Client ID</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Client Secret</th>
                        <td>
                            <input type="password" name="memberfun_google_client_secret" value="<?php echo esc_attr(get_option('memberfun_google_client_secret')); ?>" class="regular-text" />
                            <p class="description">Enter your Google OAuth Client Secret</p>
                        </td>
                    </tr>
                </table>
                
                <h2>GitHub</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Client ID</th>
                        <td>
                            <input type="text" name="memberfun_github_client_id" value="<?php echo esc_attr(get_option('memberfun_github_client_id')); ?>" class="regular-text" />
                            <p class="description">Enter your GitHub OAuth Client ID</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Client Secret</th>
                        <td>
                            <input type="password" name="memberfun_github_client_secret" value="<?php echo esc_attr(get_option('memberfun_github_client_secret')); ?>" class="regular-text" />
                            <p class="description">Enter your GitHub OAuth Client Secret</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <h2>API Endpoints</h2>
            <table class="widefat">
                <thead>
                    <tr>
                        <th>Provider</th>
                        <th>Auth URL</th>
                        <th>Callback URL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Google</td>
                        <td><code><?php echo site_url('/wp-json/memberfun/v1/auth/google'); ?></code></td>
                        <td><code><?php echo site_url('/wp-json/memberfun/v1/auth/google/callback'); ?></code></td>
                    </tr>
                    <tr>
                        <td>GitHub</td>
                        <td><code><?php echo site_url('/wp-json/memberfun/v1/auth/github'); ?></code></td>
                        <td><code><?php echo site_url('/wp-json/memberfun/v1/auth/github/callback'); ?></code></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <?php
    }
}

// Initialize the class
function memberfun_social_auth_init() {
    MemberFun_Social_Auth::get_instance();
}
add_action('plugins_loaded', 'memberfun_social_auth_init');

/**
 * Verify token for API requests
 */
function memberfun_verify_auth_token($token) {
    // Check if JWT plugin is active
    if (function_exists('jwt_auth_validate_token')) {
        // Use JWT Auth plugin if available
        $valid = jwt_auth_validate_token($token);
        if (!is_wp_error($valid)) {
            return $valid->data->user->id;
        }
    } else {
        // Simple token validation
        $user_id = get_transient('memberfun_auth_token_' . $token);
        if ($user_id) {
            return $user_id;
        }
    }
    
    return false;
}

/**
 * Add authentication token to REST API response
 */
function memberfun_rest_authentication($response, $handler, $request) {
    $auth_header = $request->get_header('Authorization');
    
    if ($auth_header && strpos($auth_header, 'Bearer ') === 0) {
        $token = substr($auth_header, 7);
        $user_id = memberfun_verify_auth_token($token);
        
        if ($user_id) {
            wp_set_current_user($user_id);
        }
    }
    
    return $response;
}
add_filter('rest_request_before_callbacks', 'memberfun_rest_authentication', 10, 3); 
