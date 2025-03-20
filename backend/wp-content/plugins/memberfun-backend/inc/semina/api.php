<?php
/**
 * MemberFun Semina - API
 * 
 * Implements REST API endpoints for the Member Semina post type
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Register custom REST API endpoints
 */
function memberfun_semina_register_api_routes() {

    // get seminars 
    register_rest_route('memberfun/v1', '/seminars', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_seminars',
        'permission_callback' => '__return_true',
    ));

    // Register route for upcoming seminars
    register_rest_route('memberfun/v1', '/seminars/upcoming', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_upcoming_seminars',
        'permission_callback' => '__return_true',
        'args' => array(
            'limit' => array(
                'default' => 10,
                'sanitize_callback' => 'absint',
            ),
            'offset' => array(
                'default' => 0,
                'sanitize_callback' => 'absint',
            ),
        ),
    ));
    
    // Register route for seminars by host
    register_rest_route('memberfun/v1', '/seminars/by-host/(?P<host_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_seminars_by_host',
        'permission_callback' => '__return_true',
        'args' => array(
            'host_id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ),
            'limit' => array(
                'default' => 10,
                'sanitize_callback' => 'absint',
            ),
            'offset' => array(
                'default' => 0,
                'sanitize_callback' => 'absint',
            ),
        ),
    ));
    
    // Register route for seminar calendar data
    register_rest_route('memberfun/v1', '/seminars/calendar', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_calendar_data',
        'permission_callback' => '__return_true',
        'args' => array(
            'start_date' => array(
                'default' => date('Y-m-d', strtotime('first day of this month')),
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'end_date' => array(
                'default' => date('Y-m-d', strtotime('last day of this month')),
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
    
    // Register route for exporting seminar to iCal
    register_rest_route('memberfun/v1', '/seminars/(?P<id>\d+)/ical', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_ical',
        'permission_callback' => '__return_true',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ),
        ),
    ));

    register_rest_route('memberfun/v1', '/seminars/(?P<id>\d+)/rating', array(
        'methods' => 'POST',
        'callback' => 'memberfun_semina_add_rating',
        'permission_callback' => 'memberfun_semina_add_rating_permission',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ),
            'ratingData' => array(
                'required' => true,
            ),
        ),
    ));

    register_rest_route('memberfun/v1', '/seminars/(?P<id>\d+)/ratings', array(
        'methods' => 'GET',
        'callback' => 'memberfun_semina_get_ratings',
        'permission_callback' => '__return_true',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
                'sanitize_callback' => 'absint',
            ),
        ),
    ));
    
}

function memberfun_semina_add_rating_permission($request) {
    return current_user_can('edit_posts');
}

# memberfun_semina_get_ratings
function memberfun_semina_get_ratings($request) {
    $seminar_post_id = $request->get_param('id');
    $ratings = memberfun_semina_get_ratings_by_seminar_id($seminar_post_id);

    return rest_ensure_response($ratings);
}

# get seminar ratings by seminar id
function memberfun_semina_get_ratings_by_seminar_id($seminar_post_id) {
    $ratings = get_post_meta($seminar_post_id, '_memberfun_semina_ratings', true);

    # is empty then return empty
    if (empty($ratings)) {
        return;
    }

    $ratings = array_values($ratings);

    return array_map(function($rating) {

        $rating_user_id = $rating['rating_user_id'];
        // get user info
        $user_info = get_user_by('id', $rating_user_id);
        $rating['user_display_name'] = $user_info->display_name;
        $rating['user_email'] = $user_info->user_email;
        $rating['user_avatar'] = get_avatar_url($rating_user_id);

        return $rating;
    }, $ratings);
}

# validate current user had rating for this seminar
function memberfun_semina_validate_rating($seminar_post_id) {
    $user_id = get_current_user_id();
    $ratings = get_post_meta($seminar_post_id, '_memberfun_semina_ratings', true);

    # find in ratings array with rating_user_id
    $rating = array_filter($ratings, function($rating) use ($user_id) {
        return $rating['rating_user_id'] === $user_id;
    });

    return count($rating) > 0;
}

