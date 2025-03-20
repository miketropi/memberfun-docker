<?php
/**
 * MemberFun Points System
 * 
 * Manages user points, transactions, and related functionality
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Include required files
require_once MEMBERFUN_BACKEND_DIR . 'inc/points-system/database.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/points-system/functions.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/points-system/admin.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/points-system/api.php';

// Register activation hook for database setup
register_activation_hook(MEMBERFUN_BACKEND_DIR . 'memberfun-backend.php', 'memberfun_points_create_tables');

// Register deactivation hook if needed
// register_deactivation_hook(MEMBERFUN_BACKEND_DIR . 'memberfun-backend.php', 'memberfun_points_deactivation');

// Register uninstall hook for cleanup
register_uninstall_hook(MEMBERFUN_BACKEND_DIR . 'memberfun-backend.php', 'memberfun_points_uninstall');

// Initialize admin menu
add_action('admin_menu', 'memberfun_points_admin_menu');

// Initialize REST API endpoints
add_action('rest_api_init', 'memberfun_points_register_api_routes');
