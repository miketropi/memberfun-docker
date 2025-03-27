<?php
/**
 * MemberFun Semina - Meta Fields
 * 
 * Handles custom meta fields for the Member Semina post type
 */

/**
 * Register meta boxes for the Member Semina post type
 */
function memberfun_semina_register_meta_boxes() {
    add_meta_box(
        'memberfun_semina_details',
        __('Seminar Details', 'memberfun-backend'),
        'memberfun_semina_details_meta_box_callback',
        'memberfun_semina',
        'normal',
        'high'
    );

    add_meta_box(
        'memberfun_semina_documents',
        __('Seminar Documents', 'memberfun-backend'),
        'memberfun_semina_documents_meta_box_callback',
        'memberfun_semina',
        'normal',
        'high'
    );

    # add custom meta box for seminar ratings
    add_meta_box(
        'memberfun_semina_ratings',
        __('Seminar Ratings', 'memberfun-backend'),
        'memberfun_semina_ratings_meta_box_callback',
        'memberfun_semina',
        'normal',
        'high'
    );
}

/**
 * Callback function for the seminar ratings meta box
 * 
 * @param WP_Post $post The post object
 */
function memberfun_semina_ratings_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('memberfun_semina_save_meta', 'memberfun_semina_meta_nonce');

    // Get the current ratings
    $ratings = get_post_meta($post->ID, '_memberfun_semina_ratings', true);
    if (!is_array($ratings)) {
        $ratings = array();
    }

    # validate if ratings is empty
    if (empty($ratings)) {
        echo '<p>' . __('No ratings yet', 'memberfun-backend') . '</p>';
        return;
    }

    ob_start();
    
    // Display the ratings
    echo '<ul class="memberfun-semina-rating-list">';
    foreach ($ratings as $rating) {
        $rating_user_id = $rating['rating_user_id'];
        $rating_user_info = get_user_by('id', $rating_user_id);
        $rating_user_display_name = $rating_user_info->display_name;
        $rating_user_email = $rating_user_info->user_email;
        $rating_user_avatar = get_avatar_url($rating_user_id);
        $rating_data = $rating['rating_data']; // ["skill": "5", "quality": "5", "usefulness": "5"]
        // $rating_point_id = $rating['point_id'];
        
        ?>
        <li class="rating-list-item rating-list-item-<?php echo esc_attr($rating_user_id); ?>">
            <div class="rating-card">
                <div class="rating-header">
                    <div class="rating-avatar">
                        <img src="<?php echo esc_url($rating_user_avatar); ?>" 
                             alt="<?php echo esc_attr($rating_user_display_name); ?>"
                             class="avatar-img">
                    </div>
                    <div class="rating-user">
                        <h4 class="user-name">
                            <?php echo esc_html($rating_user_display_name); ?>
                        </h4>
                        <span class="user-email"><?php echo esc_html($rating_user_email); ?></span>
                    </div>
                </div>

                <div class="rating-scores">
                    <?php
                    $rating_categories = [
                        'skill' => __('Skill', 'memberfun-backend'),
                        'quality' => __('Quality', 'memberfun-backend'), 
                        'usefulness' => __('Usefulness', 'memberfun-backend')
                    ];
                    
                    foreach ($rating_categories as $key => $label): ?>
                        <div class="score-item">
                            <span class="score-label"><?php echo esc_html($label); ?></span>
                            <div class="score-value">
                                <span class="score-number"><?php echo esc_html($rating_data[$key]); ?></span>
                                <span class="score-max">/5</span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="rating-actions">
                    <button 
                        type="button" 
                        data-user-id="<?php echo esc_attr($rating_user_id); ?>"
                        data-post-id="<?php echo esc_attr($post->ID); ?>"
                        class="button button-small delete-rating memberfun-delete-rating">
                        <?php _e('Delete Rating', 'memberfun-backend'); ?>
                    </button>
                </div>
            </div>
        </li>
        <?php
    }
    echo '</ul>';
    $ratings_html = ob_get_clean();
    echo $ratings_html;
}

/**
 * Callback function for the seminar details meta box
 * 
 * @param WP_Post $post The post object
 */
