<?php
/**
 * MemberFun Points System - Core Functions
 * 
 * Core functions for managing user points
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Add points to a user
 * 
 * @param int    $user_id       The user ID to add points to
 * @param int    $points        The number of points to add (positive integer)
 * @param string $note          Optional note about the transaction
 * @param int    $admin_user_id Optional admin user ID who performed the action
 * @return int|WP_Error         Transaction ID on success, WP_Error on failure
 */
function memberfun_add_points($user_id, $points, $note = '', $admin_user_id = 0) {
    global $wpdb;
    
    // Validate user ID
    if (!get_user_by('id', $user_id)) {
        return new WP_Error('invalid_user', __('Invalid user ID', 'memberfun-backend'));
    }
    
    // Validate points (must be positive)
    $points = absint($points);
    if ($points <= 0) {
        return new WP_Error('invalid_points', __('Points must be a positive number', 'memberfun-backend'));
    }
    
    // Get current admin user if not specified
    if (empty($admin_user_id) && is_admin() && current_user_can('manage_options')) {
        $admin_user_id = get_current_user_id();
    }
    
    // Insert the transaction
    $result = $wpdb->insert(
        memberfun_points_get_table_name(),
        array(
            'user_id'       => $user_id,
            'points'        => $points,
            'type'          => 'add',
            'note'          => sanitize_text_field($note),
            'admin_user_id' => $admin_user_id,
            'created_at'    => current_time('mysql')
        ),
        array('%d', '%d', '%s', '%s', '%d', '%s')
    );
    
    if ($result === false) {
        return new WP_Error('db_error', __('Failed to add points', 'memberfun-backend'));
    }
    
    // Get the transaction ID
    $transaction_id = $wpdb->insert_id;
    
    // Trigger action for other plugins/themes
    do_action('memberfun_points_added', $user_id, $points, $transaction_id, $note);
    
    return $transaction_id;
}

// send mail after add points via hook memberfun_points_added
add_action('memberfun_points_added', 'memberfun_send_mail_after_add_points', 10, 4);
function memberfun_send_mail_after_add_points($user_id, $points, $transaction_id, $note) {
    $user_info = get_user_by('id', $user_id);
    $user_email = $user_info->user_email;
    $user_name = $user_info->display_name;

    $subject = 'MemberFun - Points Added';
    $message = '
        <p>Hi ' . $user_name . ',</p>
        <p>You have received <strong>' . $points . ' points</strong> in your MemberFun account.</p>
        <p>Reason: ' . $note . '</p>
        <p>Your transaction ID is: ' . $transaction_id . '</p>
        <p>Thank you for being a valued member!</p>
    ';

    $headers = array('Content-Type: text/html; charset=UTF-8');

    wp_mail($user_email, $subject, $message, $headers);
}

/**
 * Deduct points from a user
 * 
 * @param int    $user_id       The user ID to deduct points from
 * @param int    $points        The number of points to deduct (positive integer)
 * @param string $note          Optional note about the transaction
 * @param int    $admin_user_id Optional admin user ID who performed the action
 * @param bool   $allow_negative Whether to allow negative balance (default: false)
 * @return int|WP_Error         Transaction ID on success, WP_Error on failure
 */
function memberfun_deduct_points($user_id, $points, $note = '', $admin_user_id = 0, $allow_negative = false) {
    global $wpdb;
    
    // Validate user ID
    if (!get_user_by('id', $user_id)) {
        return new WP_Error('invalid_user', __('Invalid user ID', 'memberfun-backend'));
    }
    
    // Validate points (must be positive)
    $points = absint($points);
    if ($points <= 0) {
        return new WP_Error('invalid_points', __('Points must be a positive number', 'memberfun-backend'));
    }
    
    // Check if user has enough points (if not allowing negative balance)
    if (!$allow_negative) {
        $current_points = memberfun_get_user_points($user_id);
        if ($current_points < $points) {
            return new WP_Error(
                'insufficient_points', 
                sprintf(__('User does not have enough points. Current balance: %d', 'memberfun-backend'), $current_points)
            );
        }
    }
    
    // Get current admin user if not specified
    if (empty($admin_user_id) && is_admin() && current_user_can('manage_options')) {
        $admin_user_id = get_current_user_id();
    }
    
    // Insert the transaction
    $result = $wpdb->insert(
        memberfun_points_get_table_name(),
        array(
            'user_id'       => $user_id,
            'points'        => $points,
            'type'          => 'deduct',
            'note'          => sanitize_text_field($note),
            'admin_user_id' => $admin_user_id,
            'created_at'    => current_time('mysql')
        ),
        array('%d', '%d', '%s', '%s', '%d', '%s')
    );
    
    if ($result === false) {
        return new WP_Error('db_error', __('Failed to deduct points', 'memberfun-backend'));
    }
    
    // Get the transaction ID
    $transaction_id = $wpdb->insert_id;
    
    // Trigger action for other plugins/themes
    do_action('memberfun_points_deducted', $user_id, $points, $transaction_id, $note);
    
    return $transaction_id;
}

/**
 * Get a user's total points
 * 
 * @param int $user_id The user ID to get points for
 * @return int The user's total points
 */
