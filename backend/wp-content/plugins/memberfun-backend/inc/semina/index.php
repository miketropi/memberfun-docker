<?php
/**
 * MemberFun Semina Module
 * 
 * Manages member seminars, notifications, and related functionality
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Include required files
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/post-type.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/meta-fields.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/admin.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/notifications.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/api.php';
// require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/frontend.php';

// Initialize the custom post type
add_action('init', 'memberfun_semina_register_post_type');

// Register meta boxes
add_action('add_meta_boxes', 'memberfun_semina_register_meta_boxes');

// Save post meta
add_action('save_post_memberfun_semina', 'memberfun_semina_save_meta', 10, 3);

// Modify admin columns
add_filter('manage_memberfun_semina_posts_columns', 'memberfun_semina_modify_columns');
add_action('manage_memberfun_semina_posts_custom_column', 'memberfun_semina_custom_column_content', 10, 2);
add_filter('manage_edit-memberfun_semina_sortable_columns', 'memberfun_semina_sortable_columns');

// Add admin filters
add_action('restrict_manage_posts', 'memberfun_semina_add_admin_filters');
add_filter('parse_query', 'memberfun_semina_filter_query');

// Register REST API endpoints
add_action('rest_api_init', 'memberfun_semina_register_api_routes');

// Handle notifications
add_action('transition_post_status', 'memberfun_semina_handle_status_transition', 10, 3);

// Enqueue admin scripts and styles
add_action('admin_enqueue_scripts', 'memberfun_semina_admin_scripts');
