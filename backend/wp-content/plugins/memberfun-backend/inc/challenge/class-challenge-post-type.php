<?php
/**
 * Challenge Custom Post Type Class
 *
 * @package MemberFun
 */

if (!defined('ABSPATH')) {
    exit;
}

class Challenge_Post_Type {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('init', array($this, 'register_taxonomy'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));

        add_filter('use_block_editor_for_post_type', array($this, 'disable_gutenberg'), 10, 2);
      
        // wp rest api add response headers total and total pages of Challenges custom post type
        add_filter('rest_post_dispatch', array($this, 'add_response_headers'), 10, 3);
    }

    public function add_response_headers($response, $server, $request) {
        // validate request is custom post type challenge
        if ($request->get_param('post_type') !== 'challenge') {
            return $response;
        }

        $per_page = $request->get_param('per_page');
        $page = $request->get_param('page');

        if ($per_page && $page) {
            $total = wp_count_posts('challenge')->publish;
            $total_pages = ceil($total / $per_page);
            $response->header('X-WP-Total', $total);
            $response->header('X-WP-TotalPages', $total_pages);
        }

        return $response;
    }

    public function disable_gutenberg($can_edit, $post_type) {
        if ($post_type === 'challenge') {
            return false;
        }
        return $can_edit;
    }

    /**
     * Register Challenge post type
     */
    public function register_post_type() {
        $labels = array(
            'name'               => _x('Challenges', 'post type general name', 'memberfun'),
            'singular_name'      => _x('Challenge', 'post type singular name', 'memberfun'),
            'menu_name'          => _x('Challenges', 'admin menu', 'memberfun'),
            'add_new'            => _x('Add New', 'challenge', 'memberfun'),
            'add_new_item'       => __('Add New Challenge', 'memberfun'),
            'edit_item'          => __('Edit Challenge', 'memberfun'),
            'new_item'           => __('New Challenge', 'memberfun'),
            'view_item'          => __('View Challenge', 'memberfun'),
            'search_items'       => __('Search Challenges', 'memberfun'),
            'not_found'          => __('No challenges found', 'memberfun'),
            'not_found_in_trash' => __('No challenges found in Trash', 'memberfun'),
        );

        $args = array(
            'labels'              => $labels,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-games',
            'supports'            => array('title', 'editor', 'thumbnail', 'excerpt'),
            'has_archive'         => true,
            'rewrite'             => array('slug' => 'challenges'),
            'show_in_graphql'     => true,
        );

        register_post_type('challenge', $args);
    }

    

    /**
     * Register Challenge Category taxonomy
     */
    public function register_taxonomy() {
        $labels = array(
            'name'              => _x('Challenge Categories', 'taxonomy general name', 'memberfun'),
            'singular_name'     => _x('Challenge Category', 'taxonomy singular name', 'memberfun'),
            'search_items'      => __('Search Challenge Categories', 'memberfun'),
            'all_items'         => __('All Challenge Categories', 'memberfun'),
            'parent_item'       => __('Parent Challenge Category', 'memberfun'),
            'parent_item_colon' => __('Parent Challenge Category:', 'memberfun'),
            'edit_item'         => __('Edit Challenge Category', 'memberfun'),
            'update_item'       => __('Update Challenge Category', 'memberfun'),
            'add_new_item'      => __('Add New Challenge Category', 'memberfun'),
            'new_item_name'     => __('New Challenge Category Name', 'memberfun'),
            'menu_name'         => __('Categories', 'memberfun'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'challenge-category'),
            'show_in_graphql'   => true,
        );

        register_taxonomy('challenge_category', array('challenge'), $args);
    }

    /**
     * Add meta boxes for Challenge post type
     */
    public function add_meta_boxes() {
        add_meta_box(
            'challenge_meta_box',
            __('Challenge Settings', 'memberfun'),
            array($this, 'render_meta_box'),
            'challenge',
            'normal',
            'high'
        );
    }

    /**
     * Render meta box content
     */
    public function render_meta_box($post) {
        wp_nonce_field('challenge_meta_box', 'challenge_meta_box_nonce');

        $max_score = get_post_meta($post->ID, '_challenge_max_score', true);
        $deadline_enabled = get_post_meta($post->ID, '_challenge_submission_deadline_enabled', true);
        $deadline = get_post_meta($post->ID, '_challenge_submission_deadline', true);
        ?>
        <p>
            <label for="challenge_max_score"><?php _e('Maximum Score:', 'memberfun'); ?></label>
            <input type="number" id="challenge_max_score" name="challenge_max_score" value="<?php echo esc_attr($max_score); ?>" min="0" />
        </p>
        <p>
            <label>
                <input type="checkbox" name="challenge_submission_deadline_enabled" value="1" <?php checked($deadline_enabled, '1'); ?> />
                <?php _e('Enable Submission Deadline', 'memberfun'); ?>
            </label>
        </p>
        <p class="deadline-field" style="display: <?php echo $deadline_enabled ? 'block' : 'none'; ?>">
            <label for="challenge_submission_deadline"><?php _e('Deadline for Submissions:', 'memberfun'); ?></label>
            <input type="datetime-local" id="challenge_submission_deadline" name="challenge_submission_deadline" value="<?php echo esc_attr($deadline); ?>" />
        </p>
        <script>
            jQuery(document).ready(function($) {
                $('input[name="challenge_submission_deadline_enabled"]').change(function() {
                    $('.deadline-field').toggle(this.checked);
                });
            });
        </script>
        <?php
    }

    /**
     * Save meta box data
     */
    public function save_meta_boxes($post_id) {
        if (!isset($_POST['challenge_meta_box_nonce'])) {
            return;
        }

        if (!wp_verify_nonce($_POST['challenge_meta_box_nonce'], 'challenge_meta_box')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $fields = array(
            'challenge_max_score' => 'intval',
            'challenge_submission_deadline_enabled' => 'sanitize_text_field',
            'challenge_submission_deadline' => 'sanitize_text_field'
        );

        foreach ($fields as $field => $sanitize_callback) {
            if (isset($_POST[$field])) {
                $value = $_POST[$field];
                if ($sanitize_callback === 'intval') {
                    $value = intval($value);
                } else {
                    $value = call_user_func($sanitize_callback, $value);
                }
                update_post_meta($post_id, '_' . $field, $value);
            }
        }
    }

    /**
     * Register REST API fields
     */
    public function register_rest_fields() {

        // challenge_category
        register_rest_field('challenge', 'challenge_category', array(
            'get_callback' => function($post) {
                return get_the_terms($post['id'], 'challenge_category');
            },
            'schema' => array(
                'description' => 'Challenge category',
                'type' => 'array'
            )
        ));
        
        // featured_media
        register_rest_field('challenge', 'featured_media', array(
            'get_callback' => function($post) {
                // get post featured images thumbnail, medium, large, full size url
                return [
                  'thumbnail' => get_the_post_thumbnail_url($post['id'], 'thumbnail'),
                  'medium' => get_the_post_thumbnail_url($post['id'], 'medium'),
                  'large' => get_the_post_thumbnail_url($post['id'], 'large'),
                  'full' => get_the_post_thumbnail_url($post['id'], 'full'),
                  'source_url' => get_the_post_thumbnail_url($post['id'], 'full')
                ];
            },
            'schema' => array(
                'description' => 'Featured media for the challenge',
                'type' => 'array'
            )
        ));

        register_rest_field('challenge', 'max_score', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_challenge_max_score', true);
            },
            'schema' => array(
                'description' => 'Maximum score for the challenge',
                'type' => 'integer',
                'minimum' => 0
            )
        ));

        register_rest_field('challenge', 'submission_deadline_enabled', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_challenge_submission_deadline_enabled', true);
            },
            'schema' => array(
                'description' => 'Whether submission deadline is enabled',
                'type' => 'boolean'
            )
        ));

        register_rest_field('challenge', 'submission_deadline', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_challenge_submission_deadline', true);
            },
            'schema' => array(
                'description' => 'Submission deadline datetime',
                'type' => 'string',
                'format' => 'date-time'
            )
        ));
    }
}

// Initialize the class
new Challenge_Post_Type(); 