# validate current user is host of this seminar
function memberfun_semina_validate_host($seminar_post_id) {
    $host_id = get_post_meta($seminar_post_id, '_memberfun_semina_host', true);
    return ((int) $host_id === get_current_user_id());
}

function memberfun_semina_add_rating($request) {
    
    $seminar_post_id = $request->get_param('id');
    $rating_data = $request->get_param('ratingData');
    $user_id = get_current_user_id();

    $host_id = get_post_meta($seminar_post_id, '_memberfun_semina_host', true);
    $host_user_id = (int) $host_id;

    if (memberfun_semina_validate_host($seminar_post_id)) {
        return rest_ensure_response([
            'success' => false,
            'message' => 'You are is host of this seminar, you can not rate it',
        ]);
    }

    if (memberfun_semina_validate_rating($seminar_post_id)) {
        return rest_ensure_response([
            'success' => false,
            'message' => 'You have already rated this seminar',
        ]);
    }

    $post_title = get_the_title($seminar_post_id);
    $user_info = get_user_by('id', $user_id);
    $user_name = $user_info->display_name;
    $user_email = $user_info->user_email;

    // return rest_ensure_response([
    //     'seminar_post_id' => $seminar_post_id,
    //     'rating_data' => $rating_data,
    //     'user_id' => $user_id,
    // ]);

    $sum_rating = array_sum($rating_data);

    // $note = $user_name . ' (' . $user_email . ') had rating for your seminar #' . $seminar_post_id . ' - ' . $post_title . ' - ' . $sum_rating . ' points';
    $note = "{ $user_name } ($user_email) had rating for your seminar: $post_title (#$seminar_post_id) - total: $sum_rating points";

    $transaction_id = memberfun_add_points($host_user_id, $sum_rating, $note, memberfun_get_first_admin_id());

    $rating_data = array(
        'success' => true,
        'rating_user_id' => $user_id,
        'rating_data' => $rating_data,
        'point_id' => $transaction_id,
    );

    $ratings = get_post_meta($seminar_post_id, '_memberfun_semina_ratings', true);
    $ratings = $ratings ? $ratings : [];
    $ratings[] = $rating_data;
    update_post_meta($seminar_post_id, '_memberfun_semina_ratings', $ratings);

    return rest_ensure_response($rating_data); // return rating data
}

// memberfun_semina_get_seminars
function memberfun_semina_get_seminars($request) {
    $limit = $request->get_param('limit');
    $offset = $request->get_param('offset');
    $today = date('Y-m-d');
    $search = $request->get_param('search');
    // $host = $request->get_param('host');
    
    $args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => $limit,
        'offset' => $offset,
        'post_status' => 'publish',
        's' => $search, 
        'meta_key' => '_memberfun_semina_date',
        'orderby' => 'meta_value',
        'order' => 'DESC',
        // 'meta_query' => array(
        //     array(
        //         'key' => '_memberfun_semina_host',
        //         'value' => $host,
        //     ),
        // ),
    );

    $query = new WP_Query($args);
    $seminars = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $seminars[] = memberfun_semina_prepare_seminar_for_response(get_the_ID());
        }
        wp_reset_postdata();
    }

    // Get total count for pagination
    $total_args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'fields' => 'ids',
    );
    $total_query = new WP_Query($total_args);
    $total = $total_query->found_posts;

    $response = array(
        'seminars' => $seminars,
        'total' => $total,
        'pages' => ceil($total / $limit),
        'page' => floor($offset / $limit) + 1,
    );

    return rest_ensure_response($response);
}

/**
 * Get upcoming seminars
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The response object
 */
