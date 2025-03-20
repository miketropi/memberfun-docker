<?php
/**
 * MemberFun Semina - Admin Interface
 * 
 * Enhances the admin interface for the Member Semina post type
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Modify the columns displayed in the admin list view
 * 
 * @param array $columns The default columns
 * @return array Modified columns
 */
function memberfun_semina_modify_columns($columns) {
    $new_columns = array();
    
    // Add checkbox and title at the beginning
    if (isset($columns['cb'])) {
        $new_columns['cb'] = $columns['cb'];
    }
    if (isset($columns['title'])) {
        $new_columns['title'] = $columns['title'];
    }
    
    // Add our custom columns
    $new_columns['seminar_date'] = __('Date & Time', 'memberfun-backend');
    $new_columns['seminar_host'] = __('Host', 'memberfun-backend');
    $new_columns['seminar_location'] = __('Location', 'memberfun-backend');
    $new_columns['seminar_capacity'] = __('Capacity', 'memberfun-backend');
    $new_columns['seminar_documents'] = __('Documents', 'memberfun-backend');
    
    // Add remaining columns
    foreach ($columns as $key => $value) {
        if (!isset($new_columns[$key]) && $key != 'date') {
            $new_columns[$key] = $value;
        }
    }
    
    // Always add date at the end
    $new_columns['date'] = __('Published', 'memberfun-backend');
    
    return $new_columns;
}

/**
 * Display content for custom columns
 * 
 * @param string $column The column name
 * @param int $post_id The post ID
 */
function memberfun_semina_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'seminar_date':
            $date = get_post_meta($post_id, '_memberfun_semina_date', true);
            $time = get_post_meta($post_id, '_memberfun_semina_time', true);
            
            if (!empty($date)) {
                $formatted_date = date_i18n(get_option('date_format'), strtotime($date));
                echo esc_html($formatted_date);
                
                if (!empty($time)) {
                    echo '<br>';
                    echo esc_html(date_i18n(get_option('time_format'), strtotime($time)));
                }
            } else {
                echo '—';
            }
            break;
            
        case 'seminar_host':
            $host_id = get_post_meta($post_id, '_memberfun_semina_host', true);
            if (!empty($host_id)) {
                $host = get_userdata($host_id);
                if ($host) {
                    echo '<a href="' . esc_url(get_edit_user_link($host_id)) . '">' . esc_html($host->display_name) . '</a>';
                } else {
                    echo '—';
                }
            } else {
                echo '—';
            }
            break;
            
        case 'seminar_location':
            $location = get_post_meta($post_id, '_memberfun_semina_location', true);
            echo !empty($location) ? esc_html($location) : '—';
            break;
            
        case 'seminar_capacity':
            $capacity = get_post_meta($post_id, '_memberfun_semina_capacity', true);
            echo !empty($capacity) ? esc_html($capacity) : __('Unlimited', 'memberfun-backend');
            break;
            
        case 'seminar_documents':
            $documents = get_post_meta($post_id, '_memberfun_semina_documents', true);
            if (!empty($documents) && is_array($documents)) {
                echo count($documents);
            } else {
                echo '0';
            }
            break;
    }
}

/**
 * Make custom columns sortable
 * 
 * @param array $columns The sortable columns
 * @return array Modified sortable columns
 */
function memberfun_semina_sortable_columns($columns) {
    $columns['seminar_date'] = 'seminar_date';
    $columns['seminar_host'] = 'seminar_host';
    $columns['seminar_capacity'] = 'seminar_capacity';
    
    return $columns;
}

/**
 * Add custom filters to the admin list view
 * 
 * @param string $post_type The current post type
 */
