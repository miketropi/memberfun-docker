<?php
/**
 * Plugin Name: MemberFun Backend
 * Plugin URI: https://example.com/memberfun
 * Description: A headless WordPress plugin that provides REST API endpoints for React frontend application. Handles member management, authentication, and custom functionality.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: memberfun-backend
 * Domain Path: /languages
 *
 * This plugin provides custom REST API endpoints for a headless WordPress setup
 * to be consumed by a React frontend application. Features include:
 * - Custom authentication endpoints using JWT
 * - Member management and roles
 * - Custom post types and taxonomies
 * - Secure API routes and endpoints
 * - Data validation and sanitization
 * 
 * Requires PHP: 7.4
 * Requires at least: 5.6
 */

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MEMBERFUN_BACKEND_VERSION', '1.0.0');
define('MEMBERFUN_BACKEND_DIR', plugin_dir_path(__FILE__));
define('MEMBERFUN_BACKEND_URL', plugin_dir_url(__FILE__));

// Include required files
require_once MEMBERFUN_BACKEND_DIR . 'inc/helpers.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/api.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/social-auth.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/points-system/index.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/semina/index.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/comments/index.php';
require_once MEMBERFUN_BACKEND_DIR . 'options.php';
require_once MEMBERFUN_BACKEND_DIR . 'inc/challenge/index.php';

// Enqueue scripts
function memberfun_backend_enqueue_scripts() {
    wp_enqueue_script(
        'memberfun-backend-script',
        MEMBERFUN_BACKEND_URL . 'assets/memberfun.js',
        array('jquery'),
        MEMBERFUN_BACKEND_VERSION,
        true
    );

    wp_enqueue_style(
        'memberfun-backend-style',
        MEMBERFUN_BACKEND_URL . 'assets/memberfun.css',
        array(),
        MEMBERFUN_BACKEND_VERSION
    );

    wp_localize_script(
        'memberfun-backend-script',
        'memberfun_backend_vars',
        array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('memberfun_backend_nonce')
        )
    );
}
add_action('admin_enqueue_scripts', 'memberfun_backend_enqueue_scripts');

// Test email sending function
function memberfun_backend_send_test_email() {
    $to = 'mike.beplus@gmail.com';
    $subject = 'Test Email from MemberFun';
    $message = 'This is a test email from the MemberFun plugin.';
    $headers = array('Content-Type: text/html; charset=UTF-8');

    $sent = wp_mail($to, $subject, $message, $headers);
    var_dump($sent);
    return $sent;
}

// Send test email on init
// add_action('init', 'memberfun_backend_send_test_email');

// update user role for user registered for editor role
add_action('user_register', 'memberfun_backend_update_user_role');
function memberfun_backend_update_user_role($user_id) {
    $user = get_user_by('id', $user_id);
    $user->set_role('editor');
    $user->save();
}

// wordpress hook after user registration
add_action('user_register', 'memberfun_backend_send_email_to_user');
function memberfun_backend_send_email_to_user($user_id) {
    $user = get_user_by('id', $user_id);
    $to = $user->user_email;
    $subject = 'Welcome to MemberFun';
    $message = sprintf(
        '<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #2c3e50;">Welcome to MemberFun!</h2>
            <p>Hello %s,</p>
            <p>Your account has been created successfully. Here are your account details:</p>
            <ul style="list-style: none; padding-left: 0;">
                <li><strong>Username:</strong> %s</li>
                <li><strong>Email:</strong> %s</li>
            </ul>
            <p>You can now log in to your account and start exploring our platform.</p>
            <p>If you have any questions, please don\'t hesitate to contact us.</p>
            <p>Best regards,<br>The MemberFun Team</p>
        </div>',
        esc_html($user->display_name),
        esc_html($user->user_login),
        esc_html($user->user_email)
    );
    $headers = array('Content-Type: text/html; charset=UTF-8');
    wp_mail($to, $subject, $message, $headers);
}

// add_action('init', function() {
//     $result = memberfun_get_user_rank(5);
//     var_dump($result);
// });