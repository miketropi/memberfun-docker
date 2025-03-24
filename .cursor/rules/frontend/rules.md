# Development Rules and Guidelines for React Vite Project

## Technology Stack

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: 
  - Zustand for global state management
  - Immer for immutable state updates
- **Language**: JavaScript
- **Package Manager**: npm (preferred), or yarn

## Code Structure and Organization

### Project Structure
```
src/
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable UI components
│   ├── common/    # Shared components (Button, Input, etc.)
│   └── layout/    # Layout components (Header, Footer, etc.)
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services and data fetching
├── store/         # State management (if applicable)
├── styles/        # Global styles and Tailwind configuration
└── utils/         # Utility functions
```

### Component Structure
- One component per file
- Use named exports for components
- Group related components in subdirectories

## React Guidelines

### Component Creation
- **Use Functional Components Only**
  ```jsx
  // Good
  const MyComponent = ({ prop1, prop2 }) => {
    return <div>{prop1} {prop2}</div>;
  };

  // Avoid
  class MyComponent extends React.Component {
    render() {
      return <div>{this.props.prop1} {this.props.prop2}</div>;
    }
  }
  ```

### Hooks Usage
- Follow React Hooks rules (only call at top level, only call from React functions)
- Create custom hooks for reusable logic
- Prefer `useState`, `useEffect`, `useCallback`, and `useMemo` for state management and performance optimization

### Props
- Use PropTypes for runtime type checking
- Use destructuring for props
- Provide default values for optional props
  ```jsx
  import PropTypes from 'prop-types';

  const Button = ({ text, onClick, variant = 'primary' }) => {
    // Component implementation
  };

  Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary'])
  };
  ```

## Styling Guidelines

### Tailwind CSS
- Use Tailwind utility classes directly in components
- Create custom utility classes in `tailwind.config.js` for repeated patterns
- Use `@apply` directive in CSS files only when necessary
- Follow mobile-first responsive design approach

### Best Practices
- Group Tailwind classes logically (layout, typography, colors, etc.)
- Extract complex combinations of classes into components
- Use Tailwind's theme configuration for consistent design tokens

```jsx
// Good
<button className="px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
  Click me
</button>

// For complex components, consider extracting classes
const buttonClasses = "px-4 py-2 font-medium text-white rounded";
const primaryButtonClasses = "bg-blue-500 hover:bg-blue-600";

<button className={`${buttonClasses} ${primaryButtonClasses}`}>
  Click me
</button>
```

## State Management

- Use React's built-in state management (useState, useContext) for simple state
- Consider Zustand, Jotai, or Redux Toolkit for complex state management
- Keep state as local as possible
- Use context for theme, authentication, and other global states

## Performance Optimization

- Use React.memo for expensive components
- Optimize re-renders with useCallback and useMemo
- Implement code-splitting with React.lazy and Suspense
- Use Vite's built-in optimizations for production builds

## Testing

- Write unit tests for components and utilities
- Use React Testing Library for component testing
- Aim for good test coverage of critical paths
- Write integration tests for key user flows

## Code Quality and Standards

### Formatting and Linting
- Use ESLint with the recommended React configuration
- Use Prettier for consistent code formatting
- Configure husky and lint-staged for pre-commit checks

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Files**: Follow component/function naming
- **CSS classes**: kebab-case if custom classes are needed

### Comments and Documentation
- Document complex logic with clear comments
- Use JSDoc for functions and components
- Keep a README for each major directory
- Document props with PropTypes and JSDoc comments

## Git Workflow

- Use feature branches for development
- Write meaningful commit messages
- Create detailed pull requests with descriptions
- Require code reviews before merging

## Build and Deployment

- Use Vite's optimized build process
- Configure environment variables appropriately
- Implement CI/CD pipelines for automated testing and deployment
- Optimize assets for production

## Accessibility

- Ensure proper semantic HTML
- Implement keyboard navigation
- Add appropriate ARIA attributes
- Test with screen readers
- Maintain sufficient color contrast

## Security Best Practices

- Sanitize user inputs
- Avoid exposing sensitive information
- Use environment variables for API keys
- Implement proper authentication and authorization
- Keep dependencies updated

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html) 