# Challenge & Submission Custom Post Types Documentation

## Overview
This document describes the implementation of two custom post types: Challenge and Submission, along with their associated taxonomies and REST API endpoints.

## 1. Challenge Custom Post Type

### 1.1 Basic Information
- **Post Type Name**: `challenge`
- **Labels**:
  - Singular: Challenge
  - Plural: Challenges
- **Public**: Yes
- **Show in REST**: Yes
- **Supports**: title, editor, thumbnail, excerpt

### 1.2 Custom Meta Fields
1. **Maximum Score**
   - Field Type: Number
   - Key: `_challenge_max_score`
   - Description: Maximum points that can be awarded for this challenge

2. **Submission Deadline Settings**
   - Field Type: Boolean
   - Key: `_challenge_submission_deadline_enabled`
   - Description: Toggle to enable/disable submission deadline

3. **Deadline for Submissions**
   - Field Type: DateTime
   - Key: `_challenge_submission_deadline`
   - Description: Final date and time for challenge submissions
   - Only visible when submission deadline is enabled

### 1.3 Taxonomy: Challenge Category
- **Taxonomy Name**: `challenge_category`
- **Hierarchical**: Yes
- **Show in REST**: Yes
- **Labels**:
  - Singular: Challenge Category
  - Plural: Challenge Categories

## 2. Submission Custom Post Type

### 2.1 Basic Information
- **Post Type Name**: `submission`
- **Labels**:
  - Singular: Submission
  - Plural: Submissions
- **Public**: Yes
- **Show in REST**: Yes
- **Supports**: title, editor, thumbnail

### 2.2 Custom Meta Fields
1. **Demo URL**
   - Field Type: URL
   - Key: `_submission_demo_url`
   - Description: URL to the demo/project

2. **Demo Content Description Video**
   - Field Type: URL
   - Key: `_submission_demo_video`
   - Description: URL to the video demonstrating the submission

### 2.3 Relationship
- Each submission is associated with a challenge through a meta field
- Meta Key: `_submission_challenge_id`
- Type: Number (Challenge post ID)

## 3. REST API Endpoints

### 3.1 Challenge Endpoints

#### List Challenges
```
GET /wp-json/wp/v2/challenge
```
Parameters:
- `per_page`: Number of items per page (default: 10)
- `page`: Page number
- `challenge_category`: Filter by category ID
- `orderby`: Sort by (date, title, etc.)
- `order`: Sort order (asc/desc)

#### Get Single Challenge
```
GET /wp-json/wp/v2/challenge/{id}
```

#### Create Challenge
```
POST /wp-json/wp/v2/challenge
```
Required fields:
- title
- content
- meta fields (as described above)

#### Update Challenge
```
PUT /wp-json/wp/v2/challenge/{id}
```

#### Delete Challenge
```
DELETE /wp-json/wp/v2/challenge/{id}
```

### 3.2 Submission Endpoints

#### List Submissions
```
GET /wp-json/wp/v2/submission
```
Parameters:
- `per_page`: Number of items per page (default: 10)
- `page`: Page number
- `challenge`: Filter by challenge ID
- `author`: Filter by user ID
- `orderby`: Sort by (date, title, etc.)
- `order`: Sort order (asc/desc)

#### Get Single Submission
```
GET /wp-json/wp/v2/submission/{id}
```

#### Create Submission
```
POST /wp-json/wp/v2/submission
```
Required fields:
- title
- content
- challenge_id
- meta fields (as described above)

#### Update Submission
```
PUT /wp-json/wp/v2/submission/{id}
```

#### Delete Submission
```
DELETE /wp-json/wp/v2/submission/{id}
```

## 4. Security Considerations

1. **Authentication**
   - All endpoints require authentication
   - Use WordPress nonce for form submissions
   - Implement proper capability checks

2. **Data Validation**
   - Validate all input data
   - Sanitize output
   - Implement proper error handling

3. **Access Control**
   - Only administrators can create/edit challenges
   - Users can only create/edit their own submissions
   - Public users can only view published challenges and submissions

## 5. Usage Examples

### Creating a Challenge
```php
$challenge_data = array(
    'post_title'    => 'Sample Challenge',
    'post_content'  => 'Challenge description',
    'post_status'   => 'publish',
    'post_type'     => 'challenge',
    'meta_input'    => array(
        '_challenge_max_score' => 100,
        '_challenge_submission_deadline_enabled' => true,
        '_challenge_submission_deadline' => '2024-12-31 23:59:59'
    )
);

wp_insert_post($challenge_data);
```

### Creating a Submission
```php
$submission_data = array(
    'post_title'    => 'Sample Submission',
    'post_content'  => 'Submission description',
    'post_status'   => 'publish',
    'post_type'     => 'submission',
    'meta_input'    => array(
        '_submission_challenge_id' => 123,
        '_submission_demo_url' => 'https://example.com/demo',
        '_submission_demo_video' => 'https://example.com/video'
    )
);

wp_insert_post($submission_data);
```
