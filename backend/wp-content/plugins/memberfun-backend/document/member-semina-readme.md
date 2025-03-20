# Member Semina Custom Post Type

## Overview

The Member Semina Custom Post Type is a feature of the MemberFun WordPress plugin that allows administrators to create, manage, and organize seminar events for members. This feature includes automatic email notifications when new seminars are scheduled, document management, and calendar integration.

## Features

- **Custom Post Type**: Dedicated post type for seminar events with custom capabilities
- **Meta Fields**: Custom fields for date, time, host, location, and capacity
- **Document Management**: Upload and manage documents related to seminars
- **Email Notifications**: Automatic email notifications to members when new seminars are published
- **Admin Interface**: Enhanced admin interface with custom columns, filters, and quick edit
- **REST API**: Custom endpoints for accessing seminar data
- **Calendar Integration**: iCal export for calendar integration

## Usage

### Creating a New Seminar

1. In the WordPress admin, navigate to "Member Seminars" > "Add New"
2. Enter a title and description for the seminar
3. Fill in the seminar details:
   - Date and time
   - Host (select from WordPress users)
   - Location
   - Capacity (leave empty for unlimited)
4. Add documents if needed using the "Add Document" button
5. Publish the seminar (this will trigger email notifications if enabled)

### Managing Seminars

- **List View**: View all seminars with sortable columns for date, host, and capacity
- **Filtering**: Filter seminars by host or date range
- **Quick Edit**: Quickly edit seminar details without opening the full editor
- **Bulk Actions**: Send notifications to multiple seminars at once

### Notification Settings

1. Navigate to "Member Seminars" > "Notification Settings"
2. Configure notification options:
   - Enable/disable automatic notifications
   - Select which user roles should receive notifications
   - Customize email subject and template
3. Use the "Send Test Notification" button to test your configuration

## REST API Endpoints

The following REST API endpoints are available for the Member Semina feature:

### Upcoming Seminars

```
GET /wp-json/memberfun/v1/seminars/upcoming
```

Parameters:
- `limit` (optional): Number of seminars to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

### Seminars by Host

```
GET /wp-json/memberfun/v1/seminars/by-host/{host_id}
```

Parameters:
- `host_id` (required): WordPress user ID of the host
- `limit` (optional): Number of seminars to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

### Calendar Data

```
GET /wp-json/memberfun/v1/seminars/calendar
```

Parameters:
- `start_date` (optional): Start date for calendar range (default: first day of current month)
- `end_date` (optional): End date for calendar range (default: last day of current month)

### iCal Export

```
GET /wp-json/memberfun/v1/seminars/{id}/ical
```

Parameters:
- `id` (required): Seminar post ID

## Shortcodes

A placeholder shortcode is available for future frontend implementation:

```
[memberfun_upcoming_seminars]
```

## Developer Notes

### Custom Capabilities

The following custom capabilities are added to the administrator role:

- `edit_memberfun_semina`
- `read_memberfun_semina`
- `delete_memberfun_semina`
- `edit_memberfun_seminas`
- `edit_others_memberfun_seminas`
- `publish_memberfun_seminas`
- `read_private_memberfun_seminas`
- `delete_memberfun_seminas`
- `delete_private_memberfun_seminas`
- `delete_published_memberfun_seminas`
- `delete_others_memberfun_seminas`
- `edit_private_memberfun_seminas`
- `edit_published_memberfun_seminas`

### Meta Fields

The following meta fields are registered for the Member Semina post type:

- `_memberfun_semina_date`: Seminar date (YYYY-MM-DD format)
- `_memberfun_semina_time`: Seminar time (HH:MM format)
- `_memberfun_semina_host`: Seminar host (WordPress user ID)
- `_memberfun_semina_location`: Seminar location (text)
- `_memberfun_semina_capacity`: Seminar capacity (integer)
- `_memberfun_semina_documents`: Seminar documents (array of document objects)

### Hooks and Filters

The following hooks and filters are available for extending the Member Semina functionality:

- `memberfun_semina_notification_enabled`: Filter to enable/disable notifications
- `memberfun_semina_notification_roles`: Filter to modify which roles receive notifications
- `memberfun_semina_notification_subject`: Filter to modify the notification email subject
- `memberfun_semina_notification_template`: Filter to modify the notification email template

## Troubleshooting

### Email Notifications Not Sending

1. Check if notifications are enabled in the settings
2. Verify that there are users with the selected roles
3. Check your WordPress email configuration
4. Use the "Send Test Notification" button to test your setup

### Documents Not Uploading

1. Ensure the document file type is supported (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)
2. Check if the WordPress media library is working properly
3. Verify that the file size is within WordPress upload limits

## Future Enhancements

- Frontend display of seminars
- Registration system for seminars
- Attendance tracking
- Integration with video conferencing platforms 