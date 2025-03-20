<?php
/**
 * MemberFun Points System - Admin Interface
 * 
 * Admin interface for managing user points
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Include WP_List_Table if not already included
if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

/**
 * Register admin menu items
 */
function memberfun_points_admin_menu() {
    // Add Points System as a top-level menu
    add_menu_page(
        __('Points System', 'memberfun-backend'),
        __('Points System', 'memberfun-backend'),
        'manage_options',
        'memberfun-points',
        'memberfun_points_admin_page',
        'dashicons-star-filled',
        30
    );
}

/**
 * Render the main admin page
 */
function memberfun_points_admin_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Get the active tab
    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'transactions';
    
    // Handle form submissions
    if (isset($_POST['memberfun_points_action']) && check_admin_referer('memberfun_points_nonce')) {
        $action = sanitize_text_field($_POST['memberfun_points_action']);
        
        if ($action === 'add') {
            memberfun_points_handle_add_form();
        } elseif ($action === 'deduct') {
            memberfun_points_handle_deduct_form();
        }
    }
    
    // Handle bulk actions
    if (isset($_POST['action']) && $_POST['action'] !== '-1' && isset($_POST['transaction_id']) && check_admin_referer('bulk-transactions')) {
        $action = sanitize_text_field($_POST['action']);
        $transaction_ids = array_map('intval', $_POST['transaction_id']);
        
        if ($action === 'delete' && !empty($transaction_ids)) {
            memberfun_points_handle_bulk_delete($transaction_ids);
        }
    }
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('MemberFun Points System', 'memberfun-backend'); ?></h1>
        
        <h2 class="nav-tab-wrapper">
            <a href="?post_type=memberfun_member&page=memberfun-points&tab=transactions" class="nav-tab <?php echo $active_tab === 'transactions' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Transactions', 'memberfun-backend'); ?>
            </a>
            <a href="?post_type=memberfun_member&page=memberfun-points&tab=add" class="nav-tab <?php echo $active_tab === 'add' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Add Points', 'memberfun-backend'); ?>
            </a>
            <a href="?post_type=memberfun_member&page=memberfun-points&tab=deduct" class="nav-tab <?php echo $active_tab === 'deduct' ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html__('Deduct Points', 'memberfun-backend'); ?>
            </a>
        </h2>
        
        <div class="tab-content">
            <?php
            if ($active_tab === 'transactions') {
                memberfun_points_render_transactions_tab();
            } elseif ($active_tab === 'add') {
                memberfun_points_render_add_tab();
            } elseif ($active_tab === 'deduct') {
                memberfun_points_render_deduct_tab();
            }
            ?>
        </div>
    </div>
    <?php
}

/**
 * Render the transactions tab
 */