function memberfun_semina_details_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('memberfun_semina_save_meta', 'memberfun_semina_meta_nonce');

    // Get the current values if they exist
    $seminar_double_points = get_post_meta($post->ID, '_memberfun_semina_double_points', true);
    $seminar_date = get_post_meta($post->ID, '_memberfun_semina_date', true);
    $seminar_time = get_post_meta($post->ID, '_memberfun_semina_time', true);
    $seminar_host = get_post_meta($post->ID, '_memberfun_semina_host', true);
    $seminar_location = get_post_meta($post->ID, '_memberfun_semina_location', true);
    $seminar_capacity = get_post_meta($post->ID, '_memberfun_semina_capacity', true);
    
    // Format date for display
    $date_value = !empty($seminar_date) ? date('Y-m-d', strtotime($seminar_date)) : '';
    $time_value = !empty($seminar_time) ? $seminar_time : '';
    
    ?>
    <div class="memberfun-semina-meta-box">

        <p>
            <label for="memberfun_semina_double_points"><?php _e('Allow Double Points', 'memberfun-backend'); ?>:</label>
            <?php
            $double_points = !empty($seminar_double_points) ? 'checked' : '';
            ?>
            <input type="checkbox" id="memberfun_semina_double_points" name="memberfun_semina_double_points" value="1" <?php echo $double_points; ?> />
            <span class="description"><?php _e('Enable x2 points for this seminar', 'memberfun-backend'); ?></span>
        </p>

        <p>
            <label for="memberfun_semina_date"><?php _e('Seminar Date', 'memberfun-backend'); ?>:</label>
            <input type="date" id="memberfun_semina_date" name="memberfun_semina_date" value="<?php echo esc_attr($date_value); ?>" class="widefat" required />
            <span class="description"><?php _e('The date when the seminar will take place', 'memberfun-backend'); ?></span>
        </p>
        
        <p>
            <label for="memberfun_semina_time"><?php _e('Seminar Time', 'memberfun-backend'); ?>:</label>
            <input type="time" id="memberfun_semina_time" name="memberfun_semina_time" value="<?php echo esc_attr($time_value); ?>" class="widefat" required />
            <span class="description"><?php _e('The time when the seminar will start', 'memberfun-backend'); ?></span>
        </p>
        
        <p>
            <label for="memberfun_semina_host"><?php _e('Seminar Host', 'memberfun-backend'); ?>:</label>
            <?php
            // Create a dropdown of WordPress users
            wp_dropdown_users(array(
                'name' => 'memberfun_semina_host',
                'selected' => $seminar_host,
                'show_option_none' => __('Select a host', 'memberfun-backend'),
                'class' => 'widefat',
                'role__in' => array('administrator', 'editor', 'author'),
                'id' => 'memberfun_semina_host',
            ));
            ?>
            <span class="description"><?php _e('The person who will host this seminar', 'memberfun-backend'); ?></span>
        </p>
        
        <p>
            <label for="memberfun_semina_location"><?php _e('Seminar Location', 'memberfun-backend'); ?>:</label>
            <input type="text" id="memberfun_semina_location" name="memberfun_semina_location" value="<?php echo esc_attr($seminar_location); ?>" class="widefat" />
            <span class="description"><?php _e('The location where the seminar will take place (physical address or online platform)', 'memberfun-backend'); ?></span>
        </p>
        
        <p>
            <label for="memberfun_semina_capacity"><?php _e('Seminar Capacity', 'memberfun-backend'); ?>:</label>
            <input type="number" id="memberfun_semina_capacity" name="memberfun_semina_capacity" value="<?php echo esc_attr($seminar_capacity); ?>" class="widefat" min="1" />
            <span class="description"><?php _e('Maximum number of participants (leave empty for unlimited)', 'memberfun-backend'); ?></span>
        </p>
    </div>
    <?php
}

/**
 * Callback function for the seminar documents meta box
 * 
 * @param WP_Post $post The post object
 */
