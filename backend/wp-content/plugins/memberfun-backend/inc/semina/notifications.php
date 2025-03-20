<?php
/**
 * MemberFun Semina - Notifications
 * 
 * Handles email notifications for the Member Semina post type
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Handle post status transitions to send notifications when a seminar is published
 * 
 * @param string $new_status New post status
 * @param string $old_status Old post status
 * @param WP_Post $post Post object
 */
function memberfun_semina_handle_status_transition($new_status, $old_status, $post) {
    // Only proceed if this is a seminar post type
    if ($post->post_type !== 'memberfun_semina') {
        return;
    }
    
    // Check if the post is being published for the first time
    if ($new_status === 'publish' && $old_status !== 'publish') {
        // Send notification to all members
        memberfun_semina_send_notification($post->ID);
    }
}

/**
 * Send notification email about a seminar
 * 
 * @param int $post_id The seminar post ID
 * @return bool Whether the notification was sent successfully
 */
function memberfun_semina_send_notification($post_id) {
    // Get seminar details
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'memberfun_semina') {
        return false;
    }
    
    // Get notification settings
    $notification_enabled = get_option('memberfun_semina_notification_enabled', true);
    if (!$notification_enabled) {
        return false;
    }
    
    // Get user roles to notify
    $roles_to_notify = get_option('memberfun_semina_notification_roles', array('subscriber'));
    if (empty($roles_to_notify)) {
        $roles_to_notify = array('subscriber');
    }
    
    // Get seminar meta data
    $seminar_date = get_post_meta($post_id, '_memberfun_semina_date', true);
    $seminar_time = get_post_meta($post_id, '_memberfun_semina_time', true);
    $seminar_location = get_post_meta($post_id, '_memberfun_semina_location', true);
    $host_id = get_post_meta($post_id, '_memberfun_semina_host', true);
    $host = get_userdata($host_id);
    $host_name = $host ? $host->display_name : __('Unknown Host', 'memberfun-backend');
    
    // Format date and time
    $date_time = '';
    if (!empty($seminar_date)) {
        $date_time = date_i18n(get_option('date_format'), strtotime($seminar_date));
        if (!empty($seminar_time)) {
            $date_time .= ' ' . date_i18n(get_option('time_format'), strtotime($seminar_time));
        }
    }
    
    // Get users to notify
    $users = get_users(array(
        'role__in' => $roles_to_notify,
        'fields' => array('ID', 'user_email', 'display_name'),
    ));
    
    if (empty($users)) {
        return false;
    }
    
    // Get email template
    $email_subject = get_option('memberfun_semina_notification_subject', __('New Seminar Announcement: {seminar_title}', 'memberfun-backend'));
    $email_template = get_option('memberfun_semina_notification_template', memberfun_semina_get_default_email_template());
    
    // Replace placeholders in subject
    $email_subject = str_replace(
        array('{seminar_title}', '{date_time}', '{host_name}'),
        array($post->post_title, $date_time, $host_name),
        $email_subject
    );
    
    // Get seminar permalink
    $seminar_url = get_permalink($post_id);
    
    // Get documents
    $documents = get_post_meta($post_id, '_memberfun_semina_documents', true);
    $documents_html = '';
    
    if (!empty($documents) && is_array($documents)) {
        $documents_html = '<ul>';
        foreach ($documents as $document) {
            $documents_html .= '<li><a href="' . esc_url($document['url']) . '">' . esc_html($document['title']) . '</a></li>';
        }
        $documents_html .= '</ul>';
    } else {
        $documents_html = '<p>' . __('No documents available for this seminar.', 'memberfun-backend') . '</p>';
    }
    
    // Get seminar content
    $seminar_content = apply_filters('the_content', $post->post_content);
    
    // Send emails to each user
    $sent_count = 0;
    
    foreach ($users as $user) {
        // Replace placeholders in email body
        $email_body = str_replace(
            array(
                '{user_name}',
                '{seminar_title}',
                '{seminar_content}',
                '{date_time}',
                '{location}',
                '{host_name}',
                '{seminar_url}',
                '{documents}'
            ),
            array(
                $user->display_name,
                $post->post_title,
                $seminar_content,
                $date_time,
                $seminar_location,
                $host_name,
                $seminar_url,
                $documents_html
            ),
            $email_template
        );
        
        // Set up email headers
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>',
        );
        
        // Send the email
        $sent = wp_mail($user->user_email, $email_subject, $email_body, $headers);
        
        if ($sent) {
            $sent_count++;
        }
    }
    
    // Log the notification
    update_post_meta($post_id, '_memberfun_semina_notification_sent', current_time('mysql'));
    update_post_meta($post_id, '_memberfun_semina_notification_count', $sent_count);
    
    return $sent_count > 0;
}

