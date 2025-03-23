<?php
/**
 * Memberfun Options Class
 * 
 * Handles the creation and management of the Memberfun options page
 */
class Memberfun_Options {
    /**
     * Options array
     *
     * @var array
     */
    private $options;

    /**
     * Settings array
     *
     * @var array
     */
    private $settings = array(
        'general' => array(
            'section_title' => 'General Settings',
            'fields' => array(
                'frontend_url' => array(
                    'title' => 'Frontend URL',
                    'type' => 'text',
                    'description' => 'Enter your frontend URL (e.g., https://your-frontend-domain.com)'
                ),
                'logo' => array(
                    'title' => 'Logo',
                    'type' => 'media',
                    'description' => 'Select your site logo'
                ),
                'facebook_url' => array(
                    'title' => 'Facebook URL',
                    'type' => 'url',
                    'description' => 'Enter your Facebook page URL'
                ),
                'instagram_url' => array(
                    'title' => 'Instagram URL',
                    'type' => 'url',
                    'description' => 'Enter your Instagram profile URL'
                ),
                'x_url' => array(
                    'title' => 'X (Twitter) URL',
                    'type' => 'url',
                    'description' => 'Enter your X (Twitter) profile URL'
                )
            )
        )
    );

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_options_page'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Add options page to WordPress admin
     */
    public function add_options_page() {
        add_menu_page(
            'Memberfun Options',
            'Memberfun',
            'manage_options',
            'memberfun-options',
            array($this, 'render_options_page'),
            'dashicons-groups',
            30
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        foreach ($this->settings as $tab_id => $tab) {
            register_setting(
                'memberfun_options',
                'memberfun_' . $tab_id,
                array($this, 'sanitize_settings')
            );

            add_settings_section(
                'memberfun_' . $tab_id . '_section',
                $tab['section_title'],
                array($this, 'render_section_description'),
                'memberfun-options-' . $tab_id
            );

            foreach ($tab['fields'] as $field_id => $field) {
                add_settings_field(
                    'memberfun_' . $field_id,
                    $field['title'],
                    array($this, 'render_field'),
                    'memberfun-options-' . $tab_id,
                    'memberfun_' . $tab_id . '_section',
                    array(
                        'id' => $field_id,
                        'type' => $field['type'],
                        'description' => $field['description']
                    )
                );
            }
        }
    }

    /**
     * Render section description
     */
    public function render_section_description() {
        echo '<p>Configure your Memberfun settings below:</p>';
    }

    /**
     * Render field based on type
     */
    public function render_field($args) {
        $options = get_option('memberfun_general');
        $value = isset($options[$args['id']]) ? $options[$args['id']] : '';

        switch ($args['type']) {
            case 'text':
            case 'url':
                printf(
                    '<input type="%s" id="%s" name="%s" value="%s" class="regular-text">',
                    esc_attr($args['type']),
                    esc_attr($args['id']),
                    esc_attr('memberfun_general[' . $args['id'] . ']'),
                    esc_attr($value)
                );
                break;

            case 'media':
                ?>
                <div class="media-upload-wrapper">
                    <input type="hidden" 
                           id="<?php echo esc_attr($args['id']); ?>" 
                           name="<?php echo esc_attr('memberfun_general[' . $args['id'] . ']'); ?>" 
                           value="<?php echo esc_attr($value); ?>">
                    <div id="<?php echo esc_attr($args['id']); ?>_preview">
                        <?php if ($value) : ?>
                            <?php echo wp_get_attachment_image($value, 'thumbnail'); ?>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="button" id="<?php echo esc_attr($args['id']); ?>_button">
                        Select Media
                    </button>
                </div>
                <?php
                break;
        }

        if (!empty($args['description'])) {
            printf('<p class="description">%s</p>', esc_html($args['description']));
        }
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();

        foreach ($input as $key => $value) {
            switch ($key) {
                case 'frontend_url':
                case 'facebook_url':
                case 'instagram_url':
                case 'x_url':
                    $sanitized[$key] = esc_url_raw($value);
                    break;
                case 'logo':
                    $sanitized[$key] = absint($value);
                    break;
                default:
                    $sanitized[$key] = sanitize_text_field($value);
            }
        }

        return $sanitized;
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if ('toplevel_page_memberfun-options' !== $hook) {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script(
            'memberfun-admin',
            plugins_url('js/admin.js', dirname(__FILE__)),
            array('jquery'),
            '1.0.0',
            true
        );
    }

    /**
     * Render options page
     */
    public function render_options_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'general';
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <h2 class="nav-tab-wrapper">
                <?php
                foreach ($this->settings as $tab_id => $tab) {
                    $class = ($active_tab === $tab_id) ? 'nav-tab-active' : '';
                    printf(
                        '<a class="nav-tab %s" href="?page=%s&tab=%s">%s</a>',
                        esc_attr($class),
                        esc_attr('memberfun-options'),
                        esc_attr($tab_id),
                        esc_html($tab['section_title'])
                    );
                }
                ?>
            </h2>

            <form method="post" action="options.php">
                <?php
                settings_fields('memberfun_options');
                do_settings_sections('memberfun-options-' . $active_tab);
                submit_button('Save Settings');
                ?>
            </form>
        </div>
        <?php
    }
}
