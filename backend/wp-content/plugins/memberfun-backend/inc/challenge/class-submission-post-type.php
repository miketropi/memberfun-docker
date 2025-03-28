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
        add_action('rest_api_init', array($this, 'register_rest_custom_routes'));
        add_filter('manage_submission_posts_columns', array($this, 'add_custom_columns'));
        add_action('manage_submission_posts_custom_column', array($this, 'render_custom_columns'), 10, 2);
        add_filter('use_block_editor_for_post_type', array($this, 'disable_gutenberg'), 10, 2);
        
        add_action('memberfun_submission_created', array($this, 'submission_created'));
        add_action('memberfun_submission_updated', array($this, 'submission_created'));
    }

    // send mail to admin when submission is created or updated
    public function submission_created($submission_id) {
        $submission = get_post($submission_id);
        $admin_email = get_option('admin_email');
        $submission_url = get_permalink($submission_id);
        $submission_title = $submission->post_title;
        $submission_content = $submission->post_content;
        $submission_author = get_post_field('post_author', $submission_id);
        $submission_author_email = get_the_author_meta('user_email', $submission_author);
        $submission_author_display_name = get_the_author_meta('display_name', $submission_author);
        // demo url
        $submission_demo_url = get_post_meta($submission_id, '_submission_demo_url', true);
        // demo video
        $submission_demo_video = get_post_meta($submission_id, '_submission_demo_video', true);
        
        // _submission_challenge_id
        $challenge_id = get_post_meta($submission_id, '_submission_challenge_id', true);
        $challenge_url = get_permalink($challenge_id);
        $challenge_title = get_the_title($challenge_id);

        $headers = array('Content-Type: text/html; charset=UTF-8');
        $subject = 'New or updated submission: ' . $submission->post_title;
        $message = '
        <html>
        <head>
            <title>New or updated submission: ' . $submission->post_title . '</title>
        </head>
        <body>
            <h2>New or updated submission: ' . $submission->post_title . '</h2>
            <p>A new or updated submission has been created.</p>
            <p><strong>Submission Title:</strong> ' . $submission_title . '</p>
            <p><strong>Submission URL:</strong> <a href="' . $submission_url . '">' . $submission_url . '</a></p>
            <p><strong>Challenge:</strong> <a href="' . $challenge_url . '">' . $challenge_title . '</a></p>
            <p><strong>Author:</strong> ' . $submission_author_display_name . ' (' . $submission_author_email . ')</p>
            <p><strong>Demo URL:</strong> ' . ($submission_demo_url ? '<a href="' . $submission_demo_url . '">' . $submission_demo_url . '</a>' : 'Not provided') . '</p>
            <p><strong>Demo Video:</strong> ' . ($submission_demo_video ? '<a href="' . $submission_demo_video . '">' . $submission_demo_video . '</a>' : 'Not provided') . '</p>
            <p><strong>Content:</strong></p>
            <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 10px;">
                ' . wpautop($submission_content) . '
            </div>
            <p>Please review this submission at your earliest convenience.</p>
        </body>
        </html>';
        
        wp_mail($admin_email, $subject, $message, $headers);
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

        // field author
        register_rest_field('submission', 'author', array(
            'get_callback' => function($post) {
                // get post author by post id
                $author = get_post_field('post_author', $post['id']);
                $display_name = get_the_author_meta( 'display_name' , $author ); 

                return [
                    'id' => $author,
                    'display_name' => $display_name
                ];
            },
            'schema' => array(
                'description' => 'Author',
                'type' => 'array'
            )
        ));

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

        // field __title
        register_rest_field('submission', '__title', array(
            'get_callback' => function($post) {
                return $post['title'];
            },
            'schema' => array(
                'description' => 'Title',
                'type' => 'string'
            )
        ));

        // field __content
        register_rest_field('submission', '__content', array(
            'get_callback' => function($post) {
                return $post['content'];
            },
            'schema' => array(
                'description' => 'Content',
                'type' => 'string'
            )
        ));
    }

    public function register_rest_custom_routes() {
        // get all submissions by challenge id
        register_rest_route('memberfun/v1', '/submissions/(?P<challenge_id>\d+)', array(
            'methods' => 'GET',
            'callback' => function($request) {
                $submissions = get_posts(array(
                    'post_type' => 'submission',
                    'meta_key' => '_submission_challenge_id',
                    'meta_value' => $request['challenge_id'],
                    'posts_per_page' => -1
                ));

                return array_map(function($submission) {
                    return [
                        'id' => $submission->ID,
                        'title' => $submission->post_title,
                        'content' => wpautop($submission->post_content),
                        'date' => $submission->post_date,
                        'author' => [
                            'id' => get_post_field('post_author', $submission->ID),
                            'email' => get_the_author_meta( 'user_email' , get_post_field('post_author', $submission->ID) ),
                            'display_name' => get_the_author_meta( 'display_name' , get_post_field('post_author', $submission->ID) ),
                            'gravatar' => get_avatar_url( get_post_field('post_author', $submission->ID) )
                        ],
                        'challenge_id' => get_post_meta($submission->ID, '_submission_challenge_id', true),
                        'demo_url' => get_post_meta($submission->ID, '_submission_demo_url', true),
                        'demo_video' => get_post_meta($submission->ID, '_submission_demo_video', true),
                        'count_comments' => get_comments_number($submission->ID)
                    ];
                }, $submissions);
            },
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));

        register_rest_route('memberfun/v1', '/create-submission', array(
            'methods' => 'POST',
            'callback' => function($request) {
                $data = $request->get_json_params();
                $submission = array(
                    'post_title' => $data['title'],
                    'post_content' => $data['content'],
                    'post_status' => 'publish',
                    'post_type' => 'submission',
                    'meta_input' => array(
                        '_submission_challenge_id' => $data['meta']['_submission_challenge_id'],
                        '_submission_demo_url' => $data['meta']['_submission_demo_url'],
                        '_submission_demo_video' => $data['meta']['_submission_demo_video']
                    )
                );

                $submission_id = wp_insert_post($submission);

                if (is_wp_error($submission_id)) {
                    return new WP_REST_Response($submission_id->get_error_message(), 400);
                }

                do_action('memberfun_submission_created', $submission_id);

                return new WP_REST_Response([
                    'id' => $submission_id,
                    'status' => 'success'
                ], 200);
            },
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));

        // update submission
        register_rest_route('memberfun/v1', '/update-submission/(?P<submission_id>\d+)', array(
            'methods' => 'PUT',
            'callback' => function($request) {
                $submission_id = $request['submission_id'];
                $data = $request->get_json_params();
                // return new WP_REST_Response($data, 200);
                $submission = array(
                    'ID' => $submission_id,
                    'post_title' => $data['title'],
                    'post_content' => $data['content'],
                    'meta_input' => array(
                        // '_submission_challenge_id' => $data['meta']['_submission_challenge_id'],
                        '_submission_demo_url' => $data['meta']['_submission_demo_url'],
                        '_submission_demo_video' => $data['meta']['_submission_demo_video']
                    )
                );

                $__submission_id = wp_update_post($submission);

                // update_post_meta($data['id'], '_submission_demo_url', $data['meta']['_submission_demo_url']);
                // update_post_meta($data['id'], '_submission_demo_video', $data['meta']['_submission_demo_video']);

                if (is_wp_error($submission_id)) {
                    return new WP_REST_Response($submission_id->get_error_message(), 400);
                }

                do_action('memberfun_submission_updated', $submission_id);

                return new WP_REST_Response([
                    'id' => $submission_id,
                    'status' => 'success'
                ], 200);
            },
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
    }
}

// Initialize the class
new Submission_Post_Type(); 