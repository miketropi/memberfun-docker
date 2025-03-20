# WordPress Comments REST API Documentation

This documentation provides information about the WordPress Comments REST API endpoints and authentication.

## REST API Endpoints

### Base Endpoint
```
/wp-json/wp/v2/comments
```

### Available Endpoints

- `GET /wp-json/wp/v2/comments` - Retrieve all comments
- `GET /wp-json/wp/v2/comments/<id>` - Retrieve a specific comment
- `POST /wp-json/wp/v2/comments` - Create a comment
- `PUT /wp-json/wp/v2/comments/<id>` - Update a comment
- `DELETE /wp-json/wp/v2/comments/<id>` - Delete a comment

## Authentication

To perform write operations (POST, PUT, DELETE), you'll need to authenticate your requests using JWT Authentication for WP-API plugin.

### JWT Authentication Setup

1. Install and activate the "JWT Authentication for WP-API" plugin
2. Add these constants to your `wp-config.php`:
```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);
```

3. Add this filter to your theme's `functions.php`:
```php
add_filter('jwt_auth_token_before_dispatch', function($data, $user) {
    $data['user_id'] = $user->ID;
    return $data;
}, 10, 2);
```

### Getting JWT Token

To get a JWT token, make a POST request to:
```
/wp-json/jwt-auth/v1/token
```

With body:
```json
{
    "username": "your-username",
    "password": "your-password"
}
```

The response will contain your JWT token:
```json
{
    "token": "your.jwt.token",
    "user_id": 1,
    "user_email": "user@example.com",
    "user_nicename": "username"
}
```

## API Usage Examples

### Get All Comments
```bash
curl -X GET "YOUR_WORDPRESS_SITE/wp-json/wp/v2/comments"
```

### Get Comments for a Specific Post
```bash
curl -X GET "YOUR_WORDPRESS_SITE/wp-json/wp/v2/comments?post=123"
```

### Create a Comment
```bash
curl -X POST "YOUR_WORDPRESS_SITE/wp-json/wp/v2/comments" \
  -H "Authorization: Bearer your.jwt.token" \
  -H "Content-Type: application/json" \
  -d '{
    "post": 123,
    "content": "Your comment content",
    "author_name": "John Doe",
    "author_email": "john@example.com"
  }'
```

### Update a Comment
```bash
curl -X PUT "YOUR_WORDPRESS_SITE/wp-json/wp/v2/comments/456" \
  -H "Authorization: Bearer your.jwt.token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment content"
  }'
```

### Delete a Comment
```bash
curl -X DELETE "YOUR_WORDPRESS_SITE/wp-json/wp/v2/comments/456" \
  -H "Authorization: Bearer your.jwt.token"
```

## Response Format

### Comment Object Structure
```json
{
    "id": 456,
    "post": 123,
    "parent": 0,
    "author": 1,
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "author_url": "https://example.com",
    "date": "2024-03-20T10:00:00",
    "date_gmt": "2024-03-20T10:00:00",
    "content": {
        "rendered": "<p>Comment content</p>"
    },
    "link": "https://example.com/post#comment-456",
    "status": "approved",
    "type": "comment"
}
```

## WordPress Configuration

### Enable CORS
Add this to your WordPress theme's `functions.php`:

```php
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
});
```

### Enable REST API
Ensure the REST API is enabled in WordPress:

1. Check if REST API is enabled in Settings → Permalinks
2. Make sure pretty permalinks are enabled
3. Verify no security plugins are blocking REST API access

## Troubleshooting

1. **Authentication Issues**
   - Verify JWT token is valid and not expired
   - Check if user has proper permissions
   - Ensure HTTPS is used for authentication
   - Verify JWT secret key is properly set in wp-config.php

2. **CORS Issues**
   - Verify CORS headers are properly set
   - Check browser console for CORS errors
   - Confirm WordPress configuration

3. **API Access Issues**
   - Check WordPress permalink settings
   - Verify REST API is not disabled
   - Review server logs for errors
