# Seminar Components

A collection of reusable React components for managing and displaying seminars.

## Components

### SeminarManager

The main component that manages the state and displays seminars. It includes tabs for upcoming and past seminars, seminar details, and registration functionality.

```jsx
import { SeminarManager } from '../components/seminar';

function SeminarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SeminarManager />
    </div>
  );
}
```

### SeminarList

A component that displays a list of seminars in a table format.

```jsx
import { SeminarList } from '../components/seminar';

function CustomSeminarList({ seminars }) {
  const handleSeminarClick = (seminar) => {
    console.log('Seminar clicked:', seminar);
  };

  const isRegistered = (seminarId) => {
    // Your logic to check if user is registered
    return false;
  };

  return (
    <SeminarList
      seminars={seminars}
      isRegisteredFn={isRegistered}
      onSeminarClick={handleSeminarClick}
      isPast={false}
      emptyMessage="No seminars available."
    />
  );
}
```

### SeminarCard

A component that displays a single seminar in a table row.

```jsx
import { SeminarCard } from '../components/seminar';

function CustomSeminarCard({ seminar }) {
  const handleClick = (seminar) => {
    console.log('Seminar clicked:', seminar);
  };

  return (
    <table>
      <tbody>
        <SeminarCard
          seminar={seminar}
          isRegistered={false}
          onClick={handleClick}
          isPast={false}
        />
      </tbody>
    </table>
  );
}
```

### SeminarDetails

A component that displays the details of a selected seminar.

```jsx
import { SeminarDetails } from '../components/seminar';

function CustomSeminarDetails({ seminar }) {
  const handleClose = () => {
    console.log('Close clicked');
  };

  const handleRegister = (seminarId) => {
    console.log('Register clicked for seminar:', seminarId);
  };

  const handleCancelRegistration = (seminarId) => {
    console.log('Cancel registration clicked for seminar:', seminarId);
  };

  const handleExportCalendar = (seminarId) => {
    console.log('Export calendar clicked for seminar:', seminarId);
  };

  return (
    <SeminarDetails
      seminar={seminar}
      onClose={handleClose}
      isRegistered={false}
      onRegister={handleRegister}
      onCancelRegistration={handleCancelRegistration}
      onExportCalendar={handleExportCalendar}
      registrationLoading={false}
    />
  );
}
```

### SeminarTabs

A component that displays tabs for navigating between upcoming and past seminars.

```jsx
import { useState } from 'react';
import { SeminarTabs } from '../components/seminar';

function CustomSeminarTabs() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <SeminarTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}
```

### SeminarRegistrationButton

A component that displays a button for registering for a seminar.

```jsx
import { SeminarRegistrationButton } from '../components/seminar';

function CustomSeminarRegistrationButton({ seminarId }) {
  const handleRegister = (seminarId) => {
    console.log('Register clicked for seminar:', seminarId);
  };

  const handleCancelRegistration = (seminarId) => {
    console.log('Cancel registration clicked for seminar:', seminarId);
  };

  const handleExportCalendar = (seminarId) => {
    console.log('Export calendar clicked for seminar:', seminarId);
  };

  return (
    <SeminarRegistrationButton
      seminarId={seminarId}
      isRegistered={false}
      onRegister={handleRegister}
      onCancelRegistration={handleCancelRegistration}
      onExportCalendar={handleExportCalendar}
      loading={false}
    />
  );
}
```

### SeminarRegistrationForm

A component that displays a form for registering for a seminar.

```jsx
import { SeminarRegistrationForm } from '../components/seminar';

function CustomSeminarRegistrationForm({ seminarId }) {
  const handleRegistrationComplete = (seminarId) => {
    console.log('Registration completed for seminar:', seminarId);
  };

  return (
    <SeminarRegistrationForm
      seminarId={seminarId}
      onRegistrationComplete={handleRegistrationComplete}
      initialData={{
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        company: 'Acme Inc.',
        dietary_requirements: '',
        special_requests: ''
      }}
    />
  );
}
```

## Usage Examples

### Complete Seminar Management Page

```jsx
import { useState } from 'react';
import { SeminarManager } from '../components/seminar';

function SeminarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SeminarManager />
    </div>
  );
}
```

### Custom Seminar Registration Page

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { SeminarRegistrationForm } from '../components/seminar';

function SeminarRegistrationPage() {
  const { seminarId } = useParams();
  const navigate = useNavigate();

  const handleRegistrationComplete = () => {
    navigate('/seminars');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SeminarRegistrationForm
        seminarId={seminarId}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </div>
  );
}
```

### Advanced Custom Implementation

For more control over the seminar components, you can use them together to create a custom implementation. The `CustomSeminarExample` component in this package demonstrates how to:

1. Use the components together in a custom layout
2. Implement a multi-step registration flow
3. Add custom UI elements around the components
4. Handle state management between components

```jsx
import { CustomSeminarExample } from '../components/seminar';

function CustomSeminarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CustomSeminarExample />
    </div>
  );
}
```

You can also import the `CustomSeminarExample` component to use as a reference for your own implementation. 