function memberfun_points_render_transactions_tab() {
    // Create an instance of the list table
    $transactions_table = new MemberFun_Points_List_Table();
    
    // Prepare the table
    $transactions_table->prepare_items();
    
    // Display the table
    ?>
    <div class="transactions-list-container">
        <form method="get">
            <input type="hidden" name="post_type" value="memberfun_member" />
            <input type="hidden" name="page" value="memberfun-points" />
            <input type="hidden" name="tab" value="transactions" />
            <?php
            // Display search box
            $transactions_table->search_box(__('Search Transactions', 'memberfun-backend'), 'search_transactions');
            
            // Display the table
            $transactions_table->display();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Render the add points tab
 */
function memberfun_points_render_add_tab() {
    ?>
    <div class="add-points-form-container">
        <form method="post" action="?post_type=memberfun_member&page=memberfun-points&tab=add">
            <?php wp_nonce_field('memberfun_points_nonce'); ?>
            <input type="hidden" name="memberfun_points_action" value="add" />
            
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="user_id"><?php echo esc_html__('User', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <?php
                        // Get all users for dropdown
                        $users = get_users(array('fields' => array('ID', 'display_name')));
                        if (!empty($users)) {
                            echo '<select name="user_id" id="user_id" class="regular-text" required>';
                            echo '<option value="">' . esc_html__('Select a user', 'memberfun-backend') . '</option>';
                            foreach ($users as $user) {
                                echo '<option value="' . esc_attr($user->ID) . '">' . esc_html($user->display_name) . ' (ID: ' . esc_html($user->ID) . ')</option>';
                            }
                            echo '</select>';
                        } else {
                            echo esc_html__('No users found', 'memberfun-backend');
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="points"><?php echo esc_html__('Points', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <input type="number" name="points" id="points" class="regular-text" min="1" required />
                        <p class="description"><?php echo esc_html__('Number of points to add (positive number)', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="note"><?php echo esc_html__('Note', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <textarea name="note" id="note" class="large-text" rows="3"></textarea>
                        <p class="description"><?php echo esc_html__('Optional note about this transaction', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button(__('Add Points', 'memberfun-backend')); ?>
        </form>
    </div>
    <?php
}

/**
 * Render the deduct points tab
 */
function memberfun_points_render_deduct_tab() {
    ?>
    <div class="deduct-points-form-container">
        <form method="post" action="?post_type=memberfun_member&page=memberfun-points&tab=deduct">
            <?php wp_nonce_field('memberfun_points_nonce'); ?>
            <input type="hidden" name="memberfun_points_action" value="deduct" />
            
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="user_id"><?php echo esc_html__('User', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <?php
                        // Get all users for dropdown
                        $users = get_users(array('fields' => array('ID', 'display_name')));
                        if (!empty($users)) {
                            echo '<select name="user_id" id="user_id" class="regular-text" required>';
                            echo '<option value="">' . esc_html__('Select a user', 'memberfun-backend') . '</option>';
                            foreach ($users as $user) {
                                $points = memberfun_get_user_points($user->ID);
                                echo '<option value="' . esc_attr($user->ID) . '">' . esc_html($user->display_name) . ' (ID: ' . esc_html($user->ID) . ', Points: ' . esc_html($points) . ')</option>';
                            }
                            echo '</select>';
                        } else {
                            echo esc_html__('No users found', 'memberfun-backend');
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="points"><?php echo esc_html__('Points', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <input type="number" name="points" id="points" class="regular-text" min="1" required />
                        <p class="description"><?php echo esc_html__('Number of points to deduct (positive number)', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="allow_negative"><?php echo esc_html__('Allow Negative Balance', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" name="allow_negative" id="allow_negative" value="1" />
                        <p class="description"><?php echo esc_html__('Allow user\'s point balance to go below zero', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="note"><?php echo esc_html__('Note', 'memberfun-backend'); ?></label>
                    </th>
                    <td>
                        <textarea name="note" id="note" class="large-text" rows="3"></textarea>
                        <p class="description"><?php echo esc_html__('Optional note about this transaction', 'memberfun-backend'); ?></p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button(__('Deduct Points', 'memberfun-backend')); ?>
        </form>
    </div>
    <?php
}

/**
 * Handle the add points form submission
 */
function memberfun_points_handle_add_form() {
    // Validate and sanitize input
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    $points = isset($_POST['points']) ? absint($_POST['points']) : 0;
    $note = isset($_POST['note']) ? sanitize_textarea_field($_POST['note']) : '';
    
    // Validate required fields
    if (empty($user_id) || empty($points)) {
        add_settings_error(
            'memberfun_points',
            'required_fields',
            __('User and points are required fields.', 'memberfun-backend'),
            'error'
        );
        return;
    }
    
    // Add the points
    $result = memberfun_add_points($user_id, $points, $note);
    
    // Check for errors
    if (is_wp_error($result)) {
        add_settings_error(
            'memberfun_points',
            'add_points_error',
            $result->get_error_message(),
            'error'
        );
        return;
    }
    
    // Success message
    add_settings_error(
        'memberfun_points',
        'add_points_success',
        sprintf(__('Successfully added %d points to user.', 'memberfun-backend'), $points),
        'success'
    );
}

/**
 * Handle the deduct points form submission
 */
function memberfun_points_handle_deduct_form() {
    // Validate and sanitize input
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    $points = isset($_POST['points']) ? absint($_POST['points']) : 0;
    $note = isset($_POST['note']) ? sanitize_textarea_field($_POST['note']) : '';
    $allow_negative = isset($_POST['allow_negative']) ? (bool) $_POST['allow_negative'] : false;
    
    // Validate required fields
    if (empty($user_id) || empty($points)) {
        add_settings_error(
            'memberfun_points',
            'required_fields',
            __('User and points are required fields.', 'memberfun-backend'),
            'error'
        );
        return;
    }
    
    // Deduct the points
    $result = memberfun_deduct_points($user_id, $points, $note, 0, $allow_negative);
    
    // Check for errors
    if (is_wp_error($result)) {
        add_settings_error(
            'memberfun_points',
            'deduct_points_error',
            $result->get_error_message(),
            'error'
        );
        return;
    }
    
    // Success message
    add_settings_error(
        'memberfun_points',
        'deduct_points_success',
        sprintf(__('Successfully deducted %d points from user.', 'memberfun-backend'), $points),
        'success'
    );
}

/**
 * Handle bulk delete action
 * 
 * @param array $transaction_ids Array of transaction IDs to delete
 */
function memberfun_points_handle_bulk_delete($transaction_ids) {
    global $wpdb;
    
    if (empty($transaction_ids)) {
        return;
    }
    
    $table_name = memberfun_points_get_table_name();
    $count = 0;
    
    foreach ($transaction_ids as $transaction_id) {
        $result = $wpdb->delete(
            $table_name,
            array('id' => $transaction_id),
            array('%d')
        );
        
        if ($result) {
            $count++;
        }
    }
    
    if ($count > 0) {
        add_settings_error(
            'memberfun_points',
            'delete_success',
            sprintf(_n('%d transaction deleted.', '%d transactions deleted.', $count, 'memberfun-backend'), $count),
            'success'
        );
    }
}

/**
 * Points Transactions List Table class
 */
class MemberFun_Points_List_Table extends WP_List_Table {
    
    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct(array(
            'singular' => 'transaction',
            'plural'   => 'transactions',
            'ajax'     => false
        ));
    }
    
    /**
     * Get columns
     * 
     * @return array
     */
    public function get_columns() {
        return array(
            'cb'         => '<input type="checkbox" />',
            'id'         => __('ID', 'memberfun-backend'),
            'user'       => __('User', 'memberfun-backend'),
            'points'     => __('Points', 'memberfun-backend'),
            'type'       => __('Type', 'memberfun-backend'),
            'note'       => __('Note', 'memberfun-backend'),
            'admin_user' => __('Added By', 'memberfun-backend'),
            'created_at' => __('Date', 'memberfun-backend')
        );
    }
    
    /**
     * Get sortable columns
     * 
     * @return array
     */
    public function get_sortable_columns() {
        return array(
            'id'         => array('id', true),
            'user'       => array('user_id', false),
            'points'     => array('points', false),
            'type'       => array('type', false),
            'created_at' => array('created_at', true)
        );
    }
    
    /**
     * Prepare items
     */
    public function prepare_items() {
        // Set up column headers
        $this->_column_headers = array(
            $this->get_columns(),
            array(),
            $this->get_sortable_columns()
        );
        
        // Process bulk actions
        $this->process_bulk_action();
        
        // Get pagination parameters
        $per_page = 20;
        $current_page = $this->get_pagenum();
        
        // Prepare query args
        $args = array(
            'number'  => $per_page,
            'offset'  => ($current_page - 1) * $per_page,
            'orderby' => isset($_REQUEST['orderby']) ? sanitize_text_field($_REQUEST['orderby']) : 'created_at',
            'order'   => isset($_REQUEST['order']) ? sanitize_text_field($_REQUEST['order']) : 'DESC'
        );
        
        // Add search if provided
        if (isset($_REQUEST['s']) && !empty($_REQUEST['s'])) {
            $args['search'] = sanitize_text_field($_REQUEST['s']);
        }
        
        // Add user filter if provided
        if (isset($_REQUEST['user_id']) && !empty($_REQUEST['user_id'])) {
            $args['user_id'] = intval($_REQUEST['user_id']);
        }
        
        // Get the data
        $this->items = memberfun_get_all_transactions($args);
        
        // Set up pagination
        $total_items = memberfun_count_transactions($args);
        
        $this->set_pagination_args(array(
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil($total_items / $per_page)
        ));
    }
    
    /**
     * Get bulk actions
     * 
     * @return array
     */
    public function get_bulk_actions() {
        return array(
            'delete' => __('Delete', 'memberfun-backend')
        );
    }
    
    /**
     * Column default
     * 
     * @param object $item
     * @param string $column_name
     * @return string
     */
    public function column_default($item, $column_name) {
        switch ($column_name) {
            case 'id':
                return $item->id;
            case 'points':
                return number_format_i18n($item->points);
            case 'type':
                return $item->type === 'add' 
                    ? '<span class="points-type points-add">' . __('Add', 'memberfun-backend') . '</span>' 
                    : '<span class="points-type points-deduct">' . __('Deduct', 'memberfun-backend') . '</span>';
            case 'note':
                return empty($item->note) ? '—' : esc_html($item->note);
            case 'created_at':
                return mysql2date(get_option('date_format') . ' ' . get_option('time_format'), $item->created_at);
            default:
                return print_r($item, true);
        }
    }
    
    /**
     * Column cb
     * 
     * @param object $item
     * @return string
     */
    public function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="transaction_id[]" value="%s" />',
            $item->id
        );
    }
    
    /**
     * Column user
     * 
     * @param object $item
     * @return string
     */
    public function column_user($item) {
        $user = get_user_by('id', $item->user_id);
        if ($user) {
            $user_edit_link = get_edit_user_link($user->ID);
            return '<a href="' . esc_url($user_edit_link) . '">' . esc_html($user->display_name) . '</a>';
        }
        return __('Unknown User', 'memberfun-backend') . ' (ID: ' . $item->user_id . ')';
    }
    
    /**
     * Column admin_user
     * 
     * @param object $item
     * @return string
     */
    public function column_admin_user($item) {
        if (empty($item->admin_user_id)) {
            return '—';
        }
        
        $user = get_user_by('id', $item->admin_user_id);
        if ($user) {
            $user_edit_link = get_edit_user_link($user->ID);
            return '<a href="' . esc_url($user_edit_link) . '">' . esc_html($user->display_name) . '</a>';
        }
        return __('Unknown User', 'memberfun-backend') . ' (ID: ' . $item->admin_user_id . ')';
    }
    
    /**
     * Extra tablenav
     * 
     * @param string $which
     */
    public function extra_tablenav($which) {
        if ($which === 'top') {
            // Add user filter dropdown
            $users = get_users(array('fields' => array('ID', 'display_name')));
            if (!empty($users)) {
                $current_user = isset($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;
                ?>
                <div class="alignleft actions">
                    <label for="filter-by-user" class="screen-reader-text"><?php echo esc_html__('Filter by user', 'memberfun-backend'); ?></label>
                    <select name="user_id" id="filter-by-user">
                        <option value=""><?php echo esc_html__('All users', 'memberfun-backend'); ?></option>
                        <?php foreach ($users as $user) : ?>
                            <option value="<?php echo esc_attr($user->ID); ?>" <?php selected($current_user, $user->ID); ?>>
                                <?php echo esc_html($user->display_name); ?> (ID: <?php echo esc_html($user->ID); ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <?php submit_button(__('Filter', 'memberfun-backend'), 'button', 'filter_action', false); ?>
                </div>
                <?php
            }
        }
    }
}

// Add admin styles
add_action('admin_head', 'memberfun_points_admin_styles');

/**
 * Add admin styles
 */
function memberfun_points_admin_styles() {
    ?>
    <style type="text/css">
        .points-type {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
        }
        .points-add {
            background-color: #dff0d8;
            color: #3c763d;
        }
        .points-deduct {
            background-color: #f2dede;
            color: #a94442;
        }
        .column-points {
            width: 10%;
        }
        .column-type {
            width: 10%;
        }
        .column-created_at {
            width: 15%;
        }
    </style>
    <?php
} 