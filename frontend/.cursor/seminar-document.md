# MemberFun Semina API Documentation

This document provides information about the REST API endpoints available for the MemberFun Semina post type. These endpoints can be used by frontend developers to interact with seminar data.

## Base URL

All API endpoints are prefixed with:

```
/wp-json/memberfun/v1
```

## Available Endpoints

### 1. Get Upcoming Seminars

Retrieves a list of upcoming seminars ordered by date.

**Endpoint:** `/seminars/upcoming`

**Method:** `GET`

**Parameters:**
- `limit` (optional): Number of seminars to return. Default: 10
- `offset` (optional): Number of seminars to skip. Default: 0

**Response:**
```json
{
  "seminars": [
    {
      "id": 123,
      "title": "Seminar Title",
      "content": "Full HTML content of the seminar",
      "excerpt": "Short excerpt of the seminar content",
      "date": "2023-05-15",
      "time": "14:30",
      "formatted_date": "May 15, 2023",
      "formatted_time": "2:30 pm",
      "location": "Conference Room A",
      "capacity": "50",
      "host": {
        "id": 5,
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "documents": [
        {
          "id": 456,
          "title": "Presentation Slides",
          "url": "https://example.com/slides.pdf",
          "filename": "slides.pdf"
        }
      ],
      "permalink": "https://example.com/seminars/seminar-title",
      "ical_url": "https://example.com/wp-json/memberfun/v1/seminars/123/ical",
      "featured_image": "https://example.com/featured-image.jpg"
    }
  ],
  "total": 25,
  "pages": 3,
  "page": 1
}
```

### 2. Get Seminars by Host

Retrieves seminars hosted by a specific user.

**Endpoint:** `/seminars/by-host/{host_id}`

**Method:** `GET`

**URL Parameters:**
- `host_id` (required): The ID of the host user

**Query Parameters:**
- `limit` (optional): Number of seminars to return. Default: 10
- `offset` (optional): Number of seminars to skip. Default: 0

**Response:**
```json
{
  "host": {
    "id": 5,
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "seminars": [
    {
      "id": 123,
      "title": "Seminar Title",
      "content": "Full HTML content of the seminar",
      "excerpt": "Short excerpt of the seminar content",
      "date": "2023-05-15",
      "time": "14:30",
      "formatted_date": "May 15, 2023",
      "formatted_time": "2:30 pm",
      "location": "Conference Room A",
      "capacity": "50",
      "host": {
        "id": 5,
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "documents": [
        {
          "id": 456,
          "title": "Presentation Slides",
          "url": "https://example.com/slides.pdf",
          "filename": "slides.pdf"
        }
      ],
      "permalink": "https://example.com/seminars/seminar-title",
      "ical_url": "https://example.com/wp-json/memberfun/v1/seminars/123/ical",
      "featured_image": "https://example.com/featured-image.jpg"
    }
  ],
  "total": 15,
  "pages": 2,
  "page": 1
}
```

### 3. Get Calendar Data

Retrieves seminar data formatted for calendar display within a specified date range.

**Endpoint:** `/seminars/calendar`

**Method:** `GET`

**Parameters:**
- `start_date` (optional): Start date in YYYY-MM-DD format. Default: First day of current month
- `end_date` (optional): End date in YYYY-MM-DD format. Default: Last day of current month

**Response:**
```json
[
  {
    "id": 123,
    "title": "Seminar Title",
    "start": "2023-05-15T14:30:00",
    "url": "https://example.com/seminars/seminar-title",
    "extendedProps": {
      "location": "Conference Room A",
      "host": "John Doe",
      "host_id": 5
    }
  }
]
```

### 4. Export Seminar to iCal

Generates and downloads an iCal file for a specific seminar.

**Endpoint:** `/seminars/{id}/ical`

**Method:** `GET`

**URL Parameters:**
- `id` (required): The ID of the seminar

**Response:**
- Content-Type: text/calendar
- Content-Disposition: attachment; filename="seminar-{id}.ics"
- iCal formatted data

## Seminar Object Structure

The seminar object returned by the API contains the following properties:

| Property | Type | Description |
|----------|------|-------------|
| id | integer | The seminar post ID |
| title | string | The title of the seminar |
| content | string | The full HTML content of the seminar |
| excerpt | string | A short excerpt of the seminar content |
| date | string | The date of the seminar in YYYY-MM-DD format |
| time | string | The time of the seminar in HH:MM format |
| formatted_date | string | The date formatted according to site settings |
| formatted_time | string | The time formatted according to site settings |
| location | string | The location of the seminar |
| capacity | string | The maximum capacity of the seminar |
| host | object | Information about the seminar host |
| host.id | integer | The ID of the host user |
| host.name | string | The display name of the host |
| host.avatar | string | URL to the host's avatar image |
| documents | array | Array of documents attached to the seminar |
| documents[].id | integer | The ID of the document |
| documents[].title | string | The title of the document |
| documents[].url | string | URL to the document file |
| documents[].filename | string | The filename of the document |
| permalink | string | The permalink URL to the seminar |
| ical_url | string | URL to download the seminar as iCal |
| featured_image | string | URL to the featured image of the seminar |

## Usage Examples

### Fetch Upcoming Seminars

```javascript
fetch('/wp-json/memberfun/v1/seminars/upcoming?limit=5')
  .then(response => response.json())
  .then(data => {
    console.log(data.seminars);
    // Process and display seminars
  })
  .catch(error => console.error('Error fetching seminars:', error));
```

### Display Seminars by Host

```javascript
const hostId = 5;
fetch(`/wp-json/memberfun/v1/seminars/by-host/${hostId}?limit=10&offset=0`)
  .then(response => response.json())
  .then(data => {
    console.log(data.host);
    console.log(data.seminars);
    // Process and display host information and seminars
  })
  .catch(error => console.error('Error fetching seminars by host:', error));
```

### Implement Calendar View

```javascript
// Using FullCalendar library as an example
document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: '/wp-json/memberfun/v1/seminars/calendar',
    eventClick: function(info) {
      window.location.href = info.event.url;
    },
    eventDidMount: function(info) {
      // Add tooltip with location and host information
      const tooltip = new Tooltip(info.el, {
        title: `Location: ${info.event.extendedProps.location}<br>Host: ${info.event.extendedProps.host}`,
        placement: 'top',
        trigger: 'hover',
        container: 'body',
        html: true
      });
    }
  });
  calendar.render();
});
```

### Add "Add to Calendar" Button

```javascript
function addToCalendar(seminarId) {
  window.location.href = `/wp-json/memberfun/v1/seminars/${seminarId}/ical`;
}

// Usage in HTML
// <button onclick="addToCalendar(123)">Add to Calendar</button>
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad request (invalid parameters)
- 404: Resource not found
- 500: Server error

Error responses include a message explaining the error.

## Pagination

Endpoints that return multiple seminars support pagination through the `limit` and `offset` parameters. The response includes:

- `total`: Total number of seminars matching the query
- `pages`: Total number of pages based on the limit
- `page`: Current page number (calculated from offset and limit)

To navigate to a specific page, calculate the offset as: `offset = (page - 1) * limit`