function memberfun_semina_documents_meta_box_callback($post) {
    // Get existing documents
    $documents = get_post_meta($post->ID, '_memberfun_semina_documents', true);
    if (!is_array($documents)) {
        $documents = array();
    }
    
    ?>
    <div class="memberfun-semina-documents">
        <div id="memberfun-semina-document-list">
            <?php
            if (!empty($documents)) {
                foreach ($documents as $index => $document) {
                    ?>
                    <div class="memberfun-semina-document-item">
                        <input type="hidden" name="memberfun_semina_documents[<?php echo $index; ?>][id]" value="<?php echo esc_attr($document['id']); ?>" />
                        <p>
                            <strong><?php echo esc_html($document['title']); ?></strong> 
                            <a href="<?php echo esc_url($document['url']); ?>" target="_blank"><?php _e('View', 'memberfun-backend'); ?></a> | 
                            <a href="#" class="memberfun-remove-document" data-index="<?php echo $index; ?>"><?php _e('Remove', 'memberfun-backend'); ?></a>
                        </p>
                    </div>
                    <?php
                }
            }
            ?>
        </div>
        
        <p>
            <button type="button" class="button" id="memberfun-add-document"><?php _e('Add Document', 'memberfun-backend'); ?></button>
        </p>
        
        <input type="hidden" name="memberfun_semina_documents_data" id="memberfun-semina-documents-data" value="" />
    </div>
    
    <script>
    jQuery(document).ready(function($) {
        // Store the current documents
        var documents = <?php echo json_encode($documents); ?>;
        
        // Update the hidden field with the documents data
        function updateDocumentsData() {
            $('#memberfun-semina-documents-data').val(JSON.stringify(documents));
        }
        
        // Initialize
        updateDocumentsData();
        
        // Add document button click handler
        $('#memberfun-add-document').on('click', function(e) {
            e.preventDefault();
            
            // Open the media library
            var mediaUploader = wp.media({
                title: '<?php _e('Select Document', 'memberfun-backend'); ?>',
                button: {
                    text: '<?php _e('Add to Seminar', 'memberfun-backend'); ?>'
                },
                multiple: false,
                library: {
                    type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
                }
            });
            
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                
                // Add to documents array
                var newIndex = documents.length;
                documents.push({
                    id: attachment.id,
                    title: attachment.title,
                    url: attachment.url,
                    filename: attachment.filename
                });
                
                // Add to the UI
                var newItem = $('<div class="memberfun-semina-document-item"></div>');
                newItem.append('<input type="hidden" name="memberfun_semina_documents[' + newIndex + '][id]" value="' + attachment.id + '" />');
                newItem.append('<p><strong>' + attachment.title + '</strong> <a href="' + attachment.url + '" target="_blank"><?php _e('View', 'memberfun-backend'); ?></a> | <a href="#" class="memberfun-remove-document" data-index="' + newIndex + '"><?php _e('Remove', 'memberfun-backend'); ?></a></p>');
                
                $('#memberfun-semina-document-list').append(newItem);
                
                // Update hidden field
                updateDocumentsData();
            });
            
            mediaUploader.open();
        });
        
        // Remove document click handler (delegated)
        $(document).on('click', '.memberfun-remove-document', function(e) {
            e.preventDefault();
            
            var index = $(this).data('index');
            
            // Remove from the array
            documents.splice(index, 1);
            
            // Remove from the UI
            $(this).closest('.memberfun-semina-document-item').remove();
            
            // Update hidden field
            updateDocumentsData();
            
            // Reindex the remaining items
            $('.memberfun-semina-document-item').each(function(newIndex) {
                $(this).find('input[type="hidden"]').attr('name', 'memberfun_semina_documents[' + newIndex + '][id]');
                $(this).find('.memberfun-remove-document').data('index', newIndex);
            });
        });
    });
    </script>
    <?php
}

/**
 * Save the meta box data
 * 
 * @param int $post_id The post ID
 * @param WP_Post $post The post object
 * @param bool $update Whether this is an existing post being updated
 */
