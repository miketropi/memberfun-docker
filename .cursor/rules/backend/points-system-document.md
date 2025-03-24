# MemberFun Points System Feature Documentation

## Overview
The Points System is a feature that allows administrators to manage and track points for users within the WordPress application. This system will use a custom database table to store point transactions and provide a comprehensive admin interface for managing these points.

## Requirements

### Database Structure
- **Custom Table**: `[wpdb_prefix]_memberfun_points`
  - This table will be created separately from WordPress core tables
  - Will be managed through the plugin's installation/activation process

### Table Fields
- `id` (INT) - Primary Key, Auto Increment
- `point_number` (INT) - The number of points awarded/deducted
- `user_id` (INT) - Foreign key to WordPress User ID
- `note` (TEXT) - Description or reason for the point transaction
- `create_date` (DATETIME) - Timestamp when the points were added/deducted

### Admin Interface
- Create a dedicated admin page in the WordPress dashboard
- Features:
  - View all point transactions
  - Add new point transactions
  - Edit existing point transactions
  - Delete point transactions
  - Search functionality by note content
  - Filter by user (dropdown of WordPress users)
  - Pagination for large datasets
  - Sorting by columns (date, points, user)
  - Bulk actions (delete, update)

### User Integration
- Connect point transactions to WordPress users via user_id
- Display user information (username, email) alongside point transactions
- Calculate and display total points per user

### API Endpoints
- Create REST API endpoints for:
  - Getting user points
  - Adding points to a user
  - Deducting points from a user
  - Getting point transaction history

### Security
- Implement proper capability checks for admin actions
- Sanitize and validate all input data
- Use nonces for form submissions
- Implement rate limiting for API endpoints

## Implementation Guidelines

### Database Setup
```php
function create_points_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'memberfun_points';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        point_number int NOT NULL,
        user_id bigint(20) NOT NULL,
        note text NOT NULL,
        create_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id),
        KEY user_id (user_id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
```

### Admin Interface
- Create a new admin page under the MemberFun menu
- Implement WP_List_Table for displaying point transactions
- Add search, filter, and pagination functionality
- Create forms for adding/editing point transactions

### API Implementation
- Register REST API routes for point management
- Implement CRUD operations for points
- Add authentication and permission checks

## Testing Checklist
- [ ] Database table creation works correctly
- [ ] Admin can add points to users
- [ ] Admin can deduct points from users
- [ ] Search functionality works as expected
- [ ] Filtering by user works correctly
- [ ] Pagination functions properly
- [ ] API endpoints return correct data
- [ ] Security measures prevent unauthorized access

## Future Enhancements
- Point expiration system
- Point redemption for rewards
- Automatic point awards for specific actions
- User-facing dashboard for viewing points
- Email notifications for point changes
- Import/export functionality for point data

## Timeline
- Database setup: 1 day
- Admin interface: 3 days
- API implementation: 2 days
- Testing and refinement: 2 days
- Documentation: 1 day

Total estimated development time: 9 days