function memberfun_get_user_points($user_id) {
    global $wpdb;
    
    // Validate user ID
    if (!get_user_by('id', $user_id)) {
        return 0;
    }
    
    $table_name = memberfun_points_get_table_name();
    
    // Calculate total points (add - deduct)
    $query = $wpdb->prepare(
        "SELECT 
            COALESCE(SUM(CASE WHEN type = 'add' THEN points ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN type = 'deduct' THEN points ELSE 0 END), 0) as total
        FROM $table_name
        WHERE user_id = %d",
        $user_id
    );
    
    $total = $wpdb->get_var($query);
    
    return (int) $total;
}

/**
 * Get a user's point transaction history
 * 
 * @param int   $user_id  The user ID to get transactions for
 * @param array $args     Optional. Additional arguments for the query
 * @return array          Array of transaction objects
 */
function memberfun_get_user_transactions($user_id, $args = array()) {
    global $wpdb;
    
    // Default arguments
    $defaults = array(
        'number'  => 20,
        'offset'  => 0,
        'orderby' => 'created_at',
        'order'   => 'DESC',
        'type'    => '', // empty for all types
    );
    
    // Parse arguments
    $args = wp_parse_args($args, $defaults);
    
    // Sanitize arguments
    $number  = absint($args['number']);
    $offset  = absint($args['offset']);
    $orderby = sanitize_sql_orderby($args['orderby'] . ' ' . $args['order']) ?: 'created_at DESC';
    
    // Build the query
    $table_name = memberfun_points_get_table_name();
    $query = $wpdb->prepare(
        "SELECT * FROM $table_name WHERE user_id = %d",
        $user_id
    );
    
    // Add type filter if specified
    if (!empty($args['type'])) {
        $query .= $wpdb->prepare(" AND type = %s", $args['type']);
    }
    
    // Add order and limit
    $query .= " ORDER BY $orderby LIMIT $number OFFSET $offset";
    
    // Get the results
    $transactions = $wpdb->get_results($query);
    
    return $transactions;
}

/**
 * Get all point transactions (admin function)
 * 
 * @param array $args Optional. Additional arguments for the query
 * @return array      Array of transaction objects
 */
function memberfun_get_all_transactions($args = array()) {
    global $wpdb;
    
    // Default arguments
    $defaults = array(
        'number'  => 20,
        'offset'  => 0,
        'orderby' => 'created_at',
        'order'   => 'DESC',
        'type'    => '', // empty for all types
        'user_id' => 0,  // 0 for all users
        'search'  => '', // search in notes
    );
    
    // Parse arguments
    $args = wp_parse_args($args, $defaults);
    
    // Sanitize arguments
    $number  = absint($args['number']);
    $offset  = absint($args['offset']);
    $orderby = sanitize_sql_orderby($args['orderby'] . ' ' . $args['order']) ?: 'created_at DESC';
    
    // Build the query
    $table_name = memberfun_points_get_table_name();
    $query = "SELECT * FROM $table_name WHERE 1=1";
    
    // Add user filter if specified
    if (!empty($args['user_id'])) {
        $query .= $wpdb->prepare(" AND user_id = %d", $args['user_id']);
    }
    
    // Add type filter if specified
    if (!empty($args['type'])) {
        $query .= $wpdb->prepare(" AND type = %s", $args['type']);
    }
    
    // Add search if specified
    if (!empty($args['search'])) {
        $query .= $wpdb->prepare(" AND note LIKE %s", '%' . $wpdb->esc_like($args['search']) . '%');
    }
    
    // Add order and limit
    $query .= " ORDER BY $orderby LIMIT $number OFFSET $offset";
    
    // Get the results
    $transactions = $wpdb->get_results($query);
    
    return $transactions;
}

/**
 * Count total transactions (for pagination)
 * 
 * @param array $args Optional. Additional arguments for the query
 * @return int        Total number of transactions
 */
function memberfun_count_transactions($args = array()) {
    global $wpdb;
    
    // Default arguments
    $defaults = array(
        'type'    => '', // empty for all types
        'user_id' => 0,  // 0 for all users
        'search'  => '', // search in notes
    );
    
    // Parse arguments
    $args = wp_parse_args($args, $defaults);
    
    // Build the query
    $table_name = memberfun_points_get_table_name();
    $query = "SELECT COUNT(*) FROM $table_name WHERE 1=1";
    
    // Add user filter if specified
    if (!empty($args['user_id'])) {
        $query .= $wpdb->prepare(" AND user_id = %d", $args['user_id']);
    }
    
    // Add type filter if specified
    if (!empty($args['type'])) {
        $query .= $wpdb->prepare(" AND type = %s", $args['type']);
    }
    
    // Add search if specified
    if (!empty($args['search'])) {
        $query .= $wpdb->prepare(" AND note LIKE %s", '%' . $wpdb->esc_like($args['search']) . '%');
    }
    
    // Get the count
    $count = $wpdb->get_var($query);
    
    return (int) $count;
} 

// memberfun_delete_points_transaction
function memberfun_delete_points_transaction($transaction_id) {
    global $wpdb;
    
    $table_name = memberfun_points_get_table_name();
    $wpdb->delete($table_name, array('id' => $transaction_id));

    return true;
}