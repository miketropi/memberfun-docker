# Member Semina Custom Post Type

## Overview
The Member Semina custom post type is designed to manage and organize seminar events for members. This feature allows administrators to create, edit, and manage seminar posts with specific meta fields, and automatically notifies all users when a new seminar is scheduled.

## Features

### Custom Post Type Registration
- Registers a custom post type called "Member Semina"
- Includes a custom icon in the WordPress admin dashboard
- Supports title, editor, featured image, and custom meta fields
- Appears in the main navigation menu of the WordPress admin dashboard

### Meta Fields
The Member Semina post type includes the following custom meta fields:

1. **Date Time Start**
   - Field Type: DateTime
   - Description: The starting date and time of the seminar
   - Format: YYYY-MM-DD HH:MM
   - Validation: Must be a future date/time

2. **Host**
   - Field Type: User Selection
   - Description: The WordPress user who will host the seminar
   - Implementation: Dropdown selection of WordPress users
   - Data stored: WordPress User ID

3. **Document Files**
   - Field Type: File Upload
   - Description: Supporting documents for the seminar
   - Allowed file types: PDF, DOC, DOCX, PPT, PPTX
   - Multiple files allowed: Yes
   - Storage: WordPress Media Library

### Email Notification System
- Automatically sends email notifications to all registered users when a new Member Semina post is published
- Email includes:
  - Seminar title
  - Date and time
  - Host information
  - Brief description
  - Link to view the full seminar details
  - Links to attached documents

### Admin Features
- Custom columns in the admin list view showing seminar date, host, and document count
- Filtering options by date range and host
- Bulk actions for managing multiple seminars
- Custom permissions for creating and managing seminars

### User Features
- Frontend display of upcoming seminars
- Ability to filter seminars by date range and host
- Download links for seminar documents
- Calendar integration options

## REST API Integration

