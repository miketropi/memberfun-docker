# MemberFun - Web Application Member Manager

## Introduction

MemberFun is a web application for managing members, allowing users to register and login to access member-specific features and content. The application is built using a modern tech stack with React Vite for the frontend and WordPress as a headless API for the backend.

![MemberFun Screenshot](https://via.placeholder.com/800x400?text=MemberFun+Screenshot)

## Features

- **Modern UI/UX Design**: Clean, responsive design with Light/Dark mode toggle
- **User Authentication**: Secure login and registration system
- **Member Dashboard**: Personalized dashboard with membership details and activity tracking
- **Document Library**: Access to member-specific documents with search functionality
- **Notification Center**: Real-time notifications with read/unread indicators
- **Account Settings**: User profile management and notification preferences

## Tech Stack

### Frontend
- **React 19** with Vite for fast development and optimized builds
- **TailwindCSS** for utility-first styling and responsive design
- **Zustand** for lightweight state management
- **Immer** for immutable state updates
- **React Router v7** for client-side routing

### Backend
- **WordPress** as a headless CMS/API
- **RESTful API** endpoints for authentication and data management
- **Secure user management**

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- WordPress installation (for backend)

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/memberfun.git
   cd memberfun
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=your_wordpress_api_url
   VITE_APP_NAME=MemberFun
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### WordPress Backend Setup

#### Basic WordPress Setup
1. Install WordPress on your server
2. Configure WordPress to use pretty permalinks (Settings > Permalinks > Post name)

#### Required Plugins
Install and activate the following plugins:

1. **JWT Authentication for WP REST API**
   - Download from: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   - This plugin provides JWT authentication for the WordPress REST API

2. **Advanced Custom Fields (ACF)**
   - For creating custom fields for user profiles and membership data

3. **Custom Post Type UI**
   - For creating custom post types for membership content

4. **WP REST API Menus**
   - For exposing menu data through the REST API

#### JWT Authentication Configuration

1. Update your WordPress `.htaccess` file to enable JWT authentication:

   ```apache
   <IfModule mod_rewrite.c>
   RewriteEngine On
   RewriteCond %{HTTP:Authorization} ^(.*)
   RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
   </IfModule>
   ```

2. Add the following to your `wp-config.php` file:

   ```php
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

   Replace `'your-secret-key'` with a strong, unique key. You can generate one at https://api.wordpress.org/secret-key/1.1/salt/

3. Configure CORS in your WordPress by adding the following to your theme's `functions.php` file:

   ```php
   add_action('init', function() {
     header("Access-Control-Allow-Origin: *");
     header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
     header("Access-Control-Allow-Credentials: true");
     header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
     if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
       status_header(200);
       exit();
     }
   });
   ```

#### User Registration

WordPress REST API doesn't include a registration endpoint by default. You'll need to create a custom endpoint or use a plugin like "WP User Manager" or "WP REST User".

Here's a simple example of creating a custom registration endpoint in your theme's `functions.php`:

```php
add_action('rest_api_init', function() {
  register_rest_route('wp/v2', '/users/register', [
    'methods' => 'POST',
    'callback' => 'custom_register_user',
    'permission_callback' => function() {
      return true;
    }
  ]);
});

function custom_register_user($request) {
  $username = $request->get_param('username');
  $email = $request->get_param('email');
  $password = $request->get_param('password');
  $first_name = $request->get_param('first_name');
  $last_name = $request->get_param('last_name');
  
  if (empty($username) || empty($email) || empty($password)) {
    return new WP_Error('missing_fields', 'Please provide all required fields', ['status' => 400]);
  }
  
  $user_id = wp_create_user($username, $password, $email);
  
  if (is_wp_error($user_id)) {
    return $user_id;
  }
  
  // Update user meta
  wp_update_user([
    'ID' => $user_id,
    'first_name' => $first_name,
    'last_name' => $last_name,
    'display_name' => $first_name . ' ' . $last_name,
  ]);
  
  return [
    'success' => true,
    'user_id' => $user_id,
    'message' => 'User registered successfully'
  ];
}
```

## Testing the Authentication

1. **Login Endpoint**: 
   - URL: `{your-wordpress-url}/wp-json/jwt-auth/v1/token`
   - Method: POST
   - Body: `{ "username": "your_username", "password": "your_password" }`
   - Response: `{ "token": "your-jwt-token", "user_email": "user@example.com", "user_nicename": "username", "user_display_name": "User Name" }`

2. **Validate Token Endpoint**:
   - URL: `{your-wordpress-url}/wp-json/jwt-auth/v1/token/validate`
   - Method: POST
   - Headers: `Authorization: Bearer your-jwt-token`
   - Response: `{ "code": "jwt_auth_valid_token", "data": { "status": 200 } }`

3. **Get Current User**:
   - URL: `{your-wordpress-url}/wp-json/wp/v2/users/me`
   - Method: GET
   - Headers: `Authorization: Bearer your-jwt-token`
   - Response: User data object

## Development Workflow

1. Create feature branches from `main` for new features or bug fixes
2. Submit pull requests for code review
3. Merge to `main` after approval
4. Deploy to staging/production environments

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