function memberfun_semina_add_admin_filters($post_type) {
    if ($post_type !== 'memberfun_semina') {
        return;
    }
    
    // Host filter
    $selected_host = isset($_GET['seminar_host']) ? absint($_GET['seminar_host']) : 0;
    
    // Get all hosts who have seminars
    $hosts = array();
    $seminars = get_posts(array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => -1,
        'fields' => 'ids',
    ));
    
    foreach ($seminars as $seminar_id) {
        $host_id = get_post_meta($seminar_id, '_memberfun_semina_host', true);
        if (!empty($host_id) && !isset($hosts[$host_id])) {
            $host = get_userdata($host_id);
            if ($host) {
                $hosts[$host_id] = $host->display_name;
            }
        }
    }
    
    if (!empty($hosts)) {
        echo '<select name="seminar_host">';
        echo '<option value="0">' . __('All Hosts', 'memberfun-backend') . '</option>';
        
        foreach ($hosts as $host_id => $host_name) {
            printf(
                '<option value="%s" %s>%s</option>',
                esc_attr($host_id),
                selected($selected_host, $host_id, false),
                esc_html($host_name)
            );
        }
        
        echo '</select>';
    }
    
    // Date range filter
    $start_date = isset($_GET['seminar_start_date']) ? sanitize_text_field($_GET['seminar_start_date']) : '';
    $end_date = isset($_GET['seminar_end_date']) ? sanitize_text_field($_GET['seminar_end_date']) : '';
    
    echo '<input type="date" name="seminar_start_date" placeholder="' . esc_attr__('Start Date', 'memberfun-backend') . '" value="' . esc_attr($start_date) . '" />';
    echo '<input type="date" name="seminar_end_date" placeholder="' . esc_attr__('End Date', 'memberfun-backend') . '" value="' . esc_attr($end_date) . '" />';
}

/**
 * Modify the query based on the custom filters
 * 
 * @param WP_Query $query The WordPress query object
 */
function memberfun_semina_filter_query($query) {
    global $pagenow;
    
    // Check if we're in the admin area, on the edit.php page, and viewing our custom post type
    if (is_admin() && $pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'memberfun_semina') {
        $meta_query = array();
        
        // Filter by host
        if (isset($_GET['seminar_host']) && !empty($_GET['seminar_host'])) {
            $meta_query[] = array(
                'key' => '_memberfun_semina_host',
                'value' => absint($_GET['seminar_host']),
                'compare' => '=',
            );
        }
        
        // Filter by date range
        if (isset($_GET['seminar_start_date']) && !empty($_GET['seminar_start_date'])) {
            $meta_query[] = array(
                'key' => '_memberfun_semina_date',
                'value' => sanitize_text_field($_GET['seminar_start_date']),
                'compare' => '>=',
                'type' => 'DATE',
            );
        }
        
        if (isset($_GET['seminar_end_date']) && !empty($_GET['seminar_end_date'])) {
            $meta_query[] = array(
                'key' => '_memberfun_semina_date',
                'value' => sanitize_text_field($_GET['seminar_end_date']),
                'compare' => '<=',
                'type' => 'DATE',
            );
        }
        
        // Apply meta query if we have any conditions
        if (!empty($meta_query)) {
            $query->set('meta_query', $meta_query);
        }
        
        // Handle sorting
        if (isset($query->query_vars['orderby'])) {
            switch ($query->query_vars['orderby']) {
                case 'seminar_date':
                    $query->set('meta_key', '_memberfun_semina_date');
                    $query->set('orderby', 'meta_value');
                    break;
                    
                case 'seminar_host':
                    $query->set('meta_key', '_memberfun_semina_host');
                    $query->set('orderby', 'meta_value_num');
                    break;
                    
                case 'seminar_capacity':
                    $query->set('meta_key', '_memberfun_semina_capacity');
                    $query->set('orderby', 'meta_value_num');
                    break;
            }
        }
    }
    
    return $query;
}

/**
 * Add quick edit support for seminar details
 */
