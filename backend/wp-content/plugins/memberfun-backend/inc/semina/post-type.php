<?php
/**
 * MemberFun Semina - Custom Post Type
 * 
 * Registers and configures the Member Semina custom post type
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Register the Member Semina custom post type
 */
function memberfun_semina_register_post_type() {
    $labels = array(
        'name'                  => _x('Member Seminars', 'Post type general name', 'memberfun-backend'),
        'singular_name'         => _x('Member Seminar', 'Post type singular name', 'memberfun-backend'),
        'menu_name'             => _x('Member Seminars', 'Admin Menu text', 'memberfun-backend'),
        'name_admin_bar'        => _x('Member Seminar', 'Add New on Toolbar', 'memberfun-backend'),
        'add_new'               => __('Add New', 'memberfun-backend'),
        'add_new_item'          => __('Add New Seminar', 'memberfun-backend'),
        'new_item'              => __('New Seminar', 'memberfun-backend'),
        'edit_item'             => __('Edit Seminar', 'memberfun-backend'),
        'view_item'             => __('View Seminar', 'memberfun-backend'),
        'all_items'             => __('All Seminars', 'memberfun-backend'),
        'search_items'          => __('Search Seminars', 'memberfun-backend'),
        'parent_item_colon'     => __('Parent Seminars:', 'memberfun-backend'),
        'not_found'             => __('No seminars found.', 'memberfun-backend'),
        'not_found_in_trash'    => __('No seminars found in Trash.', 'memberfun-backend'),
        'featured_image'        => _x('Seminar Cover Image', 'Overrides the "Featured Image" phrase', 'memberfun-backend'),
        'set_featured_image'    => _x('Set cover image', 'Overrides the "Set featured image" phrase', 'memberfun-backend'),
        'remove_featured_image' => _x('Remove cover image', 'Overrides the "Remove featured image" phrase', 'memberfun-backend'),
        'use_featured_image'    => _x('Use as cover image', 'Overrides the "Use as featured image" phrase', 'memberfun-backend'),
        'archives'              => _x('Seminar archives', 'The post type archive label used in nav menus', 'memberfun-backend'),
        'insert_into_item'      => _x('Insert into seminar', 'Overrides the "Insert into post" phrase', 'memberfun-backend'),
        'uploaded_to_this_item' => _x('Uploaded to this seminar', 'Overrides the "Uploaded to this post" phrase', 'memberfun-backend'),
        'filter_items_list'     => _x('Filter seminars list', 'Screen reader text for the filter links', 'memberfun-backend'),
        'items_list_navigation' => _x('Seminars list navigation', 'Screen reader text for the pagination', 'memberfun-backend'),
        'items_list'            => _x('Seminars list', 'Screen reader text for the items list', 'memberfun-backend'),
    );

    $capabilities = array(
        'edit_post'             => 'edit_memberfun_semina',
        'read_post'             => 'read_memberfun_semina',
        'delete_post'           => 'delete_memberfun_semina',
        'edit_posts'            => 'edit_memberfun_seminas',
        'edit_others_posts'     => 'edit_others_memberfun_seminas',
        'publish_posts'         => 'publish_memberfun_seminas',
        'read_private_posts'    => 'read_private_memberfun_seminas',
    );

    $args = array(
        'labels'                => $labels,
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'query_var'             => true,
        'rewrite'               => array('slug' => 'member-seminar'),
        'capability_type'       => array('memberfun_semina', 'memberfun_seminas'),
        'capabilities'          => $capabilities,
        'map_meta_cap'          => true,
        'has_archive'           => true,
        'hierarchical'          => false,
        'menu_position'         => 25,
        'menu_icon'             => 'dashicons-calendar-alt',
        'supports'              => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'revisions'),
        'show_in_rest'          => true,
        'rest_base'             => 'member-seminars',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('memberfun_semina', $args);

    // Add custom capabilities to administrator role
    $admin_role = get_role('administrator');
    if ($admin_role) {
        $admin_role->add_cap('edit_memberfun_semina');
        $admin_role->add_cap('read_memberfun_semina');
        $admin_role->add_cap('delete_memberfun_semina');
        $admin_role->add_cap('edit_memberfun_seminas');
        $admin_role->add_cap('edit_others_memberfun_seminas');
        $admin_role->add_cap('publish_memberfun_seminas');
        $admin_role->add_cap('read_private_memberfun_seminas');
        $admin_role->add_cap('delete_memberfun_seminas');
        $admin_role->add_cap('delete_private_memberfun_seminas');
        $admin_role->add_cap('delete_published_memberfun_seminas');
        $admin_role->add_cap('delete_others_memberfun_seminas');
        $admin_role->add_cap('edit_private_memberfun_seminas');
        $admin_role->add_cap('edit_published_memberfun_seminas');
    }
}

/**
 * Disable Gutenberg editor for memberfun_semina post type
 */
function memberfun_semina_disable_gutenberg($use_block_editor, $post_type) {
    if ($post_type === 'memberfun_semina') {
        return false;
    }
    return $use_block_editor;
}
add_filter('use_block_editor_for_post_type', 'memberfun_semina_disable_gutenberg', 10, 2);


/**
 * Flush rewrite rules on plugin activation
 */
function memberfun_semina_flush_rewrite_rules() {
    memberfun_semina_register_post_type();
    flush_rewrite_rules();
}

// Register activation hook for flushing rewrite rules
register_activation_hook(MEMBERFUN_BACKEND_DIR . 'memberfun-backend.php', 'memberfun_semina_flush_rewrite_rules'); 