# MemberFun Social Authentication

## How It Works

The MemberFun Social Authentication plugin provides a seamless way to integrate social login (Google and GitHub) into your WordPress site. This document explains how the system works and how to integrate it with a Vite/React frontend.

### Backend Architecture

The plugin implements OAuth 2.0 authentication flow with the following components:

1. **Provider Configuration**: The plugin supports Google and GitHub authentication out of the box. Each provider has its own set of credentials and endpoints.

2. **REST API Endpoints**: The plugin registers two REST API endpoints for each provider:
   - `/wp-json/memberfun/v1/auth/{provider}` - Initiates the authentication process
   - `/wp-json/memberfun/v1/auth/{provider}/callback` - Handles the OAuth callback

3. **Authentication Flow**:
   - User clicks a social login button
   - Frontend requests the auth URL from the WordPress backend
   - User is redirected to the provider's authorization page
   - After authorization, the provider redirects back to the callback URL
   - Backend exchanges the authorization code for an access token
   - Backend retrieves user information from the provider
   - Backend creates or updates the WordPress user
   - Backend generates an authentication token
   - User is redirected back to the frontend with the token

4. **Token Authentication**: The plugin supports two authentication methods:
   - JWT Authentication (if the JWT Auth plugin is installed)
   - Simple token-based authentication (fallback)

5. **User Management**: The plugin automatically creates or updates WordPress users based on the social profile data.

## Setting Up the Backend

### 1. Configure OAuth Providers

#### Google Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add your site's domain to the "Authorized JavaScript origins"
7. Add the callback URL to "Authorized redirect URIs": `https://your-site.com/wp-json/memberfun/v1/auth/google/callback`
8. Copy the Client ID and Client Secret

#### GitHub Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in your application details
4. Set the "Authorization callback URL" to: `https://your-site.com/wp-json/memberfun/v1/auth/github/callback`
5. Register the application
6. Copy the Client ID and Client Secret

### 2. Configure WordPress Settings

1. In your WordPress admin, go to "Settings" > "Social Login"
2. Enter the Client ID and Client Secret for each provider
3. Save the settings

## Integrating with Vite/React Frontend

### 1. Project Setup

First, set up a Vite React project if you don't have one:

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
```

### 2. Install Required Dependencies

```bash
npm install axios react-router-dom
```

### 3. Create Authentication Context

Create an authentication context to manage the user's authentication state:

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// WordPress site URL
const WP_URL = 'https://your-site.com';

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('auth_token');
  });

  // Check for token in URL (after social login redirect)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const authToken = queryParams.get('auth_token');
    
    if (authToken) {
      // Store token and remove from URL
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch user data from WordPress
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${WP_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      // Clear invalid token
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    logout,
    fetchUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
```

### 4. Create Social Login Component

Create a component for the social login buttons:

```jsx
// src/components/SocialLogin.jsx
import { useState } from 'react';
import axios from 'axios';
import './SocialLogin.css';

// WordPress site URL
const WP_URL = 'https://your-site.com';

export default function SocialLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth URL from WordPress
      const response = await axios.get(`${WP_URL}/wp-json/memberfun/v1/auth/${provider}`);
      
      // Redirect to provider's auth page
      window.location.href = response.data.auth_url;
    } catch (err) {
      console.error(`Error initiating ${provider} login:`, err);
      setError(`Failed to connect to ${provider}. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="social-login-container">
      {error && <div className="social-login-error">{error}</div>}
      
      <button 
        className="social-login-button google"
        onClick={() => handleSocialLogin('google')}
        disabled={loading}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        Sign in with Google
      </button>
      
      <button 
        className="social-login-button github"
        onClick={() => handleSocialLogin('github')}
        disabled={loading}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
        Sign in with GitHub
      </button>
    </div>
  );
}
```

### 5. Add CSS for Social Login Buttons

```css
/* src/components/SocialLogin.css */
.social-login-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
  margin: 0 auto;
}

.social-login-error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.social-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  border: none;
}

.social-login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.social-login-button svg {
  width: 24px;
  height: 24px;
}

.social-login-button.google {
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
}

.social-login-button.google:hover:not(:disabled) {
  background-color: #f8f9fa;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3);
}

.social-login-button.github {
  background-color: #24292e;
  color: white;
}