function memberfun_semina_get_upcoming_seminars($request) {
    $limit = $request->get_param('limit');
    $offset = $request->get_param('offset');
    $today = date('Y-m-d');
    $search = $request->get_param('search');
    
    // Get seminars with date >= today, ordered by date
    $args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => $limit,
        'offset' => $offset,
        'post_status' => 'publish',
        's' => $search,
        'meta_query' => array(
            array(
                'key' => '_memberfun_semina_date',
                'value' => $today,
                'compare' => '>=',
                'type' => 'DATE',
            ),
        ),
        'meta_key' => '_memberfun_semina_date',
        'orderby' => 'meta_value',
        'order' => 'DESC',
    );
    
    $query = new WP_Query($args);
    $seminars = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $seminar = memberfun_semina_prepare_seminar_for_response(get_the_ID());
            $seminars[] = $seminar;
        }
        wp_reset_postdata();
    }
    
    // Get total count for pagination
    $total_args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_memberfun_semina_date',
                'value' => $today,
                'compare' => '>=',
                'type' => 'DATE',
            ),
        ),
        'fields' => 'ids',
    );
    
    $total_query = new WP_Query($total_args);
    $total = $total_query->found_posts;
    
    $response = array(
        'seminars' => $seminars,
        'total' => $total,
        'pages' => ceil($total / $limit),
        'page' => floor($offset / $limit) + 1,
    );
    
    return rest_ensure_response($response);
}

/**
 * Get seminars by host
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The response object
 */
function memberfun_semina_get_seminars_by_host($request) {
    $host_id = $request->get_param('host_id');
    $limit = $request->get_param('limit');
    $offset = $request->get_param('offset');
    
    // Get seminars by host, ordered by date
    $args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => $limit,
        'offset' => $offset,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_memberfun_semina_host',
                'value' => $host_id,
                'compare' => '=',
            ),
        ),
        'meta_key' => '_memberfun_semina_date',
        'orderby' => 'meta_value',
        'order' => 'DESC',
    );
    
    $query = new WP_Query($args);
    $seminars = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $seminar = memberfun_semina_prepare_seminar_for_response(get_the_ID());
            $seminars[] = $seminar;
        }
        wp_reset_postdata();
    }
    
    // Get total count for pagination
    $total_args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_memberfun_semina_host',
                'value' => $host_id,
                'compare' => '=',
            ),
        ),
        'fields' => 'ids',
    );
    
    $total_query = new WP_Query($total_args);
    $total = $total_query->found_posts;
    
    // Get host information
    $host = get_userdata($host_id);
    $host_info = null;
    
    if ($host) {
        $host_info = array(
            'id' => $host->ID,
            'name' => $host->display_name,
            'avatar' => get_avatar_url($host->ID),
        );
    }
    
    $response = array(
        'host' => $host_info,
        'seminars' => $seminars,
        'total' => $total,
        'pages' => ceil($total / $limit),
        'page' => floor($offset / $limit) + 1,
    );
    
    return rest_ensure_response($response);
}

/**
 * Get calendar data for seminars
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The response object
 */
function memberfun_semina_get_calendar_data($request) {
    $start_date = $request->get_param('start_date');
    $end_date = $request->get_param('end_date');
    
    // Get seminars within date range
    $args = array(
        'post_type' => 'memberfun_semina',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => '_memberfun_semina_date',
                'value' => $start_date,
                'compare' => '>=',
                'type' => 'DATE',
            ),
            array(
                'key' => '_memberfun_semina_date',
                'value' => $end_date,
                'compare' => '<=',
                'type' => 'DATE',
            ),
        ),
        'meta_key' => '_memberfun_semina_date',
        'orderby' => 'meta_value',
        'order' => 'ASC',
    );
    
    $query = new WP_Query($args);
    $events = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $seminar_id = get_the_ID();
            $title = get_the_title();
            $date = get_post_meta($seminar_id, '_memberfun_semina_date', true);
            $time = get_post_meta($seminar_id, '_memberfun_semina_time', true);
            $location = get_post_meta($seminar_id, '_memberfun_semina_location', true);
            $host_id = get_post_meta($seminar_id, '_memberfun_semina_host', true);
            $host = get_userdata($host_id);
            $host_name = $host ? $host->display_name : '';
            
            // Format date and time for calendar
            $start_datetime = $date;
            if (!empty($time)) {
                $start_datetime .= 'T' . $time . ':00';
            } else {
                $start_datetime .= 'T00:00:00';
            }
            
            $events[] = array(
                'id' => $seminar_id,
                'title' => $title,
                'start' => $start_datetime,
                'url' => get_permalink($seminar_id),
                'extendedProps' => array(
                    'location' => $location,
                    'host' => $host_name,
                    'host_id' => $host_id,
                ),
            );
        }
        wp_reset_postdata();
    }
    
    return rest_ensure_response($events);
}