function memberfun_semina_quick_edit_fields() {
    global $post;
    
    // Only add for our post type
    if ($post->post_type !== 'memberfun_semina') {
        return;
    }
    
    // Add nonce for security
    wp_nonce_field('memberfun_semina_quick_edit_nonce', 'memberfun_semina_quick_edit_nonce');
    
    // Add hidden fields with the current values
    $date = get_post_meta($post->ID, '_memberfun_semina_date', true);
    $time = get_post_meta($post->ID, '_memberfun_semina_time', true);
    $host = get_post_meta($post->ID, '_memberfun_semina_host', true);
    $location = get_post_meta($post->ID, '_memberfun_semina_location', true);
    $capacity = get_post_meta($post->ID, '_memberfun_semina_capacity', true);
    
    ?>
    <div class="memberfun-semina-inline-data">
        <div class="_memberfun_semina_date"><?php echo esc_attr($date); ?></div>
        <div class="_memberfun_semina_time"><?php echo esc_attr($time); ?></div>
        <div class="_memberfun_semina_host"><?php echo esc_attr($host); ?></div>
        <div class="_memberfun_semina_location"><?php echo esc_attr($location); ?></div>
        <div class="_memberfun_semina_capacity"><?php echo esc_attr($capacity); ?></div>
    </div>
    <?php
}
add_action('admin_head-edit.php', 'memberfun_semina_quick_edit_javascript');

/**
 * Add JavaScript for quick edit functionality
 */
function memberfun_semina_quick_edit_javascript() {
    global $current_screen;
    
    if ($current_screen->post_type != 'memberfun_semina') {
        return;
    }
    
    ?>
    <script type="text/javascript">
    jQuery(document).ready(function($) {
        // Add our custom fields to the quick edit form
        var $wp_inline_edit = inlineEditPost.edit;
        
        inlineEditPost.edit = function(id) {
            // Call the original function
            $wp_inline_edit.apply(this, arguments);
            
            // Get the post ID
            var post_id = 0;
            if (typeof(id) == 'object') {
                post_id = parseInt(this.getId(id));
            }
            
            if (post_id > 0) {
                // Get the row with inline data
                var $row = $('#post-' + post_id);
                
                // Get our custom field values
                var date = $row.find('div._memberfun_semina_date').text();
                var time = $row.find('div._memberfun_semina_time').text();
                var host = $row.find('div._memberfun_semina_host').text();
                var location = $row.find('div._memberfun_semina_location').text();
                var capacity = $row.find('div._memberfun_semina_capacity').text();
                
                // Set the values in the quick edit form
                var $edit_row = $('#edit-' + post_id);
                $edit_row.find('input[name="memberfun_semina_date"]').val(date);
                $edit_row.find('input[name="memberfun_semina_time"]').val(time);
                $edit_row.find('select[name="memberfun_semina_host"]').val(host);
                $edit_row.find('input[name="memberfun_semina_location"]').val(location);
                $edit_row.find('input[name="memberfun_semina_capacity"]').val(capacity);
            }
        };
    });
    </script>
    <?php
}

/**
 * Add our custom fields to the quick edit form
 */
function memberfun_semina_quick_edit_form() {
    global $current_screen;
    
    if ($current_screen->post_type != 'memberfun_semina') {
        return;
    }
    
    ?>
    <fieldset class="inline-edit-col-right">
        <div class="inline-edit-col">
            <span class="title"><?php _e('Seminar Details', 'memberfun-backend'); ?></span>
            
            <label>
                <span class="title"><?php _e('Date', 'memberfun-backend'); ?></span>
                <input type="date" name="memberfun_semina_date" value="" />
            </label>
            
            <label>
                <span class="title"><?php _e('Time', 'memberfun-backend'); ?></span>
                <input type="time" name="memberfun_semina_time" value="" />
            </label>
            
            <label>
                <span class="title"><?php _e('Host', 'memberfun-backend'); ?></span>
                <?php
                wp_dropdown_users(array(
                    'name' => 'memberfun_semina_host',
                    'show_option_none' => __('Select a host', 'memberfun-backend'),
                    'role__in' => array('administrator', 'editor', 'author'),
                ));
                ?>
            </label>
            
            <label>
                <span class="title"><?php _e('Location', 'memberfun-backend'); ?></span>
                <input type="text" name="memberfun_semina_location" value="" />
            </label>
            
            <label>
                <span class="title"><?php _e('Capacity', 'memberfun-backend'); ?></span>
                <input type="number" name="memberfun_semina_capacity" value="" min="1" />
            </label>
        </div>
    </fieldset>
    <?php
}
add_action('quick_edit_custom_box', 'memberfun_semina_quick_edit_form', 10, 2);