The Member Semina custom post type is fully integrated with the WordPress REST API, allowing developers to perform CRUD (Create, Read, Update, Delete) operations programmatically.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wp-json/wp/v2/member_semina` | GET | Retrieve a list of all seminars |
| `/wp-json/wp/v2/member_semina/<id>` | GET | Retrieve a specific seminar by ID |
| `/wp-json/wp/v2/member_semina` | POST | Create a new seminar |
| `/wp-json/wp/v2/member_semina/<id>` | PUT/PATCH | Update an existing seminar |
| `/wp-json/wp/v2/member_semina/<id>` | DELETE | Delete a seminar |

### Authentication

All write operations (POST, PUT, PATCH, DELETE) require authentication. The API supports the following authentication methods:

1. **Application Passwords** (Recommended)
2. **JWT Authentication** (with additional plugin)
3. **OAuth 1.0a**
4. **Cookie Authentication** (for same-origin requests)

### Custom Meta Fields in API

The custom meta fields are exposed in the REST API through the `meta` object in the response. To register these fields for the API, the following code is implemented:

```php
function register_member_semina_meta_fields() {
    register_post_meta('member_semina', '_semina_datetime_start', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
    
    register_post_meta('member_semina', '_semina_host_id', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
    
    register_post_meta('member_semina', '_semina_document_ids', [
        'show_in_rest' => true,
        'single' => false,
        'type' => 'integer',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
}
add_action('init', 'register_member_semina_meta_fields');
```

### Example API Requests

#### Retrieve All Seminars

```javascript
// JavaScript example using fetch API
fetch('https://your-site.com/wp-json/wp/v2/member_semina')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Retrieve a Specific Seminar

```javascript
fetch('https://your-site.com/wp-json/wp/v2/member_semina/123')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Create a New Seminar

```javascript
// First, get an authentication token or use application passwords

const seminarData = {
  title: 'New Seminar Title',
  content: 'Detailed description of the seminar...',
  status: 'publish',
  meta: {
    _semina_datetime_start: '2023-12-15 14:00:00',
    _semina_host_id: 5, // User ID of the host
    _semina_document_ids: [42, 43] // Media IDs of documents
  }
};

fetch('https://your-site.com/wp-json/wp/v2/member_semina', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('username:app_password')
  },
  body: JSON.stringify(seminarData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

#### Update an Existing Seminar

```javascript
const updateData = {
  title: 'Updated Seminar Title',
  meta: {
    _semina_datetime_start: '2023-12-16 15:00:00'
  }
};

fetch('https://your-site.com/wp-json/wp/v2/member_semina/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('username:app_password')
  },
  body: JSON.stringify(updateData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

#### Delete a Seminar

```javascript
fetch('https://your-site.com/wp-json/wp/v2/member_semina/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Basic ' + btoa('username:app_password')
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Custom API Endpoints

In addition to the standard WordPress REST API endpoints, the following custom endpoints are available for specific operations:

#### Get Upcoming Seminars

```
GET /wp-json/member-semina/v1/upcoming
```

Returns all seminars with a start date in the future, ordered by date.

#### Get Seminars by Host

```
GET /wp-json/member-semina/v1/by-host/{host_id}
```

Returns all seminars hosted by a specific user.

#### Implementation of Custom Endpoints

```php
function register_member_semina_custom_routes() {
    register_rest_route('member-semina/v1', '/upcoming', [
        'methods' => 'GET',
        'callback' => 'get_upcoming_seminars',
        'permission_callback' => '__return_true'
    ]);
    
    register_rest_route('member-semina/v1', '/by-host/(?P<host_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'get_seminars_by_host',
        'args' => [
            'host_id' => [
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ]
        ],
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'register_member_semina_custom_routes');

function get_upcoming_seminars() {
    $args = [
        'post_type' => 'member_semina',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_semina_datetime_start',
                'value' => current_time('mysql'),
                'compare' => '>',
                'type' => 'DATETIME'
            ]
        ],
        'orderby' => 'meta_value',
        'meta_key' => '_semina_datetime_start',
        'order' => 'ASC'
    ];
    
    $seminars = get_posts($args);
    return rest_ensure_response($seminars);
}

function get_seminars_by_host($request) {
    $host_id = $request['host_id'];
    
    $args = [
        'post_type' => 'member_semina',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_semina_host_id',
                'value' => $host_id,
                'compare' => '='
            ]
        ],
        'orderby' => 'meta_value',
        'meta_key' => '_semina_datetime_start',
        'order' => 'ASC'
    ];
    
    $seminars = get_posts($args);
    return rest_ensure_response($seminars);
}
```

### Error Handling

The API follows standard HTTP status codes for error responses:

- 400: Bad Request - The request was malformed
- 401: Unauthorized - Authentication is required
- 403: Forbidden - The user doesn't have permission
- 404: Not Found - The requested resource doesn't exist
- 500: Internal Server Error - Something went wrong on the server

Error responses include a JSON object with an error code and message:

```json
{
  "code": "rest_post_invalid_id",
  "message": "Invalid post ID.",
  "data": {
    "status": 404
  }
}
```

### Rate Limiting

To prevent abuse, the API implements rate limiting. By default, authenticated requests are limited to 50 requests per minute, while unauthenticated requests are limited to 25 requests per minute.

## Technical Implementation

### Post Type Registration
```php
function register_member_semina_post_type() {
    $labels = array(
        'name'               => 'Member Seminas',
        'singular_name'      => 'Member Semina',
        'menu_name'          => 'Member Seminas',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Member Semina',
        'edit_item'          => 'Edit Member Semina',
        'new_item'           => 'New Member Semina',
        'view_item'          => 'View Member Semina',
        'search_items'       => 'Search Member Seminas',
        'not_found'          => 'No Member Seminas found',
        'not_found_in_trash' => 'No Member Seminas found in Trash',
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'query_var'           => true,
        'rewrite'             => array('slug' => 'member-semina'),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-calendar-alt',
        'supports'            => array('title', 'editor', 'thumbnail'),
        'show_in_rest'        => true, // Enable REST API support
        'rest_base'           => 'member_semina',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('member_semina', $args);
}
add_action('init', 'register_member_semina_post_type');
```

### Meta Fields Registration
```php
function member_semina_meta_boxes() {
    add_meta_box(
        'member_semina_details',
        'Semina Details',
        'member_semina_details_callback',
        'member_semina',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'member_semina_meta_boxes');

function member_semina_details_callback($post) {
    wp_nonce_field(basename(__FILE__), 'member_semina_nonce');
    
    // Get saved values
    $datetime_start = get_post_meta($post->ID, '_semina_datetime_start', true);
    $host_id = get_post_meta($post->ID, '_semina_host_id', true);
    $document_ids = get_post_meta($post->ID, '_semina_document_ids', true);
    
    // Output form fields
    // ... (form field implementation)
}

function save_member_semina_meta($post_id) {
    // Save logic for meta fields
    // ... (save implementation)
}
add_action('save_post_member_semina', 'save_member_semina_meta');
```

### Email Notification System
```php
function send_semina_notification($post_id, $post, $update) {
    // Only proceed if this is a new publication, not an update
    if ($update || $post->post_status != 'publish' || $post->post_type != 'member_semina') {
        return;
    }
    
    // Get all users
    $users = get_users();
    
    // Get semina details
    $semina_title = get_the_title($post_id);
    $datetime_start = get_post_meta($post_id, '_semina_datetime_start', true);
    $host_id = get_post_meta($post_id, '_semina_host_id', true);
    $host = get_userdata($host_id);
    $host_name = $host ? $host->display_name : 'Unknown';
    $semina_url = get_permalink($post_id);
    
    // Email content
    $subject = 'New Seminar Announced: ' . $semina_title;
    
    // Send email to each user
    foreach ($users as $user) {
        $message = "Hello {$user->display_name},\n\n";
        $message .= "A new seminar has been scheduled:\n\n";
        $message .= "Title: {$semina_title}\n";
        $message .= "Date and Time: {$datetime_start}\n";
        $message .= "Host: {$host_name}\n\n";
        $message .= "For more details and to access the seminar documents, please visit:\n";
        $message .= "{$semina_url}\n\n";
        $message .= "Regards,\nThe Team";
        
        wp_mail($user->user_email, $subject, $message);
    }
}
add_action('wp_insert_post', 'send_semina_notification', 10, 3);
```

## Integration Points
- WordPress Media Library for document storage
- WordPress User system for host selection
- WordPress Email system for notifications
- WordPress REST API for programmatic access
- Optional: Calendar plugins for event display

## Future Enhancements
- RSVP functionality for members
- Attendance tracking
- Virtual meeting integration (Zoom, Teams, etc.)
- Feedback/rating system for completed seminars
- Automatic reminder emails before seminar date
- Enhanced API capabilities for mobile app integration
