<?php
/**
 * Memberfun Options Page
 * 
 * This file initializes the Memberfun options page functionality
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Include the options class
require_once plugin_dir_path(__FILE__) . 'class/class-options.php';

/**
 * Initialize Memberfun Options
 */
function memberfun_init_options() {
    new Memberfun_Options();

    // $options_general = get_option('memberfun_general');
    // $options = get_option('memberfun_general');
    // $frontend_url = isset($options['frontend_url']) ? $options['frontend_url'] : '';
    // $logo_id = isset($options['logo']) ? $options['logo'] : '';
    // $facebook_url = isset($options['facebook_url']) ? $options['facebook_url'] : '';
    // $instagram_url = isset($options['instagram_url']) ? $options['instagram_url'] : '';
    // $x_url = isset($options['x_url']) ? $options['x_url'] : '';
    // print_r($options_general);
}
add_action('plugins_loaded', 'memberfun_init_options');
