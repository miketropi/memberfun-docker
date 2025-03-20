# MemberFun WordPress Plugin

A powerful WordPress plugin that enhances membership functionality with a Points System and Member Seminar management.

## Features

### Points System
A comprehensive system for managing user points within your WordPress site:

- **Points Management**: Add, deduct, and track points for users
- **Transaction History**: Complete log of all point transactions
- **Admin Interface**: User-friendly interface for managing points
- **REST API**: Endpoints for integrating points functionality with other systems

### Member Semina
A custom post type for managing and organizing seminars for members:

- **Seminar Management**: Create and manage seminar events with detailed information
- **Document Management**: Upload and organize documents for each seminar
- **Email Notifications**: Automatic notifications to members when new seminars are scheduled
- **Calendar Integration**: Export seminar events to calendar applications
- **REST API**: Access seminar data programmatically

## Installation

1. Download the plugin zip file
2. Go to WordPress Admin > Plugins > Add New
3. Click "Upload Plugin" and select the downloaded zip file
4. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

### Points System

#### Admin Interface
1. Navigate to MemberFun > Points in the WordPress admin menu
2. Use the tabbed interface to:
   - View transaction history
   - Add points to users
   - Deduct points from users
   - Perform bulk actions

#### API Endpoints
The following REST API endpoints are available:

- `GET /wp-json/memberfun/v1/points/user/{user_id}` - Get user's total points
- `POST /wp-json/memberfun/v1/points/add` - Add points to a user
- `POST /wp-json/memberfun/v1/points/deduct` - Deduct points from a user
- `GET /wp-json/memberfun/v1/points/history/{user_id}` - Get user's transaction history

### Member Semina

#### Creating Seminars
1. Navigate to Member Semina > Add New in the WordPress admin menu
2. Fill in the seminar details:
   - Title and description
   - Date and time
   - Host (select from WordPress users)
   - Upload related documents
3. Publish the seminar to automatically notify members

#### API Endpoints
The following REST API endpoints are available:

- Standard WordPress REST API endpoints for the custom post type
- `GET /wp-json/memberfun/v1/seminars/upcoming` - Get upcoming seminars
- `GET /wp-json/memberfun/v1/seminars/host/{host_id}` - Get seminars by host
- `GET /wp-json/memberfun/v1/seminars/calendar` - Get calendar data
- `GET /wp-json/memberfun/v1/seminars/ical` - Export seminars as iCal

## Development Status

### Points System
- ✅ Database schema designed and implemented
- ✅ Core points management functions implemented
- ✅ Admin interface created with transaction list, add/deduct forms
- ✅ REST API endpoints implemented
- ✅ Security measures implemented (permissions, validation, sanitization)
- 🔄 Testing in progress

### Member Semina
- ✅ Custom post type registered with proper capabilities
- ✅ Meta fields for seminar details implemented
- ✅ Document management system for seminar materials
- ✅ Enhanced admin interface with custom columns, filters, and quick edit
- ✅ Email notification system for new seminars
- ✅ REST API endpoints for accessing seminar data
- ✅ Calendar integration with iCal export
- ⏩ Frontend features skipped as per client request
- 🔄 Testing pending

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher

## License

This plugin is licensed under the GPL v2 or later.

## Support

For support, please contact the plugin developer.

## Credits

Developed by Mike.

---

Last Updated: Mar 16, 2025
