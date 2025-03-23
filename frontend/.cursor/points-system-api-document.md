# MemberFun Points System API Documentation

This document provides detailed information about the MemberFun Points System API endpoints and how to use them from the frontend.

## Base URL

All API endpoints are prefixed with `/wp-json/memberfun/v1`

## Authentication

All API endpoints require authentication. The user must be logged in to access these endpoints. For admin-only endpoints (adding/deducting points), the user must have administrator privileges.

## Endpoints

### 1. Get User Points

Retrieves the current points balance for a specific user.

```javascript
// Example using fetch
const getUserPoints = async (userId) => {
  try {
    const response = await fetch(`/wp-json/memberfun/v1/points/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch points');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching points:', error);
    throw error;
  }
};
```

**Response Format:**
```json
{
  "user_id": 123,
  "display_name": "John Doe",
  "points": 100
}
```

### 2. Get User Rank

Retrieves the current rank of a specific user based on their points.

```javascript
// Example using fetch
const getUserRank = async (userId) => {
  try {
    const response = await fetch(`/wp-json/memberfun/v1/points/user/${userId}/rank`);
    if (!response.ok) throw new Error('Failed to fetch user rank');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    throw error;
  }
};
```

**Response Format:**
```json
{
  "user_id": 123,
  "rank": 1,
}
```

### 3. Get User Transactions

Retrieves the transaction history for a specific user with pagination support.

```javascript
// Example using fetch
const getUserTransactions = async (userId, options = {}) => {
  const {
    perPage = 20,
    page = 1,
    type = ''
  } = options;

  try {
    const response = await fetch(
      `/wp-json/memberfun/v1/points/user/${userId}/transactions?per_page=${perPage}&page=${page}&type=${type}`
    );
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const data = await response.json();
    const total = response.headers.get('X-WP-Total');
    const totalPages = response.headers.get('X-WP-TotalPages');
    
    return {
      transactions: data,
      pagination: {
        total: parseInt(total),
        totalPages: parseInt(totalPages),
        currentPage: page
      }
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
```

**Response Format:**
```json
[
  {
    "id": 1,
    "user_id": 123,
    "points": 100,
    "type": "add",
    "note": "Welcome bonus",
    "admin_user_id": 1,
    "created_at": "2024-03-20 10:00:00"
  }
]
```

### 4. Add Points (Admin Only)

Adds points to a user's account. This endpoint requires administrator privileges.

```javascript
// Example using fetch
const addPoints = async (userId, points, note = '') => {
  try {
    const response = await fetch('/wp-json/memberfun/v1/points/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        points: points,
        note: note
      })
    });
    
    if (!response.ok) throw new Error('Failed to add points');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
};
```

**Response Format:**
```json
{
  "success": true,
  "transaction_id": 1,
  "user_id": 123,
  "points_added": 100,
  "current_points": 200,
  "message": "100 points added successfully."
}
```

### 5. Deduct Points (Admin Only)

Deducts points from a user's account. This endpoint requires administrator privileges.

```javascript
// Example using fetch
const deductPoints = async (userId, points, note = '', allowNegative = false) => {
  try {
    const response = await fetch('/wp-json/memberfun/v1/points/deduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        points: points,
        note: note,
        allow_negative: allowNegative
      })
    });
    
    if (!response.ok) throw new Error('Failed to deduct points');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deducting points:', error);
    throw error;
  }
};
```

**Response Format:**
```json
{
  "success": true,
  "transaction_id": 2,
  "user_id": 123,
  "points_deducted": 50,
  "current_points": 150,
  "message": "50 points deducted successfully."
}
```

## Error Handling

All endpoints may return the following HTTP status codes:
- 200: Success
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 400: Bad Request (invalid parameters)
- 404: Not Found (user not found)

## Example Usage in React Component

```javascript
import { useState, useEffect } from 'react';

const UserPoints = ({ userId }) => {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getUserPoints(userId);
        setPoints(data.points);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Current Points: {points}</div>;
};
```

## Notes

1. All endpoints require the user to be logged in
2. Admin-only endpoints (add/deduct points) require administrator privileges
3. Points cannot be negative by default unless explicitly allowed with `allow_negative` parameter
4. Transaction history is paginated with a default of 20 items per page
5. All responses include appropriate HTTP status codes and error messages