/**
 * Get the default email template
 * 
 * @return string The default email template
 */
function memberfun_semina_get_default_email_template() {
    $template = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{seminar_title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333333; background-color: #f5f5f5;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td style="padding: 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #dddddd;">
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #4CAF50; color: #ffffff;">
                                <h1 style="margin: 0;">{seminar_title}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px;">
                                <p>Hello {user_name},</p>
                                <p>We are excited to announce a new seminar that you might be interested in!</p>
                                
                                <h2 style="color: #4CAF50;">{seminar_title}</h2>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                                    <tr>
                                        <td width="120" style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Date & Time:</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">{date_time}</td>
                                    </tr>
                                    <tr>
                                        <td width="120" style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Location:</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">{location}</td>
                                    </tr>
                                    <tr>
                                        <td width="120" style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Host:</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">{host_name}</td>
                                    </tr>
                                </table>
                                
                                <div style="margin-bottom: 20px;">
                                    <h3 style="color: #4CAF50;">Seminar Description</h3>
                                    <div>{seminar_content}</div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h3 style="color: #4CAF50;">Seminar Documents</h3>
                                    <div>{documents}</div>
                                </div>
                                
                                <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
                                    <a href="{seminar_url}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">View Seminar Details</a>
                                </div>
                                
                                <p>We hope to see you there!</p>
                                <p>Best regards,<br>The ' . get_bloginfo('name') . ' Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #777777;">
                                <p>&copy; ' . date('Y') . ' ' . get_bloginfo('name') . '. All rights reserved.</p>
                                <p>You are receiving this email because you are a registered member of our site.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    ';
    
    return $template;
}

/**
 * Register notification settings
 */
function memberfun_semina_register_settings() {
    register_setting('memberfun_semina_settings', 'memberfun_semina_notification_enabled', array(
        'type' => 'boolean',
        'default' => true,
    ));
    
    register_setting('memberfun_semina_settings', 'memberfun_semina_notification_roles', array(
        'type' => 'array',
        'default' => array('subscriber'),
    ));
    
    register_setting('memberfun_semina_settings', 'memberfun_semina_notification_subject', array(
        'type' => 'string',
        'default' => __('New Seminar Announcement: {seminar_title}', 'memberfun-backend'),
    ));
    
    register_setting('memberfun_semina_settings', 'memberfun_semina_notification_template', array(
        'type' => 'string',
        'default' => memberfun_semina_get_default_email_template(),
    ));
}
add_action('admin_init', 'memberfun_semina_register_settings');

/**
 * Add settings page for seminar notifications
 */
function memberfun_semina_add_settings_page() {
    add_submenu_page(
        'edit.php?post_type=memberfun_semina',
        __('Notification Settings', 'memberfun-backend'),
        __('Notification Settings', 'memberfun-backend'),
        'manage_options',
        'memberfun-semina-settings',
        'memberfun_semina_settings_page'
    );
}
add_action('admin_menu', 'memberfun_semina_add_settings_page');

/**
 * Render the settings page
 */
function memberfun_semina_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Handle form submission
    if (isset($_POST['memberfun_semina_settings_nonce']) && wp_verify_nonce($_POST['memberfun_semina_settings_nonce'], 'memberfun_semina_settings')) {
        // Save notification enabled setting
        $notification_enabled = isset($_POST['memberfun_semina_notification_enabled']) ? true : false;
        update_option('memberfun_semina_notification_enabled', $notification_enabled);
        
        // Save notification roles
        $notification_roles = isset($_POST['memberfun_semina_notification_roles']) ? (array) $_POST['memberfun_semina_notification_roles'] : array();
        update_option('memberfun_semina_notification_roles', $notification_roles);
        
        // Save notification subject
        if (isset($_POST['memberfun_semina_notification_subject'])) {
            update_option('memberfun_semina_notification_subject', sanitize_text_field($_POST['memberfun_semina_notification_subject']));
        }
        
        // Save notification template
        if (isset($_POST['memberfun_semina_notification_template'])) {
            update_option('memberfun_semina_notification_template', wp_kses_post($_POST['memberfun_semina_notification_template']));
        }
        
        // Show success message
        echo '<div class="notice notice-success is-dismissible"><p>' . __('Settings saved successfully.', 'memberfun-backend') . '</p></div>';
    }
    
    // Get current settings
    $notification_enabled = get_option('memberfun_semina_notification_enabled', true);
    $notification_roles = get_option('memberfun_semina_notification_roles', array('subscriber'));
    $notification_subject = get_option('memberfun_semina_notification_subject', __('New Seminar Announcement: {seminar_title}', 'memberfun-backend'));
    $notification_template = get_option('memberfun_semina_notification_template', memberfun_semina_get_default_email_template());
    
    // Get available roles
    $roles = get_editable_roles();
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <form method="post" action="">
            <?php wp_nonce_field('memberfun_semina_settings', 'memberfun_semina_settings_nonce'); ?>
            
            <table class="form-table">
                <tr>
                    <th scope="row"><?php _e('Enable Notifications', 'memberfun-backend'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="memberfun_semina_notification_enabled" value="1" <?php checked($notification_enabled); ?> />
                            <?php _e('Send email notifications when new seminars are published', 'memberfun-backend'); ?>
                        </label>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row"><?php _e('User Roles to Notify', 'memberfun-backend'); ?></th>
                    <td>
                        <?php foreach ($roles as $role_key => $role) : ?>
                            <label>
                                <input type="checkbox" name="memberfun_semina_notification_roles[]" value="<?php echo esc_attr($role_key); ?>" <?php checked(in_array($role_key, $notification_roles)); ?> />
                                <?php echo esc_html($role['name']); ?>
                            </label><br>
                        <?php endforeach; ?>
                        <p class="description"><?php _e('Select which user roles should receive seminar notifications', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row"><?php _e('Email Subject', 'memberfun-backend'); ?></th>
                    <td>
                        <input type="text" name="memberfun_semina_notification_subject" value="<?php echo esc_attr($notification_subject); ?>" class="regular-text" />
                        <p class="description">
                            <?php _e('Available placeholders: {seminar_title}, {date_time}, {host_name}', 'memberfun-backend'); ?>
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row"><?php _e('Email Template', 'memberfun-backend'); ?></th>
                    <td>
                        <textarea name="memberfun_semina_notification_template" rows="20" class="large-text code"><?php echo esc_textarea($notification_template); ?></textarea>
                        <p class="description">
                            <?php _e('Available placeholders: {user_name}, {seminar_title}, {seminar_content}, {date_time}, {location}, {host_name}, {seminar_url}, {documents}', 'memberfun-backend'); ?>
                        </p>
                    </td>
                </tr>
            </table>
            
            <p>
                <button type="submit" class="button button-primary"><?php _e('Save Settings', 'memberfun-backend'); ?></button>
                <button type="button" class="button" id="memberfun-semina-reset-template"><?php _e('Reset to Default Template', 'memberfun-backend'); ?></button>
            </p>
        </form>
        
        <script>
        jQuery(document).ready(function($) {
            $('#memberfun-semina-reset-template').on('click', function(e) {
                e.preventDefault();
                
                if (confirm('<?php _e('Are you sure you want to reset the email template to default? This will overwrite your current template.', 'memberfun-backend'); ?>')) {
                    $('textarea[name="memberfun_semina_notification_template"]').val(<?php echo json_encode(memberfun_semina_get_default_email_template()); ?>);
                }
            });
        });
        </script>
    </div>
    <?php
}

/**
 * Add a test notification button to the settings page
 */
function memberfun_semina_test_notification() {
    // Only proceed if this is the seminar settings page
    if (!isset($_GET['page']) || $_GET['page'] !== 'memberfun-semina-settings') {
        return;
    }
    
    // Check if the test button was clicked
    if (isset($_POST['memberfun_semina_test_notification']) && isset($_POST['memberfun_semina_test_nonce']) && wp_verify_nonce($_POST['memberfun_semina_test_nonce'], 'memberfun_semina_test_notification')) {
        // Get a seminar to use for the test
        $seminars = get_posts(array(
            'post_type' => 'memberfun_semina',
            'posts_per_page' => 1,
            'post_status' => 'publish',
        ));
        
        if (!empty($seminars)) {
            $seminar_id = $seminars[0]->ID;
            
            // Send a test notification to the current user
            $current_user = wp_get_current_user();
            
            // Get seminar meta data
            $seminar_date = get_post_meta($seminar_id, '_memberfun_semina_date', true);
            $seminar_time = get_post_meta($seminar_id, '_memberfun_semina_time', true);
            $seminar_location = get_post_meta($seminar_id, '_memberfun_semina_location', true);
            $host_id = get_post_meta($seminar_id, '_memberfun_semina_host', true);
            $host = get_userdata($host_id);
            $host_name = $host ? $host->display_name : __('Unknown Host', 'memberfun-backend');
            
            // Format date and time
            $date_time = '';
            if (!empty($seminar_date)) {
                $date_time = date_i18n(get_option('date_format'), strtotime($seminar_date));
                if (!empty($seminar_time)) {
                    $date_time .= ' ' . date_i18n(get_option('time_format'), strtotime($seminar_time));
                }
            }
            
            // Get email template
            $email_subject = get_option('memberfun_semina_notification_subject', __('New Seminar Announcement: {seminar_title}', 'memberfun-backend'));
            $email_template = get_option('memberfun_semina_notification_template', memberfun_semina_get_default_email_template());
            
            // Replace placeholders in subject
            $email_subject = str_replace(
                array('{seminar_title}', '{date_time}', '{host_name}'),
                array($seminars[0]->post_title, $date_time, $host_name),
                $email_subject
            );
            
            // Add TEST prefix to subject
            $email_subject = '[TEST] ' . $email_subject;
            
            // Get seminar permalink
            $seminar_url = get_permalink($seminar_id);
            
            // Get documents
            $documents = get_post_meta($seminar_id, '_memberfun_semina_documents', true);
            $documents_html = '';
            
            if (!empty($documents) && is_array($documents)) {
                $documents_html = '<ul>';
                foreach ($documents as $document) {
                    $documents_html .= '<li><a href="' . esc_url($document['url']) . '">' . esc_html($document['title']) . '</a></li>';
                }
                $documents_html .= '</ul>';
            } else {
                $documents_html = '<p>' . __('No documents available for this seminar.', 'memberfun-backend') . '</p>';
            }
            
            // Get seminar content
            $seminar_content = apply_filters('the_content', $seminars[0]->post_content);
            
            // Replace placeholders in email body
            $email_body = str_replace(
                array(
                    '{user_name}',
                    '{seminar_title}',
                    '{seminar_content}',
                    '{date_time}',
                    '{location}',
                    '{host_name}',
                    '{seminar_url}',
                    '{documents}'
                ),
                array(
                    $current_user->display_name,
                    $seminars[0]->post_title,
                    $seminar_content,
                    $date_time,
                    $seminar_location,
                    $host_name,
                    $seminar_url,
                    $documents_html
                ),
                $email_template
            );
            
            // Set up email headers
            $headers = array(
                'Content-Type: text/html; charset=UTF-8',
                'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>',
            );
            
            // Send the test email
            $sent = wp_mail($current_user->user_email, $email_subject, $email_body, $headers);
            
            if ($sent) {
                echo '<div class="notice notice-success is-dismissible"><p>' . sprintf(__('Test notification sent to %s.', 'memberfun-backend'), $current_user->user_email) . '</p></div>';
            } else {
                echo '<div class="notice notice-error is-dismissible"><p>' . __('Failed to send test notification. Please check your email configuration.', 'memberfun-backend') . '</p></div>';
            }
        } else {
            echo '<div class="notice notice-error is-dismissible"><p>' . __('No published seminars found to use for the test notification.', 'memberfun-backend') . '</p></div>';
        }
    }
    
    // Add the test button to the settings page
    add_action('admin_footer', function() {
        ?>
        <script>
        jQuery(document).ready(function($) {
            var testButton = $('<button type="submit" name="memberfun_semina_test_notification" class="button"><?php _e('Send Test Notification', 'memberfun-backend'); ?></button>');
            var nonce = $('<input type="hidden" name="memberfun_semina_test_nonce" value="<?php echo wp_create_nonce('memberfun_semina_test_notification'); ?>" />');
            
            $('.wrap form p:last').append('&nbsp;').append(testButton).append(nonce);
        });
        </script>
        <?php
    });
}
add_action('admin_init', 'memberfun_semina_test_notification'); 