/**
 * Generate iCal file for a seminar
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response|WP_Error The response object or error
 */
function memberfun_semina_get_ical($request) {
    $seminar_id = $request->get_param('id');
    $seminar = get_post($seminar_id);
    
    if (!$seminar || $seminar->post_type !== 'memberfun_semina' || $seminar->post_status !== 'publish') {
        return new WP_Error('seminar_not_found', __('Seminar not found', 'memberfun-backend'), array('status' => 404));
    }
    
    // Get seminar details
    $title = $seminar->post_title;
    $description = wp_strip_all_tags($seminar->post_content);
    $date = get_post_meta($seminar_id, '_memberfun_semina_date', true);
    $time = get_post_meta($seminar_id, '_memberfun_semina_time', true);
    $location = get_post_meta($seminar_id, '_memberfun_semina_location', true);
    $host_id = get_post_meta($seminar_id, '_memberfun_semina_host', true);
    $host = get_userdata($host_id);
    $host_name = $host ? $host->display_name : '';
    
    // Format date and time for iCal
    $start_datetime = $date;
    if (!empty($time)) {
        $start_datetime .= ' ' . $time;
    } else {
        $start_datetime .= ' 00:00:00';
    }
    
    $start_timestamp = strtotime($start_datetime);
    $end_timestamp = $start_timestamp + 3600; // Default to 1 hour duration
    
    // Generate unique identifier
    $uid = md5($seminar_id . $start_timestamp . site_url());
    
    // Build iCal content
    $ical = "BEGIN:VCALENDAR\r\n";
    $ical .= "VERSION:2.0\r\n";
    $ical .= "PRODID:-//" . get_bloginfo('name') . "//MemberFun Semina//EN\r\n";
    $ical .= "CALSCALE:GREGORIAN\r\n";
    $ical .= "METHOD:PUBLISH\r\n";
    $ical .= "BEGIN:VEVENT\r\n";
    $ical .= "UID:" . $uid . "\r\n";
    $ical .= "DTSTAMP:" . gmdate('Ymd\THis\Z', time()) . "\r\n";
    $ical .= "DTSTART:" . gmdate('Ymd\THis\Z', $start_timestamp) . "\r\n";
    $ical .= "DTEND:" . gmdate('Ymd\THis\Z', $end_timestamp) . "\r\n";
    $ical .= "SUMMARY:" . memberfun_semina_ical_escape($title) . "\r\n";
    
    if (!empty($description)) {
        $ical .= "DESCRIPTION:" . memberfun_semina_ical_escape($description) . "\r\n";
    }
    
    if (!empty($location)) {
        $ical .= "LOCATION:" . memberfun_semina_ical_escape($location) . "\r\n";
    }
    
    if (!empty($host_name)) {
        $ical .= "ORGANIZER;CN=" . memberfun_semina_ical_escape($host_name) . ":MAILTO:" . get_option('admin_email') . "\r\n";
    }
    
    $ical .= "URL:" . get_permalink($seminar_id) . "\r\n";
    $ical .= "END:VEVENT\r\n";
    $ical .= "END:VCALENDAR\r\n";
    
    // Set headers for file download
    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: attachment; filename="seminar-' . $seminar_id . '.ics"');
    
    echo $ical;
    exit;
}

/**
 * Escape special characters for iCal format
 * 
 * @param string $text The text to escape
 * @return string The escaped text
 */
