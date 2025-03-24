# Challenges and Submissions Frontend Documentation

## Overview
This document describes the frontend implementation for the Challenges and Submissions feature, including the list view, detail view, and submission form functionality.

## 1. Challenges List View

### 1.1 Features
- Display a list of all challenges
- Filter challenges by category
- Pagination support
- Each challenge card shows:
  - Challenge title
  - Featured image
  - Excerpt/description
  - Maximum score
  - Submission deadline (if enabled)
  - Challenge category

### 1.2 API Integration
```javascript
// Get all challenges with optional filtering
const challenges = await challengesAPI.getChallenges({
  per_page: 12,
  page: 1,
  challenge_category: selectedCategoryId
});

// Get challenges by category
const categoryChallenges = await challengesAPI.getChallengesByCategory(categoryId, {
  per_page: 12,
  page: 1
});
```

### 1.3 Component Structure
```jsx
<ChallengesList>
  <CategoryFilter />
  <ChallengesGrid>
    <ChallengeCard /> // Repeated for each challenge
  </ChallengesGrid>
  <Pagination />
</ChallengesList>
```

## 2. Challenge Detail View

### 2.1 Features
- Display full challenge details
- Show submission deadline countdown (if enabled)
- Display challenge content
- Show associated category
- Display maximum score
- Show submission form (if deadline not passed)

### 2.2 API Integration
```javascript
// Get single challenge details
const challenge = await challengesAPI.getChallenge(challengeId);

// Get submissions for this challenge
const submissions = await submissionsAPI.getSubmissionsByChallenge(challengeId);
```

### 2.3 Component Structure
```jsx
<ChallengeDetail>
  <ChallengeHeader>
    <ChallengeTitle />
    <ChallengeMeta>
      <DeadlineCountdown />
      <MaxScore />
      <Category />
    </ChallengeMeta>
  </ChallengeHeader>
  <ChallengeContent />
  <SubmissionSection>
    <SubmissionForm />
    <SubmissionsList />
  </SubmissionSection>
</ChallengeDetail>
```

## 3. Submission Form

### 3.1 Features
- Form fields:
  - Title
  - Description/Content
  - Demo URL
  - Demo Video URL
  - File upload (if needed)
- Validation:
  - Required fields
  - URL format validation
  - File size/type restrictions
- Success/Error handling
- Loading states

### 3.2 API Integration
```javascript
// Create new submission
const submission = await submissionsAPI.createSubmission({
  title: submissionTitle,
  content: submissionContent,
  challenge_id: challengeId,
  meta: {
    demo_url: demoUrl,
    demo_video: demoVideoUrl
  }
});
```

### 3.3 Component Structure
```jsx
<SubmissionForm>
  <FormTitle />
  <FormFields>
    <TitleInput />
    <ContentEditor />
    <DemoUrlInput />
    <DemoVideoInput />
    <FileUpload />
  </FormFields>
  <SubmitButton />
  <ValidationMessages />
</SubmissionForm>
```

## 4. State Management

### 4.1 Required States
- Challenges list state
- Selected category filter
- Pagination state
- Current challenge details
- Submission form state
- Loading states
- Error states

### 4.2 Example State Structure
```javascript
const [challenges, setChallenges] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1,
  total: 0
});
const [currentChallenge, setCurrentChallenge] = useState(null);
const [submissions, setSubmissions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

## 5. Error Handling

### 5.1 Common Error Scenarios
- API request failures
- Form validation errors
- File upload errors
- Deadline passed errors

### 5.2 Error Display
```jsx
<ErrorDisplay>
  {error && (
    <ErrorMessage>
      {error.message}
    </ErrorMessage>
  )}
</ErrorDisplay>
```

## 6. Loading States

### 6.1 Loading Indicators
- List loading skeleton
- Detail view loading state
- Form submission loading state
- File upload progress

### 6.2 Example Loading Component
```jsx
<LoadingState>
  {isLoading && (
    <LoadingSpinner />
  )}
</LoadingState>
```

## 7. Responsive Design

### 7.1 Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 7.2 Layout Adjustments
- Grid columns adjust based on screen size
- Form layout changes for mobile
- Image sizes optimize for different devices

## 8. User Experience Guidelines

### 8.1 Navigation
- Clear breadcrumb navigation
- Back button support
- Category filter persistence
- Smooth transitions between views

### 8.2 Feedback
- Success messages after submission
- Loading indicators during API calls
- Error messages with clear instructions
- Form validation feedback

## 9. Security Considerations

### 9.1 Form Security
- CSRF protection
- Input sanitization
- File upload restrictions
- Rate limiting

### 9.2 Access Control
- Check user authentication
- Verify submission deadlines
- Validate user permissions
- Protect admin-only features

## 10. Performance Optimization

### 10.1 Loading Strategies
- Lazy loading for images
- Pagination for lists
- Caching challenge data
- Optimized API calls

### 10.2 Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy features

## 11. Testing Guidelines

### 11.1 Unit Tests
- Component rendering
- Form validation
- API integration
- State management

### 11.2 Integration Tests
- User flows
- API interactions
- Form submissions
- Navigation

### 11.3 E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile responsiveness
- Performance metrics