function memberfun_semina_save_meta($post_id, $post, $update) {
    // Check if our nonce is set and verify it
    if (!isset($_POST['memberfun_semina_meta_nonce']) || !wp_verify_nonce($_POST['memberfun_semina_meta_nonce'], 'memberfun_semina_save_meta')) {
        return;
    }
    
    // Check if this is an autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Check the user's permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // save double points
    if (isset($_POST['memberfun_semina_double_points'])) {
        update_post_meta($post_id, '_memberfun_semina_double_points', absint($_POST['memberfun_semina_double_points']));
    } else {
        delete_post_meta($post_id, '_memberfun_semina_double_points');
    }

    // Save seminar details
    if (isset($_POST['memberfun_semina_date'])) {
        update_post_meta($post_id, '_memberfun_semina_date', sanitize_text_field($_POST['memberfun_semina_date']));
    }
    
    if (isset($_POST['memberfun_semina_time'])) {
        update_post_meta($post_id, '_memberfun_semina_time', sanitize_text_field($_POST['memberfun_semina_time']));
    }
    
    if (isset($_POST['memberfun_semina_host'])) {
        update_post_meta($post_id, '_memberfun_semina_host', absint($_POST['memberfun_semina_host']));
    }
    
    if (isset($_POST['memberfun_semina_location'])) {
        update_post_meta($post_id, '_memberfun_semina_location', sanitize_text_field($_POST['memberfun_semina_location']));
    }
    
    if (isset($_POST['memberfun_semina_capacity'])) {
        update_post_meta($post_id, '_memberfun_semina_capacity', absint($_POST['memberfun_semina_capacity']));
    }
    
    // Save documents
    if (isset($_POST['memberfun_semina_documents_data']) && !empty($_POST['memberfun_semina_documents_data'])) {
        $documents_data = json_decode(stripslashes($_POST['memberfun_semina_documents_data']), true);
        if (is_array($documents_data)) {
            update_post_meta($post_id, '_memberfun_semina_documents', $documents_data);
        }
    } else {
        // No documents, clear the meta
        delete_post_meta($post_id, '_memberfun_semina_documents');
    }
}

/**
 * Register meta fields for REST API
 */
function memberfun_semina_register_meta_fields() {
    // register double points
    register_post_meta('memberfun_semina', '_memberfun_semina_double_points', array(
        'show_in_rest' => false,
        'single' => true,
        'type' => 'boolean',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    register_post_meta('memberfun_semina', '_memberfun_semina_date', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'string',
                    'format' => 'date',
                ],
            ],
        ],
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
    
    register_post_meta('memberfun_semina', '_memberfun_semina_time', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'string',
                    'format' => 'time',
                ],
            ],
        ],
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
    
    register_post_meta('memberfun_semina', '_memberfun_semina_host', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'integer',
                ],
            ],
        ],
        'single' => true,
        'type' => 'integer',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
    
    register_post_meta('memberfun_semina', '_memberfun_semina_location', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'string',
                ],
            ],
        ],
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
    
    register_post_meta('memberfun_semina', '_memberfun_semina_capacity', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'integer',
                ],
            ],
        ],
        'single' => true,
        'type' => 'integer',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
    
    register_post_meta('memberfun_semina', '_memberfun_semina_documents', array(
        'show_in_rest' => [
            'schema' => [
                'items' => [
                    'type' => 'array',
                ],
            ],
        ],
        'single' => true,
        'type' => 'array',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}

// Register meta fields for REST API
add_action('init', 'memberfun_semina_register_meta_fields');

/**
 * Enqueue admin scripts and styles
 */
function memberfun_semina_admin_scripts($hook) {
    global $post;
    
    // Only enqueue on semina post type edit screen
    if ($hook == 'post.php' || $hook == 'post-new.php') {
        if (isset($post) && $post->post_type == 'memberfun_semina') {
            wp_enqueue_media();
            wp_enqueue_style('memberfun-semina-admin', MEMBERFUN_BACKEND_URL . 'inc/semina/assets/css/admin.css', array(), MEMBERFUN_BACKEND_VERSION);
            wp_enqueue_script('memberfun-semina-admin', MEMBERFUN_BACKEND_URL . 'inc/semina/assets/js/admin.js', array('jquery'), MEMBERFUN_BACKEND_VERSION, true);
        }
    }
} 