function memberfun_semina_ical_escape($text) {
    $text = str_replace(array("\\", "\n", ";", ","), array("\\\\", "\\n", "\\;", "\\,"), $text);
    return $text;
}

/**
 * Prepare seminar data for API response
 * 
 * @param int $seminar_id The seminar post ID
 * @return array The prepared seminar data
 */
function memberfun_semina_prepare_seminar_for_response($seminar_id) {
    $seminar = get_post($seminar_id);
    
    if (!$seminar) {
        return array();
    }
    
    // Get seminar meta
    $date = get_post_meta($seminar_id, '_memberfun_semina_date', true);
    $time = get_post_meta($seminar_id, '_memberfun_semina_time', true);
    $host_id = get_post_meta($seminar_id, '_memberfun_semina_host', true);
    $location = get_post_meta($seminar_id, '_memberfun_semina_location', true);
    $capacity = get_post_meta($seminar_id, '_memberfun_semina_capacity', true);
    $documents = get_post_meta($seminar_id, '_memberfun_semina_documents', true);
    $ratings = memberfun_semina_get_ratings_by_seminar_id($seminar_id);

    $ratings = $ratings ? array_map(function($rating) {
        $rating_user_id = $rating['rating_user_id'];
        $userinfo = get_user_by('id', $rating_user_id);
        $rating['user_display_name'] = $userinfo->display_name;
        $rating['user_avatar'] = get_avatar_url($userinfo->ID);
        $rating['user_email'] = $userinfo->user_email;
        return $rating;
    }, $ratings) : [];
    $rating_count = count($ratings);
    
    
    // Format date and time
    $formatted_date = !empty($date) ? date_i18n(get_option('date_format'), strtotime($date)) : '';
    $formatted_time = !empty($time) ? date_i18n(get_option('time_format'), strtotime($time)) : '';
    
    // Get host information
    $host = null;
    if (!empty($host_id)) {
        $host_user = get_userdata($host_id);
        if ($host_user) {
            $host = array(
                'id' => $host_user->ID,
                'name' => $host_user->display_name,
                'avatar' => get_avatar_url($host_user->ID),
            );
        }
    }
    
    // Format documents
    $formatted_documents = array();
    if (!empty($documents) && is_array($documents)) {
        foreach ($documents as $document) {
            $formatted_documents[] = array(
                'id' => $document['id'],
                'title' => $document['title'],
                'url' => $document['url'],
                'filename' => isset($document['filename']) ? $document['filename'] : '',
            );
        }
    }
    
    // Prepare response
    $response = array(
        'id' => $seminar_id,
        'title' => $seminar->post_title,
        'content' => apply_filters('the_content', $seminar->post_content),
        'excerpt' => get_the_excerpt($seminar),
        'date' => $date,
        'time' => $time,
        'formatted_date' => $formatted_date,
        'formatted_time' => $formatted_time,
        'location' => $location,
        'capacity' => $capacity,
        'host' => $host,
        'documents' => $formatted_documents,
        'permalink' => get_permalink($seminar_id),
        'ical_url' => rest_url('memberfun/v1/seminars/' . $seminar_id . '/ical'),
        'featured_image' => get_the_post_thumbnail_url($seminar_id, 'large'),
        'rating_count' => $rating_count,
        'ratings' => $ratings,
    );
    
    return $response;
}

/**
 * Add seminar data to the default REST API response
 * 
 * @param WP_REST_Response $response The response object
 * @param WP_Post $post The post object
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The modified response
 */
function memberfun_semina_rest_prepare_seminar($response, $post, $request) {
    if ($post->post_type !== 'memberfun_semina') {
        return $response;
    }
    
    // Get seminar data
    $seminar_data = memberfun_semina_prepare_seminar_for_response($post->ID);
    
    // Add seminar data to response
    $response->data['seminar_data'] = $seminar_data;
    
    return $response;
}
add_filter('rest_prepare_memberfun_semina', 'memberfun_semina_rest_prepare_seminar', 10, 3); 