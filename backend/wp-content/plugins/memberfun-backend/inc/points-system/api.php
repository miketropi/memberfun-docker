<?php
/**
 * MemberFun Points System - REST API
 * 
 * REST API endpoints for the points system
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Register REST API routes
 */
function memberfun_points_register_api_routes() {
    // Register namespace
    $namespace = 'memberfun/v1';
    
    // Register route for getting user points
    register_rest_route($namespace, '/points/user/(?P<user_id>\d+)', array(
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'memberfun_points_api_get_user_points',
        'permission_callback' => 'memberfun_points_api_permissions_check',
        'args'                => array(
            'user_id' => array(
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
    
    // Register route for getting user transactions
    register_rest_route($namespace, '/points/user/(?P<user_id>\d+)/transactions', array(
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'memberfun_points_api_get_user_transactions',
        'permission_callback' => 'memberfun_points_api_permissions_check',
        'args'                => array(
            'user_id' => array(
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ),
            'per_page' => array(
                'default'           => 20,
                'sanitize_callback' => 'absint',
            ),
            'page' => array(
                'default'           => 1,
                'sanitize_callback' => 'absint',
            ),
            'type' => array(
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
    
    // Register route for adding points
    register_rest_route($namespace, '/points/add', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'memberfun_points_api_add_points',
        'permission_callback' => 'memberfun_points_api_admin_permissions_check',
        'args'                => array(
            'user_id' => array(
                'required'          => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && get_user_by('id', $param);
                }
            ),
            'points' => array(
                'required'          => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                }
            ),
            'note' => array(
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
    
    // Register route for deducting points
    register_rest_route($namespace, '/points/deduct', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'memberfun_points_api_deduct_points',
        'permission_callback' => 'memberfun_points_api_admin_permissions_check',
        'args'                => array(
            'user_id' => array(
                'required'          => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && get_user_by('id', $param);
                }
            ),
            'points' => array(
                'required'          => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                }
            ),
            'note' => array(
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'allow_negative' => array(
                'default'           => false,
                'sanitize_callback' => function($param) {
                    return (bool) $param;
                },
            ),
        ),
    ));
}

/**
 * Check if the user has permission to access the API
 * 
 * @param WP_REST_Request $request The request object
 * @return bool Whether the user has permission
 */
function memberfun_points_api_permissions_check($request) {
    // Check if user is logged in
    if (!is_user_logged_in()) {
        return false;
    }
    
    // Get the requested user ID
    $user_id = $request->get_param('user_id');
    
    // Allow administrators to access any user's points
    if (current_user_can('manage_options')) {
        return true;
    }
    
    // Allow users to access their own points
    return get_current_user_id() == $user_id;
}

/**
 * Check if the user has admin permissions
 * 
 * @param WP_REST_Request $request The request object
 * @return bool Whether the user has permission
 */
function memberfun_points_api_admin_permissions_check($request) {
    // Only allow administrators to add/deduct points
    return current_user_can('manage_options');
}

/**
 * API callback for getting user points
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The response
 */
function memberfun_points_api_get_user_points($request) {
    $user_id = $request->get_param('user_id');
    
    // Get the user's points
    $points = memberfun_get_user_points($user_id);
    
    // Get user data
    $user = get_user_by('id', $user_id);
    
    // Return the response
    return new WP_REST_Response(array(
        'user_id'       => $user_id,
        'display_name'  => $user ? $user->display_name : '',
        'points'        => $points,
    ), 200);
}

/**
 * API callback for getting user transactions
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response The response
 */
function memberfun_points_api_get_user_transactions($request) {
    $user_id = $request->get_param('user_id');
    $per_page = $request->get_param('per_page');
    $page = $request->get_param('page');
    $type = $request->get_param('type');
    
    // Calculate offset
    $offset = ($page - 1) * $per_page;
    
    // Get transactions
    $args = array(
        'number'  => $per_page,
        'offset'  => $offset,
        'type'    => $type,
    );
    
    $transactions = memberfun_get_user_transactions($user_id, $args);
    
    // Format the transactions for the API response
    $formatted_transactions = array();
    foreach ($transactions as $transaction) {
        $formatted_transactions[] = array(
            'id'           => $transaction->id,
            'user_id'      => $transaction->user_id,
            'points'       => $transaction->points,
            'type'         => $transaction->type,
            'note'         => $transaction->note,
            'admin_user_id' => $transaction->admin_user_id,
            'created_at'   => $transaction->created_at,
        );
    }
    
    // Count total transactions for pagination
    $args['number'] = 0; // No limit for counting
    $args['offset'] = 0;
    $total_transactions = count(memberfun_get_user_transactions($user_id, $args));
    
    // Calculate total pages
    $total_pages = ceil($total_transactions / $per_page);
    
    // Return the response with pagination headers
    $response = new WP_REST_Response($formatted_transactions, 200);
    $response->header('X-WP-Total', $total_transactions);
    $response->header('X-WP-TotalPages', $total_pages);
    
    return $response;
}

/**
 * API callback for adding points
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response|WP_Error The response or error
 */
function memberfun_points_api_add_points($request) {
    $user_id = $request->get_param('user_id');
    $points = $request->get_param('points');
    $note = $request->get_param('note');
    
    // Add the points
    $result = memberfun_add_points($user_id, $points, $note, get_current_user_id());
    
    // Check for errors
    if (is_wp_error($result)) {
        return $result;
    }
    
    // Get updated points
    $updated_points = memberfun_get_user_points($user_id);
    
    // Return success response
    return new WP_REST_Response(array(
        'success'       => true,
        'transaction_id' => $result,
        'user_id'       => $user_id,
        'points_added'  => $points,
        'current_points' => $updated_points,
        'message'       => sprintf(__('%d points added successfully.', 'memberfun-backend'), $points),
    ), 200);
}

/**
 * API callback for deducting points
 * 
 * @param WP_REST_Request $request The request object
 * @return WP_REST_Response|WP_Error The response or error
 */
function memberfun_points_api_deduct_points($request) {
    $user_id = $request->get_param('user_id');
    $points = $request->get_param('points');
    $note = $request->get_param('note');
    $allow_negative = $request->get_param('allow_negative');
    
    // Deduct the points
    $result = memberfun_deduct_points($user_id, $points, $note, get_current_user_id(), $allow_negative);
    
    // Check for errors
    if (is_wp_error($result)) {
        return $result;
    }
    
    // Get updated points
    $updated_points = memberfun_get_user_points($user_id);
    
    // Return success response
    return new WP_REST_Response(array(
        'success'        => true,
        'transaction_id' => $result,
        'user_id'        => $user_id,
        'points_deducted' => $points,
        'current_points' => $updated_points,
        'message'        => sprintf(__('%d points deducted successfully.', 'memberfun-backend'), $points),
    ), 200);
} 