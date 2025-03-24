<?php
/**
 * Submission Custom Post Type Class
 *
 * @package MemberFun
 */

if (!defined('ABSPATH')) {
    exit;
}

class Submission_Post_Type {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_filter('manage_submission_posts_columns', array($this, 'add_custom_columns'));
        add_action('manage_submission_posts_custom_column', array($this, 'render_custom_columns'), 10, 2);
        add_filter('use_block_editor_for_post_type', array($this, 'disable_gutenberg'), 10, 2);
    }

    public function disable_gutenberg($can_edit, $post_type) {
        if ($post_type === 'submission') {
            return false;
        }
        return $can_edit;
    }

    /**
     * Register Submission post type
     */
    public function register_post_type() {
        $labels = array(
            'name'               => _x('Submissions', 'post type general name', 'memberfun'),
            'singular_name'      => _x('Submission', 'post type singular name', 'memberfun'),
            'menu_name'          => _x('Submissions', 'admin menu', 'memberfun'),
            'add_new'            => _x('Add New', 'submission', 'memberfun'),
            'add_new_item'       => __('Add New Submission', 'memberfun'),
            'edit_item'          => __('Edit Submission', 'memberfun'),
            'new_item'           => __('New Submission', 'memberfun'),
            'view_item'          => __('View Submission', 'memberfun'),
            'search_items'       => __('Search Submissions', 'memberfun'),
            'not_found'          => __('No submissions found', 'memberfun'),
            'not_found_in_trash' => __('No submissions found in Trash', 'memberfun'),
        );

        $args = array(
            'labels'              => $labels,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'menu_position'       => 6,
            'menu_icon'           => 'dashicons-portfolio',
            'supports'            => array('title', 'editor', 'thumbnail'),
            'has_archive'         => true,
            'rewrite'             => array('slug' => 'submissions'),
            'show_in_graphql'     => true,
        );

        register_post_type('submission', $args);
    }

    /**
     * Add meta boxes for Submission post type
     */
    public function add_meta_boxes() {
        add_meta_box(
            'submission_meta_box',
            __('Submission Details', 'memberfun'),
            array($this, 'render_meta_box'),
            'submission',
            'normal',
            'high'
        );
    }

    /**
     * Render meta box content
     */
    public function render_meta_box($post) {
        wp_nonce_field('submission_meta_box', 'submission_meta_box_nonce');

        $challenge_id = get_post_meta($post->ID, '_submission_challenge_id', true);
        $demo_url = get_post_meta($post->ID, '_submission_demo_url', true);
        $demo_video = get_post_meta($post->ID, '_submission_demo_video', true);

        // Get all published challenges
        $challenges = get_posts(array(
            'post_type' => 'challenge',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));
        ?>
        <p>
            <label for="submission_challenge_id"><?php _e('Challenge:', 'memberfun'); ?></label>
            <select id="submission_challenge_id" name="submission_challenge_id">
                <option value=""><?php _e('Select a Challenge', 'memberfun'); ?></option>
                <?php foreach ($challenges as $challenge) : ?>
                    <option value="<?php echo esc_attr($challenge->ID); ?>" <?php selected($challenge_id, $challenge->ID); ?>>
                        <?php echo esc_html($challenge->post_title); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>
        <p>
            <label for="submission_demo_url"><?php _e('Demo URL:', 'memberfun'); ?></label>
            <input type="url" id="submission_demo_url" name="submission_demo_url" value="<?php echo esc_url($demo_url); ?>" class="widefat" />
        </p>
        <p>
            <label for="submission_demo_video"><?php _e('Demo Video URL:', 'memberfun'); ?></label>
            <input type="url" id="submission_demo_video" name="submission_demo_video" value="<?php echo esc_url($demo_video); ?>" class="widefat" />
        </p>
        <?php
    }

    /**
     * Save meta box data
     */
    public function save_meta_boxes($post_id) {
        if (!isset($_POST['submission_meta_box_nonce'])) {
            return;
        }

        if (!wp_verify_nonce($_POST['submission_meta_box_nonce'], 'submission_meta_box')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $fields = array(
            'submission_challenge_id' => 'intval',
            'submission_demo_url' => 'esc_url_raw',
            'submission_demo_video' => 'esc_url_raw'
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
     * Add custom columns to submission list
     */
    public function add_custom_columns($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            if ($key === 'date') {
                $new_columns['challenge'] = __('Challenge', 'memberfun');
                $new_columns['demo_url'] = __('Demo URL', 'memberfun');
            }
            $new_columns[$key] = $value;
        }
        return $new_columns;
    }

    /**
     * Render custom column content
     */
    public function render_custom_columns($column, $post_id) {
        switch ($column) {
            case 'challenge':
                $challenge_id = get_post_meta($post_id, '_submission_challenge_id', true);
                if ($challenge_id) {
                    $challenge = get_post($challenge_id);
                    if ($challenge) {
                        echo esc_html($challenge->post_title);
                    }
                }
                break;
            case 'demo_url':
                $demo_url = get_post_meta($post_id, '_submission_demo_url', true);
                if ($demo_url) {
                    echo '<a href="' . esc_url($demo_url) . '" target="_blank">' . esc_html($demo_url) . '</a>';
                }
                break;
        }
    }

    /**
     * Register REST API fields
     */
    public function register_rest_fields() {
        register_rest_field('submission', 'challenge_id', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_submission_challenge_id', true);
            },
            'schema' => array(
                'description' => 'Associated challenge ID',
                'type' => 'integer'
            )
        ));

        register_rest_field('submission', 'demo_url', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_submission_demo_url', true);
            },
            'schema' => array(
                'description' => 'Demo URL',
                'type' => 'string',
                'format' => 'uri'
            )
        ));

        register_rest_field('submission', 'demo_video', array(
            'get_callback' => function($post) {
                return get_post_meta($post['id'], '_submission_demo_video', true);
            },
            'schema' => array(
                'description' => 'Demo video URL',
                'type' => 'string',
                'format' => 'uri'
            )
        ));
    }
}

// Initialize the class
new Submission_Post_Type(); 