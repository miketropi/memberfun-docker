# MemberFun - Web Application Member Manager

## Introduction

MemberFun is a web application for managing members, allowing users to register and login to access member-specific features and content. The application is built using a modern tech stack with React Vite for the frontend and WordPress as a headless API for the backend.

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS for styling and responsive design
- Zustand for state management
- Immer for immutable state updates
- Modern UI/UX design principles
- Responsive design for all devices

### Backend
- WordPress as a headless CMS/API
- RESTful API endpoints for authentication and data management
- Secure user management

## Requirements

**General: Header & Footer, font family**
  - Modern, clean design with Light/Dark mode toggle functionality
  - Fully responsive layout optimized for desktop, tablet, and mobile devices
  - Header components: logo, navigation menu, Light/Dark mode toggle, authentication buttons (login/register)
  - Footer with 3-column layout: company introduction, useful navigation links, newsletter subscription form
  - Social media links and icons in the footer
  - Primary font: "Space Mono" from Google Fonts
  - Consistent spacing and typography throughout the application
  - Accessible design following WCAG guidelines
  - Animation and micro-interactions for enhanced user experience
  - Support for multiple languages (i18n) with RTL layout compatibility

1. **Landing Page**
   - Attractive hero section with animated elements
   - Feature highlights with interactive cards
   - Call-to-action elements with hover effects
   - Testimonials section with carousel/slider
   - Newsletter signup with form validation
   - Performance metrics section with animated counters

2. **Register/Login Pages**
   - User registration form with real-time validation
   - Login form with authentication and remember me option
   - Password recovery functionality with email verification
   - Social login options (Google, GitHub) with OAuth 2.0 integration
   - Secure authentication flow with token-based authentication
   - Two-factor authentication support
   - Progressive form completion with visual indicators
   - Seamless user experience with minimal friction
   - Proper error handling and user feedback
   - Cross-device authentication persistence

3. **Contact Page**
   - Interactive contact form with input validation
   - Real-time map integration with location markers
   - Contact information with click-to-call/email functionality
   - FAQ section with expandable/collapsible answers
   - Live chat widget integration option
   - Office hours and availability indicators

4. **About Page**
   - Company/organization information with engaging visuals
   - Team members section with hover effects and social links
   - Mission and vision statements with supporting graphics
   - History timeline with interactive elements
   - Client/partner logos carousel
   - Downloadable company resources (brochures, annual reports)

5. **Member Dashboard**
   - Personalized welcome message and user profile
   - Activity summary with visual data representation
   - Membership status and benefits overview
   - Notification center with read/unread indicators
   - Document library with search and filter capabilities
   - Account settings with privacy controls

6. **Member Seminar System**
   - Custom post type for seminar events with comprehensive admin management interface
   - Detailed seminar information including title, date, time, host, location, capacity, and featured image
   - Document management system for seminar-related materials (presentations, handouts, etc.)
   - Automatic email notifications when new seminars are published or updated
   - Calendar integration with iCal export functionality for easy event scheduling
   - Comprehensive REST API endpoints for accessing seminar data:
     - `/seminars/upcoming` - Get upcoming seminars with pagination
     - `/seminars/by-host/{host_id}` - Get seminars by specific host
     - `/seminars/calendar` - Get calendar-formatted seminar data
     - `/seminars/{id}/ical` - Export individual seminar to iCal format
   - Frontend display components for upcoming and past seminars with filtering options
   - Seminar registration system with capacity management and waitlist functionality
   - Attendance tracking and reporting for seminar hosts and administrators
   - Integration with video conferencing platforms for virtual seminars
   - Responsive calendar view with FullCalendar integration
   - Detailed seminar pages with host information and document downloads
   - Seminar-specific commenting system:
     - Comments section for each seminar detail page
     - Ability for attendees to leave feedback and questions
     - Host responses and Q&A functionality
     - Comment moderation for seminar hosts
     - Email notifications for new comments
     - Comment analytics for seminar hosts
     - Rating system for seminar quality
     - Comment filtering by date and type
     - Export comments for seminar reports

7. **Comments System**
   - RESTful API endpoints for comment management:
     - `/comments` - Get comments with filtering options (post_id, page, per_page, orderby, order, search, status)
     - `/comments` (POST) - Create new comments
     - `/comments/{id}` (PUT) - Update existing comments
     - `/comments/{id}` (DELETE) - Delete comments
   - Comment moderation and approval system
   - Nested comments support with parent-child relationships
   - Real-time comment updates
   - Comment notifications for post authors
   - Comment analytics and reporting
   - Spam protection and content filtering

