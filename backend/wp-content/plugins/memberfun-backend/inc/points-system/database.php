<?php
/**
 * MemberFun Points System - Database Functions
 * 
 * Handles database table creation, updates, and cleanup
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Create the points system database tables
 * 
 * @return void
 */
function memberfun_points_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'memberfun_points';
    
    // Get current database version
    $installed_version = get_option('memberfun_points_db_version');
    
    // Define the current version
    $current_version = '1.0.0';
    
    // Only run if the table doesn't exist or needs an update
    if ($installed_version !== $current_version) {
        
        // SQL to create the points table
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            points int(11) NOT NULL,
            type varchar(20) NOT NULL,
            note text NULL,
            admin_user_id bigint(20) NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY type (type)
        ) $charset_collate;";
        
        // Include WordPress database upgrade functions
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        // Create or update the table
        dbDelta($sql);
        
        // Update the database version option
        update_option('memberfun_points_db_version', $current_version);
    }
}

/**
 * Uninstall function to clean up database on plugin removal
 * 
 * @return void
 */
function memberfun_points_uninstall() {
    global $wpdb;
    
    // Only proceed if the uninstall is triggered from WordPress admin
    if (!defined('WP_UNINSTALL_PLUGIN')) {
        return;
    }
    
    // Drop the points table
    $table_name = $wpdb->prefix . 'memberfun_points';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    
    // Delete options
    delete_option('memberfun_points_db_version');
}

/**
 * Get the points table name with prefix
 * 
 * @return string The full table name with prefix
 */
function memberfun_points_get_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'memberfun_points';
} 