/**
 * Save quick edit data
 * 
 * @param int $post_id The post ID
 */
function memberfun_semina_save_quick_edit($post_id) {
    // Check if this is a quick edit
    if (!isset($_POST['_inline_edit']) || !wp_verify_nonce($_POST['memberfun_semina_quick_edit_nonce'], 'memberfun_semina_quick_edit_nonce')) {
        return;
    }
    
    // Check post type
    if (get_post_type($post_id) !== 'memberfun_semina') {
        return;
    }
    
    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Save the data
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
}
add_action('save_post', 'memberfun_semina_save_quick_edit');

/**
 * Add custom bulk actions
 * 
 * @param array $actions The default bulk actions
 * @return array Modified bulk actions
 */
function memberfun_semina_bulk_actions($actions) {
    $actions['send_notification'] = __('Send Notification', 'memberfun-backend');
    return $actions;
}
add_filter('bulk_actions-edit-memberfun_semina', 'memberfun_semina_bulk_actions');

/**
 * Handle custom bulk actions
 * 
 * @param string $redirect_url The redirect URL
 * @param string $action The action being taken
 * @param array $post_ids The posts being processed
 * @return string The redirect URL
 */
function memberfun_semina_handle_bulk_actions($redirect_url, $action, $post_ids) {
    if ($action !== 'send_notification') {
        return $redirect_url;
    }
    
    $processed = 0;
    
    foreach ($post_ids as $post_id) {
        // Send notification for each selected seminar
        if (memberfun_semina_send_notification($post_id)) {
            $processed++;
        }
    }
    
    return add_query_arg('bulk_notifications_sent', $processed, $redirect_url);
}
add_filter('handle_bulk_actions-edit-memberfun_semina', 'memberfun_semina_handle_bulk_actions', 10, 3);

/**
 * Display admin notices for bulk actions
 */
function memberfun_semina_bulk_action_admin_notice() {
    if (!empty($_REQUEST['bulk_notifications_sent'])) {
        $count = intval($_REQUEST['bulk_notifications_sent']);
        $message = sprintf(
            _n(
                'Notification sent for %s seminar.',
                'Notifications sent for %s seminars.',
                $count,
                'memberfun-backend'
            ),
            number_format_i18n($count)
        );
        echo '<div class="updated"><p>' . esc_html($message) . '</p></div>';
    }
}
add_action('admin_notices', 'memberfun_semina_bulk_action_admin_notice'); 

# make ajax function memberfun_delete_rating_ajax
function memberfun_delete_rating_ajax() {
    // get data from fetch formData
    $data = wp_unslash($_POST);
    $user_id = (int) $data['user_id'];
    $post_id = (int) $data['post_id'];

    // delete rating
    $rating = get_post_meta($post_id, '_memberfun_semina_ratings', true);
    $rating = array_filter($rating, function($rating) use ($user_id) {

        if ($rating['rating_user_id'] === $user_id) {
            // point_id
            $point_id = $rating['point_id'];

            // delete point
            if ($point_id) {
                memberfun_delete_points_transaction($point_id);
            }
        }

        return $rating['rating_user_id'] !== $user_id;
    });

    update_post_meta($post_id, '_memberfun_semina_ratings', $rating);

    wp_send_json_success(
        array(
            'success' => true,
            'message' => 'Rating deleted successfully',
            'rating' => $rating,
        )
    );
}

add_action('wp_ajax_memberfun_delete_rating_ajax', 'memberfun_delete_rating_ajax');
add_action('wp_ajax_nopriv_memberfun_delete_rating_ajax', 'memberfun_delete_rating_ajax');