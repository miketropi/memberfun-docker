# MemberFun Backend - Developer Instructions

## Project Overview

This WordPress plugin provides custom REST API endpoints for a headless WordPress setup to be consumed by a React + Vite frontend application. The plugin serves as the backend for a membership-based application, handling authentication, user management, and other custom functionality.

## Dependencies

- **WordPress**: 5.6 or higher
- **PHP**: 7.4 or higher
- **JWT Authentication for WP-API**: This plugin is required for handling JWT-based authentication. [GitHub Repository](https://github.com/Tmeister/wp-api-jwt-auth)

## Project Structure

```
memberfun-backend/
├── memberfun-backend.php     # Main plugin file with initialization
├── inc/                      # Core functionality
│   ├── api.php               # REST API endpoints implementation
│   ├── social-auth.php       # Social authentication handlers
│   ├── post-types/           # Custom post type definitions
│   ├── taxonomies/           # Custom taxonomy definitions
│   └── admin/                # Admin panel customizations
└── assets/                   # Static assets (JS, CSS, images)
```

## Setup Instructions

1. **Install WordPress**: Set up a local WordPress installation.

2. **Install Required Plugins**:
   - Install and activate the "JWT Authentication for WP-API" plugin.
   - Configure JWT Authentication by adding the following to your `.htaccess` file:
     ```
     RewriteEngine on
     RewriteCond %{HTTP:Authorization} ^(.*)
     RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
     ```
   - Add the following to your `wp-config.php` file:
     ```php
     define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
     define('JWT_AUTH_CORS_ENABLE', true);
     ```

3. **Install This Plugin**:
   - Clone this repository to your `wp-content/plugins/` directory.
   - Activate the plugin through the WordPress admin panel.

4. **Configure CORS**:
   - For development, you may need to add CORS headers. Consider using the WP CORS plugin or adding custom headers in your server configuration.

## Development Guidelines

### Adding New API Endpoints

1. Create your endpoint in the appropriate file within the `inc/` directory.
2. Register your endpoint using the WordPress REST API:
   ```php
   add_action('rest_api_init', function () {
       register_rest_route('memberfun/v1', '/your-endpoint', array(
           'methods' => 'GET',
           'callback' => 'your_callback_function',
           'permission_callback' => 'your_permission_callback',
       ));
   });
   ```

### Authentication

- All protected endpoints should use the JWT authentication provided by the "JWT Authentication for WP-API" plugin.
- Verify authentication in your endpoint's permission callback:
  ```php
  function check_jwt_auth($request) {
      $user_id = get_current_user_id();
      return $user_id > 0;
  }
  ```

### Data Validation

- Always validate and sanitize input data.
- Use WordPress's sanitization functions (`sanitize_text_field`, etc.).
- Return appropriate error responses for invalid data.

### Error Handling

- Use `WP_Error` for returning error responses:
  ```php
  return new WP_Error(
      'error_code',
      __('Error message', 'memberfun-backend'),
      array('status' => 400)
  );
  ```

### Testing

- Test all endpoints with tools like Postman or Insomnia.
- Verify authentication works correctly.
- Test error handling and edge cases.

## Frontend Integration

The React + Vite frontend should:

1. Use the JWT authentication flow:
   - Call `/wp-json/jwt-auth/v1/token` with username/password to get a token.
   - Include the token in the Authorization header for subsequent requests.

2. Consume the custom endpoints provided by this plugin:
   - User registration: `/wp-json/wp/v2/users/register`
   - Other custom endpoints: `/wp-json/memberfun/v1/*`

## Deployment Considerations

1. **Security**:
   - Use HTTPS in production.
   - Generate a strong secret key for JWT authentication.
   - Consider rate limiting for authentication endpoints.

2. **Performance**:
   - Implement caching where appropriate.
   - Consider using a page caching plugin for WordPress.

3. **Environment Configuration**:
   - Use different JWT secret keys for development and production.
   - Configure CORS headers appropriately for your production environment.

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify CORS is properly configured in both WordPress and your server.
   - Check that `JWT_AUTH_CORS_ENABLE` is set to `true`.

2. **Authentication Failures**:
   - Verify the JWT token is being sent correctly in the Authorization header.
   - Check that the secret key is consistent.

3. **API Endpoint Not Found**:
   - Flush permalinks in WordPress admin (Settings > Permalinks > Save).
   - Verify the endpoint is registered correctly.

## Contributing

1. Create a feature branch from `main`.
2. Make your changes.
3. Test thoroughly.
4. Submit a pull request with a clear description of your changes.

## Resources

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JWT Authentication for WP-API Documentation](https://github.com/Tmeister/wp-api-jwt-auth)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
