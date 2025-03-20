# Comments REST API Documentation

This document provides detailed information about the Comments REST API endpoints available in the MemberFun Backend plugin.

## Base URL

All endpoints are prefixed with `/wp-json/memberfun/v1`

## Authentication

All endpoints require user authentication. Users must be logged in to access these endpoints.

## Endpoints

### 1. Get Comments

Retrieves a list of comments with enhanced filtering options.

**Endpoint:** `GET /comments`

#### Query Parameters

| Parameter | Type    | Required | Default | Description |
|-----------|---------|----------|---------|-------------|
| post_id   | integer | No       | -       | Filter comments by post ID |
| page      | integer | No       | 1       | Page number for pagination |
| per_page  | integer | No       | 10      | Number of comments per page |
| orderby   | string  | No       | date    | Field to order comments by |
| order     | string  | No       | DESC    | Order direction (ASC/DESC) |
| search    | string  | No       | -       | Search term to filter comments |
| status    | string  | No       | approve | Comment status filter |

#### Response

```json
{
    "comments": [
        {
            "id": 123,
            "post_id": 456,
            "author": {
                "id": 789,
                "name": "John Doe",
                "email": "john@example.com"
            },
            "content": "Comment content",
            "date": "2024-03-20 10:00:00",
            "parent": 0,
            "status": 1
        }
    ],
    "total": 100,
    "pages": 10
}
```

### 2. Create Comment

Creates a new comment on a post.

**Endpoint:** `POST /comments`

#### Request Body

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| post_id   | integer | Yes      | ID of the post to comment on |
| content   | string  | Yes      | Comment content |
| parent    | integer | No       | Parent comment ID (for replies) |

#### Response

```json
{
    "id": 123,
    "post_id": 456,
    "author": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "content": "Comment content",
    "date": "2024-03-20 10:00:00",
    "parent": 0,
    "status": 1
}
```

### 3. Update Comment

Updates an existing comment.

**Endpoint:** `PUT /comments/{id}`

#### URL Parameters

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| id        | integer | Yes      | ID of the comment to update |

#### Request Body

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| content   | string | Yes      | Updated comment content |

#### Response

```json
{
    "id": 123,
    "post_id": 456,
    "author": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "content": "Updated comment content",
    "date": "2024-03-20 10:00:00",
    "parent": 0,
    "status": 1
}
```

### 4. Delete Comment

Deletes a comment.

**Endpoint:** `DELETE /comments/{id}`

#### URL Parameters

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| id        | integer | Yes      | ID of the comment to delete |

#### Response

- Status Code: 204 (No Content)
- Empty response body

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
    "code": "empty_content",
    "message": "Comment content cannot be empty",
    "status": 400
}
```

### 404 Not Found
```json
{
    "code": "invalid_comment",
    "message": "Invalid comment ID",
    "status": 404
}
```

### 500 Internal Server Error
```json
{
    "code": "delete_failed",
    "message": "Failed to delete comment",
    "status": 500
}
```

## Permissions

- Users can only edit and delete their own comments
- Administrators can edit and delete any comment
- All endpoints require user authentication
- Comments are auto-approved for logged-in users

## Example Usage

### JavaScript/TypeScript Example

```javascript
// Get comments
const getComments = async (postId) => {
    const response = await fetch(`/wp-json/memberfun/v1/comments?post_id=${postId}`);
    return await response.json();
};

// Create comment
const createComment = async (postId, content) => {
    const response = await fetch('/wp-json/memberfun/v1/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            post_id: postId,
            content: content
        })
    });
    return await response.json();
};

// Update comment
const updateComment = async (commentId, content) => {
    const response = await fetch(`/wp-json/memberfun/v1/comments/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: content
        })
    });
    return await response.json();
};

// Delete comment
const deleteComment = async (commentId) => {
    const response = await fetch(`/wp-json/memberfun/v1/comments/${commentId}`, {
        method: 'DELETE'
    });
    return response.status === 204;
};
```

### PHP Example

```php
// Get comments
$response = wp_remote_get('/wp-json/memberfun/v1/comments?post_id=123');

// Create comment
$response = wp_remote_post('/wp-json/memberfun/v1/comments', array(
    'body' => array(
        'post_id' => 123,
        'content' => 'New comment'
    )
));

// Update comment
$response = wp_remote_request('/wp-json/memberfun/v1/comments/456', array(
    'method' => 'PUT',
    'body' => array(
        'content' => 'Updated comment'
    )
));

// Delete comment
$response = wp_remote_request('/wp-json/memberfun/v1/comments/456', array(
    'method' => 'DELETE'
));
```
