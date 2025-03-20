<?php
/**
 * Helper functions for MemberFun Backend plugin
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Generate a JWT token for a specific user ID
 *
 * @param int $user_id The ID of the user to generate a token for
 * @return string|WP_Error The JWT token or WP_Error on failure
 */
function memberfun_generate_jwt_token_by_user_id($user_id) {
    // Check if the JWT Authentication plugin is active
    if (!class_exists('Jwt_Auth_Public')) {
        return new WP_Error(
            'jwt_auth_not_available',
            __('JWT Authentication plugin is not active', 'memberfun-backend'),
            ['status' => 500]
        );
    }

    // Check if the secret key is defined
    $secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : false;
    if (!$secret_key) {
        return new WP_Error(
            'jwt_auth_bad_config',
            __('JWT is not configured properly, please contact the admin', 'memberfun-backend'),
            ['status' => 403]
        );
    }

    // Get the user
    $user = get_user_by('id', $user_id);
    if (!$user) {
        return new WP_Error(
            'jwt_auth_invalid_user',
            __('Invalid user ID', 'memberfun-backend'),
            ['status' => 403]
        );
    }

    // Create the token
    $issuedAt = time();
    $notBefore = apply_filters('jwt_auth_not_before', $issuedAt, $issuedAt);
    $expire = apply_filters('jwt_auth_expire', $issuedAt + (DAY_IN_SECONDS * 7), $issuedAt);

    $token = [
        'iss'  => get_bloginfo('url'),
        'iat'  => $issuedAt,
        'nbf'  => $notBefore,
        'exp'  => $expire,
        'data' => [
            'user' => [
                'id' => $user->ID,
            ],
        ],
    ];

    // Get the algorithm
    $algorithm = 'HS256'; // Default algorithm used by the plugin
    $algorithm = apply_filters('jwt_auth_algorithm', $algorithm);
    
    // Use the JWT library from the JWT Authentication plugin
    if (!class_exists('Tmeister\Firebase\JWT\JWT')) {
        // If the class is not available, try to include it
        $jwt_plugin_path = WP_PLUGIN_DIR . '/jwt-authentication-for-wp-rest-api';
        if (file_exists($jwt_plugin_path . '/includes/vendor/autoload.php')) {
            require_once $jwt_plugin_path . '/includes/vendor/autoload.php';
        } else {
            return new WP_Error(
                'jwt_auth_missing_library',
                __('JWT library not found', 'memberfun-backend'),
                ['status' => 500]
            );
        }
    }

    try {
        // Encode the token
        $token = \Tmeister\Firebase\JWT\JWT::encode(
            apply_filters('jwt_auth_token_before_sign', $token, $user),
            $secret_key,
            $algorithm
        );

        // Create the response data
        $data = [
            'token'             => $token,
            'user_email'        => $user->user_email,
            'user_nicename'     => $user->user_nicename,
            'user_display_name' => $user->display_name,
        ];

        // Apply filters and return
        // return apply_filters('jwt_auth_token_before_dispatch', $data, $user);
        return $token;
    } catch (Exception $e) {
        return new WP_Error(
            'jwt_auth_token_error',
            $e->getMessage(),
            ['status' => 403]
        );
    }
}

// get first admin id
function memberfun_get_first_admin_id() {
    $admins = get_users(['role' => 'administrator']);
    return $admins[0]->ID;
}

