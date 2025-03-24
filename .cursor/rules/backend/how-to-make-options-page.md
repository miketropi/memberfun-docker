# WordPress Options Page Development Guide

## Overview
This guide provides a structured approach to creating WordPress options pages with tabbed interfaces. It follows WordPress coding standards and best practices, making it easy to maintain and extend.

## Table of Contents
1. [Basic Structure](#basic-structure)
2. [Creating the Options Page](#creating-the-options-page)
3. [Registering Settings](#registering-settings)
4. [Creating Tabs](#creating-tabs)
5. [Adding Options](#adding-options)
6. [Handling Form Submission](#handling-form-submission)
7. [Retrieving Options](#retrieving-options)
8. [Best Practices](#best-practices)

## Basic Structure

### 1. Create a Class
```php
class Your_Plugin_Options {
    private $options;
    private $tabs = array();
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_options_page'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }
}
```

### 2. Initialize the Class
```php
// In your main plugin file
function init_your_plugin() {
    new Your_Plugin_Options();
}
add_action('plugins_loaded', 'init_your_plugin');
```

## Creating the Options Page

### 1. Add Menu Page
```php
public function add_options_page() {
    add_menu_page(
        'Plugin Settings', // Page title
        'Plugin Menu',     // Menu title
        'manage_options',  // Capability required
        'your-plugin-settings', // Menu slug
        array($this, 'render_options_page'), // Callback function
        'dashicons-admin-generic', // Icon
        30 // Position
    );
}
```

### 2. Render Options Page
```php
public function render_options_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Get active tab
    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'general';
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <h2 class="nav-tab-wrapper">
            <?php
            foreach ($this->tabs as $tab_id => $tab_name) {
                $class = ($active_tab === $tab_id) ? 'nav-tab-active' : '';
                printf(
                    '<a class="nav-tab %s" href="?page=%s&tab=%s">%s</a>',
                    esc_attr($class),
                    esc_attr('your-plugin-settings'),
                    esc_attr($tab_id),
                    esc_html($tab_name)
                );
            }
            ?>
        </h2>

        <form method="post" action="options.php">
            <?php
            settings_fields('your_plugin_options');
            do_settings_sections('your-plugin-settings-' . $active_tab);
            submit_button('Save Settings');
            ?>
        </form>
    </div>
    <?php
}
```

## Registering Settings

### 1. Define Settings Structure
```php
private $settings = array(
    'general' => array(
        'section_title' => 'General Settings',
        'fields' => array(
            'site_title' => array(
                'title' => 'Site Title',
                'type' => 'text',
                'description' => 'Enter your site title'
            ),
            'logo' => array(
                'title' => 'Logo',
                'type' => 'media',
                'description' => 'Select your logo'
            )
        )
    ),
    'social' => array(
        'section_title' => 'Social Media Settings',
        'fields' => array(
            'facebook_url' => array(
                'title' => 'Facebook URL',
                'type' => 'url',
                'description' => 'Enter your Facebook URL'
            )
        )
    )
);
```

### 2. Register Settings
```php
public function register_settings() {
    foreach ($this->settings as $tab_id => $tab) {
        // Register setting
        register_setting(
            'your_plugin_options',
            'your_plugin_' . $tab_id,
            array($this, 'sanitize_settings')
        );

        // Add section
        add_settings_section(
            'your_plugin_' . $tab_id . '_section',
            $tab['section_title'],
            array($this, 'render_section_description'),
            'your-plugin-settings-' . $tab_id
        );

        // Add fields
        foreach ($tab['fields'] as $field_id => $field) {
            add_settings_field(
                'your_plugin_' . $field_id,
                $field['title'],
                array($this, 'render_field'),
                'your-plugin-settings-' . $tab_id,
                'your_plugin_' . $tab_id . '_section',
                array(
                    'id' => $field_id,
                    'type' => $field['type'],
                    'description' => $field['description']
                )
            );
        }
    }
}
```

## Field Rendering

### 1. Field Renderer
```php
public function render_field($args) {
    $options = get_option('your_plugin_' . $args['id']);
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '';

    switch ($args['type']) {
        case 'text':
            printf(
                '<input type="text" id="%s" name="%s" value="%s" class="regular-text">',
                esc_attr($args['id']),
                esc_attr('your_plugin_' . $args['id'] . '[' . $args['id'] . ']'),
                esc_attr($value)
            );
            break;

        case 'textarea':
            printf(
                '<textarea id="%s" name="%s" rows="5" cols="50">%s</textarea>',
                esc_attr($args['id']),
                esc_attr('your_plugin_' . $args['id'] . '[' . $args['id'] . ']'),
                esc_textarea($value)
            );
            break;

        case 'media':
            ?>
            <div class="media-upload-wrapper">
                <input type="hidden" 
                       id="<?php echo esc_attr($args['id']); ?>" 
                       name="<?php echo esc_attr('your_plugin_' . $args['id'] . '[' . $args['id'] . ']'); ?>" 
                       value="<?php echo esc_attr($value); ?>">
                <div id="<?php echo esc_attr($args['id']); ?>_preview"></div>
                <button type="button" class="button" id="<?php echo esc_attr($args['id']); ?>_button">
                    Select Media
                </button>
            </div>
            <?php
            break;
    }

    if (!empty($args['description'])) {
        printf('<p class="description">%s</p>', esc_html($args['description']));
    }
}
```

## JavaScript for Media Upload

### 1. Enqueue Scripts
```php
public function enqueue_admin_assets($hook) {
    if ('toplevel_page_your-plugin-settings' !== $hook) {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_script(
        'your-plugin-admin',
        plugins_url('js/admin.js', __FILE__),
        array('jquery'),
        '1.0.0',
        true
    );
}
```

### 2. Media Upload Handler
```javascript
jQuery(document).ready(function($) {
    $('.media-upload-wrapper button').click(function(e) {
        e.preventDefault();
        
        var button = $(this);
        var wrapper = button.closest('.media-upload-wrapper');
        var input = wrapper.find('input[type="hidden"]');
        var preview = wrapper.find('div[id$="_preview"]');
        
        var frame = wp.media({
            title: 'Select Media',
            multiple: false
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            input.val(attachment.id);
            preview.html('<img src="' + attachment.url + '" style="max-width: 200px;">');
        });
        
        frame.open();
    });
});
```

## Adding New Options

### 1. Add New Tab
```php
// Add to $settings array
'new_tab' => array(
    'section_title' => 'New Tab Settings',
    'fields' => array(
        'new_option' => array(
            'title' => 'New Option',
            'type' => 'text',
            'description' => 'Description of new option'
        )
    )
);
```

### 2. Add New Field to Existing Tab
```php
// Add to existing tab in $settings array
'general' => array(
    'section_title' => 'General Settings',
    'fields' => array(
        // Existing fields...
        'new_field' => array(
            'title' => 'New Field',
            'type' => 'text',
            'description' => 'Description of new field'
        )
    )
);
```

## Retrieving Options

### 1. Get All Options
```php
$options = get_option('your_plugin_general');
```

### 2. Get Specific Option
```php
$options = get_option('your_plugin_general');
$site_title = isset($options['site_title']) ? $options['site_title'] : '';
```

## Best Practices

### 1. Security
- Always use nonces for forms
- Sanitize and validate all input
- Escape all output
- Check user capabilities
- Use WordPress Settings API

### 2. Performance
- Load assets only on relevant pages
- Use WordPress transients for caching
- Minimize database queries

### 3. Maintainability
- Use consistent naming conventions
- Document your code
- Follow WordPress coding standards
- Use OOP principles
- Keep settings organized by category

### 4. User Experience
- Provide clear descriptions
- Use appropriate input types
- Include validation feedback
- Make the interface intuitive
- Group related options together

## Example Usage

```php
// Get options
$general_options = get_option('your_plugin_general');
$social_options = get_option('your_plugin_social');

// Use in theme
$site_title = isset($general_options['site_title']) ? $general_options['site_title'] : '';
$facebook_url = isset($social_options['facebook_url']) ? $social_options['facebook_url'] : '';
```

## Troubleshooting

### Common Issues
1. Settings not saving
   - Check nonce verification
   - Verify capability checks
   - Ensure proper option registration

2. Media uploader not working
   - Verify wp_enqueue_media() is called
   - Check JavaScript console for errors
   - Ensure proper script dependencies

3. Tabs not switching
   - Verify tab IDs match section IDs
   - Check JavaScript for errors
   - Ensure proper URL parameters

## Additional Resources
- [WordPress Settings API](https://codex.wordpress.org/Settings_API)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
