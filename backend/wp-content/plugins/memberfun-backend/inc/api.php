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

    // rest api forgot password
    register_rest_route('wp/v2', '/users/forgot-password', array(
        'methods' => 'POST',
        'callback' => 'memberfun_forgot_password',
        'permission_callback' => '__return_true',
    ));

    // rest api update user
    register_rest_route('wp/v2', '/users/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'memberfun_update_user',
        'permission_callback' => function($request) {
            return current_user_can('edit_user', $request['id']);
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function($value) {
                    return is_numeric($value);
                }
            ),
            'user_data' => array(
                'validate_callback' => function($value) {
                    return is_array($value);
                }
            )
        )
    ));

    // rest api update user password
    register_rest_route('wp/v2', '/users/update-password', array(
        'methods' => 'POST',
        'callback' => 'memberfun_update_password',
        'permission_callback' => function($request) {
            return current_user_can('edit_user', $request['id']);
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function($value) {
                    return is_numeric($value);
                }
            ),
            'password' => array(
                'validate_callback' => function($value) {
                    return is_string($value);
                }
            )
        )
    ));

    // dashboard overview api general user data 
    register_rest_route('memberfun/v1', '/dashboard/overview/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'memberfun_dashboard_overview',
        'permission_callback' => function($request) {
            return current_user_can('edit_user', $request['id']);
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function($value) {
                    return is_numeric($value);
                }
            )
        )
    ));
});

// memberfun_dashboard_overview
function memberfun_dashboard_overview($request) {
    $params = $request->get_params();
    $user_id = $params['id'];

    // get count total seminars of user
    $total_seminars = get_posts(array(
        'post_type' => 'memberfun_semina',
        'author' => $user_id,
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => '_memberfun_semina_host',
                'value' => $user_id,
                'compare' => '='
            )
        )
    ));

    // get count total submissions of user  
    $total_submissions = get_posts(array(
        'post_type' => 'submission',
        'author' => $user_id,
        'posts_per_page' => -1
    ));

    // get count total comments of user
    $total_comments = get_comments(array(
        'user_id' => $user_id,
        'posts_per_page' => -1
    ));

    // get transaction points of user
    $transactions = memberfun_get_user_transactions($user_id, [
        'number' => 0,
    ]);

    // total points of user
    $total_points = memberfun_get_user_points($user_id);

    // get rank of user
    $rank = memberfun_get_user_rank($user_id);

    // get last claim date of user
    $last_claim_date = get_user_meta($user_id, 'memberfun_last_claim_date', true);

    // server current date
    $server_current_date = date('Y-m-d H:i:s');

    // return response
    return new WP_REST_Response(array(
        'total_seminars' => count($total_seminars),
        'total_submissions' => count($total_submissions),
        'total_comments' => count($total_comments),
        'transactions' => $transactions,
        'total_points' => $total_points,
        'rank' => $rank,
        'last_claim_date' => $last_claim_date,
        'server_current_date' => $server_current_date
    ), 200);
}
// memberfun_update_password
function memberfun_update_password($request) {
    $params = $request->get_params();
    $user_id = $params['id'];
    $password = $params['password'];

    // update user password
    wp_set_password($password, $user_id);

    return new WP_REST_Response(array(
        'status' => 'success',
        'message' => __('Password updated successfully', 'memberfun-backend')
    ), 200);
}

// memberfun_update_user
function memberfun_update_user($request) {
    $params = $request->get_params();
    $user_id = $params['id'];
    $user_data = $params['user_data'];
    $user = get_user_by('id', $user_id);

    // return new WP_REST_Response(array(
    //     'params' => $params,
    //     'user_data' => $user_data,
    //     'user' => $user
    // ), 200);

    // check if user exists
    if (!$user) {
        return new WP_Error(
            'user_not_found',
            __('User not found', 'memberfun-backend'),
            array('status' => 404)
        );
    }

    // update user = first name + last name
    $user_data['display_name'] = $user_data['first_name'] . ' ' . $user_data['last_name'];
    $user_data = wp_update_user($user_data);

    // is is_error
    if (is_wp_error($user_data)) {
        return new WP_Error(
            'update_user_failed',
            $user_data->get_error_message(),
            array('status' => 500)
        );
    } else {
        return new WP_REST_Response(array(
            'status' => 'success',
            'message' => __('User updated successfully', 'memberfun-backend')
        ), 200);
    }
}

// memberfun_forgot_password
function memberfun_forgot_password($request) {
    $params = $request->get_params();
    $email = $params['email'];
    $user = get_user_by('email', $email);
    if (!$user) {
        return new WP_Error(
            'user_not_found',
            __('User not found', 'memberfun-backend'),
            array('status' => 404)
        );
    }

    $new_password = wp_generate_password(20, false);
    wp_set_password($new_password, $user->ID);

    // send email to user
    $headers = array('Content-Type: text/html; charset=UTF-8');
    $subject = __('Reset Password Request', 'memberfun-backend');
    $message = sprintf(
        '<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #2c3e50;">Password Reset</h2>
            <p>Your password has been reset successfully.</p>
            <p>Your new password is: <strong>%s</strong></p>
            <p>For security reasons, we recommend changing this password after logging in.</p>
            <p>If you did not request this password reset, please contact us immediately.</p>
            <p>Best regards,<br>The MemberFun Team</p>
        </div>',
        $new_password
    );
    wp_mail($email, $subject, $message, $headers);

    return new WP_REST_Response(array(
        'status' => 'success',
        'message' => __('Password reset email sent', 'memberfun-backend')
    ), 200);
}

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
