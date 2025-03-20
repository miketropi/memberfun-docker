<?php 
/**
 * 
 */

// Register custom endpoint for user registration
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/users/register', array(
        'methods' => 'POST',
        'callback' => 'memberfun_register_user',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Handle user registration via REST API
 * 
 * @param WP_REST_Request $request Request object
 * @return WP_REST_Response|WP_Error Response object or WP_Error
 */
function memberfun_register_user($request) {
    $params = $request->get_params();
    
    // Validate required fields
    $required_fields = array('username', 'email', 'password');
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error(
                'missing_field',
                sprintf(__('Missing required field: %s', 'memberfun-backend'), $field),
                array('status' => 400)
            );
        }
    }

    // Check if username already exists
    if (username_exists($params['username'])) {
        return new WP_Error(
            'username_exists',
            __('Username already exists', 'memberfun-backend'),
            array('status' => 400)
        );
    }

    // Check if email already exists
    if (email_exists($params['email'])) {
        return new WP_Error(
            'email_exists', 
            __('Email address already exists', 'memberfun-backend'),
            array('status' => 400)
        );
    }

    // Prepare user data
    $userdata = array(
        'user_login' => $params['username'],
        'user_email' => $params['email'],
        'user_pass' => $params['password'],
        'first_name' => isset($params['first_name']) ? $params['first_name'] : '',
        'last_name' => isset($params['last_name']) ? $params['last_name'] : '',
        'display_name' => isset($params['name']) ? $params['name'] : $params['username'],
        'role' => 'subscriber'
    );

    // Create the user
    $user_id = wp_insert_user($userdata);

    if (is_wp_error($user_id)) {
        return new WP_Error(
            'registration_failed',
            $user_id->get_error_message(),
            array('status' => 500)
        );
    }

    // Return success response
    return new WP_REST_Response(array(
        'status' => 'success',
        'message' => __('User registered successfully', 'memberfun-backend'),
        'user_id' => $user_id
    ), 201);
}