.social-login-button.github:hover:not(:disabled) {
  background-color: #2c3136;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
```

### 6. Create Protected Route Component

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

### 7. Create Login Page

```jsx
// src/pages/Login.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SocialLogin from '../components/SocialLogin';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  return (
    <div className="login-page">
      <h1>Sign in to your account</h1>
      <p>Choose a social provider to sign in:</p>
      <SocialLogin />
    </div>
  );
}
```

### 8. Create Dashboard Page

```jsx
// src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {user && (
        <div className="user-profile">
          <img 
            src={user.avatar_urls?.['96'] || 'default-avatar.png'} 
            alt={`${user.name}'s avatar`} 
            className="user-avatar"
          />
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.roles?.join(', ')}</p>
        </div>
      )}
      
      <button onClick={logout} className="logout-button">
        Sign Out
      </button>
    </div>
  );
}
```

### 9. Set Up App Routes

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### 10. Making Authenticated API Requests

Once a user is authenticated, you can make authenticated requests to the WordPress REST API:

```jsx
// Example API service
import axios from 'axios';

const WP_URL = 'https://your-site.com';

// Create API instance with authentication
export const createAuthenticatedApi = (token) => {
  const api = axios.create({
    baseURL: `${WP_URL}/wp-json/`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Add response interceptor for handling errors
  api.interceptors.response.use(
    response => response,
    error => {
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return api;
};

// Example usage in a component
import { useAuth } from '../context/AuthContext';
import { createAuthenticatedApi } from '../services/api';
import { useState, useEffect } from 'react';

function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (token) {
      const api = createAuthenticatedApi(token);
      
      const fetchPosts = async () => {
        try {
          const response = await api.get('wp/v2/posts');
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPosts();
    }
  }, [token]);
  
  if (loading) return <div>Loading posts...</div>;
  
  return (
    <div>
      <h2>Your Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Customizing the Authentication Flow

### Custom Redirect URL

By default, the plugin redirects to your site's home page with the token as a query parameter. If you want to customize the redirect URL, you can modify the `handle_callback` method in the `MemberFun_Social_Auth` class:

```php
// Example modification to redirect to a specific page in your React app
$redirect_url = home_url('/app/auth-callback?auth_token=' . $token);
```

### Handling CORS Issues

If your React app is hosted on a different domain than your WordPress site, you'll need to enable CORS in WordPress:

```php
// Add to your theme's functions.php or a custom plugin
add_action('init', function() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Authorization, Content-Type");
  
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    status_header(200);
    exit();
  }
});
```

## Troubleshooting

### Common Issues

1. **Authentication Token Not Being Saved**
   - Ensure your React app is on the same domain as your WordPress site, or configure CORS properly.
   - Check that localStorage is available and not blocked by privacy settings.

2. **Callback URL Errors**
   - Double-check that the callback URLs in your OAuth provider settings exactly match the URLs in your WordPress site.
   - Ensure your site is using HTTPS if required by the provider.

3. **"Invalid State Parameter" Error**
   - This usually happens when the OAuth state parameter doesn't match. This could be due to session issues or multiple authentication attempts.
   - Try clearing your browser cookies and cache.

4. **User Not Being Created**
   - Ensure the email is being properly retrieved from the provider.
   - Check WordPress logs for any errors during user creation.

5. **JWT Authentication Issues**
   - If using the JWT Authentication plugin, ensure it's properly configured.
   - Check that the JWT secret key is set correctly.

## Security Best Practices

1. **Always Use HTTPS**
   - Both your WordPress site and React app should use HTTPS to protect authentication data.

2. **Protect OAuth Credentials**
   - Keep your OAuth client secrets secure and never expose them in frontend code.

3. **Implement Token Expiration**
   - Set reasonable expiration times for authentication tokens.
   - Implement token refresh functionality for long-lived sessions.

4. **Validate User Input**
   - Always validate and sanitize user input on both frontend and backend.

5. **Use Proper CORS Settings**
   - Don't use wildcard CORS headers in production. Specify exact domains.

## Conclusion

The MemberFun Social Authentication plugin provides a robust solution for integrating social login into your WordPress + React application. By following this guide, you can offer your users a seamless authentication experience while maintaining the security and flexibility of WordPress as your backend.

For further customization or troubleshooting, refer to the plugin source code or reach out to the plugin developer.