## Development Phases

1. **Planning & Design**
   - Wireframing and mockups for all pages including new Member Dashboard
   - API endpoint planning with authentication and data security considerations
   - Database schema design with user profile and activity tracking
   - Design system creation with component library
   - Accessibility and internationalization planning

2. **Frontend Development**
   - Component creation with storybook documentation
   - State management implementation with Zustand and Immer
   - API integration with error handling and loading states
   - Animation and interaction development
   - Responsive design implementation and testing
   - Internationalization setup with language switching

3. **Backend Configuration**
   - WordPress setup and configuration as headless CMS
   - Custom endpoint creation for member-specific functionality
   - Authentication system setup with JWT and 2FA support
   - Media handling and optimization
   - Performance optimization and caching strategies
   - Security hardening and penetration testing
   - Member Seminar custom post type implementation
   - Seminar notification system and email templates
   - Custom REST API endpoints for seminar data
   - Calendar integration and iCal export functionality

4. **Testing & Deployment**
   - Unit and integration testing with comprehensive coverage
   - Performance optimization and bundle size reduction
   - Cross-browser and device compatibility testing
   - Accessibility compliance verification
   - CI/CD pipeline setup for automated testing and deployment
   - Deployment to production environment with monitoring

5. **Post-Launch**
   - User feedback collection and analysis
   - Performance monitoring and optimization
   - Feature enhancement based on analytics
   - Regular security updates and maintenance
   - Documentation updates and knowledge base creation

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
   VITE_API_KEY=your_api_key_if_needed
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### WordPress Backend Setup
1. Install WordPress on your server
2. Install and activate the following plugins:
   - JWT Authentication for WP REST API
   - Advanced Custom Fields (ACF)
   - Custom Post Type UI
   - WP REST API Menus
   - MemberFun Social Authentication plugin

3. Configure CORS in your WordPress `.htaccess` file:
   ```
   <IfModule mod_rewrite.c>
   RewriteEngine On
   RewriteCond %{HTTP:Authorization} ^(.*)
   RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
   </IfModule>
   ```

4. Create necessary custom post types and fields for member management

### Social Authentication Setup

#### 1. Configure OAuth Providers

##### Google Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add your site's domain to the "Authorized JavaScript origins"
7. Add the callback URL to "Authorized redirect URIs": `https://your-site.com/wp-json/memberfun/v1/auth/google/callback`
8. Copy the Client ID and Client Secret

##### GitHub Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in your application details
4. Set the "Authorization callback URL" to: `https://your-site.com/wp-json/memberfun/v1/auth/github/callback`
5. Register the application
6. Copy the Client ID and Client Secret

#### 2. Configure WordPress Settings
1. In your WordPress admin, go to "Settings" > "Social Login"
2. Enter the Client ID and Client Secret for each provider
3. Save the settings

#### 3. Frontend Integration
The frontend will implement the following components for social authentication:

1. **Authentication Context**
   - Manages user authentication state
   - Handles token storage and retrieval
   - Provides authentication status to components
   - Manages user profile data

2. **Social Login Component**
   - Provides styled buttons for each social provider
   - Handles the OAuth flow initiation
   - Manages loading states and error handling
   - Provides visual feedback during authentication

3. **Protected Routes**
   - Restricts access to authenticated users only
   - Redirects unauthenticated users to login
   - Preserves attempted URL for post-login redirect

4. **User Dashboard**
   - Displays user profile information
   - Shows authentication method used
   - Provides account management options
   - Allows secure logout functionality

#### 4. Authentication Flow
1. User clicks a social login button on the frontend
2. Frontend requests the auth URL from the WordPress backend
3. User is redirected to the provider's authorization page
4. After authorization, the provider redirects back to the callback URL
5. Backend exchanges the authorization code for an access token
6. Backend retrieves user information from the provider
7. Backend creates or updates the WordPress user
8. Backend generates an authentication token (JWT)
9. User is redirected back to the frontend with the token
10. Frontend stores the token and fetches user data
11. User is authenticated and can access protected routes

#### 5. Security Considerations
- All communication uses HTTPS to protect authentication data
- OAuth client secrets are never exposed in frontend code
- Tokens have reasonable expiration times
- Input validation occurs on both frontend and backend
- CORS settings are properly configured for production
- Authentication state is properly managed across sessions

### Development Workflow
- Follow the coding standards outlined in CODING_STANDARDS.md
- Use feature branches for development
- Submit pull requests for code review
- Ensure all tests pass before merging

For more detailed information, refer to the QUICKSTART.md document.
