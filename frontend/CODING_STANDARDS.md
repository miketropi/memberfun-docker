# MemberFun Coding Standards and Best Practices

This document outlines the coding standards and best practices for the MemberFun project. Following these guidelines ensures code consistency, maintainability, and quality across the project.

## Table of Contents

1. [JavaScript/React Coding Standards](#javascriptreact-coding-standards)
2. [CSS/Styling Standards](#cssstyling-standards)
3. [File and Folder Structure](#file-and-folder-structure)
4. [Component Design Principles](#component-design-principles)
5. [State Management](#state-management)
6. [Performance Optimization](#performance-optimization)
7. [Testing Standards](#testing-standards)
8. [Documentation](#documentation)
9. [Git Workflow](#git-workflow)

## JavaScript/React Coding Standards

### General JavaScript

- Use ES6+ features where appropriate
- Use `const` for variables that don't change, `let` for variables that do
- Avoid using `var`
- Use arrow functions for callbacks and anonymous functions
- Use template literals instead of string concatenation
- Use destructuring for objects and arrays
- Use spread/rest operators when appropriate
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

### React Specific

- Use functional components with hooks instead of class components
- Use named exports for components
- Component names should be PascalCase
- Props should be camelCase
- Destructure props in function parameters
- Use React fragments (`<>...</>`) to avoid unnecessary divs
- Keep components small and focused on a single responsibility
- Use React.memo for components that render often with the same props
- Use useCallback for event handlers passed to child components
- Use useMemo for expensive calculations

### Example Component Structure

```jsx
// Good example
import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

export function ComponentName({ initialValue, onSubmit }) {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  
  const handleSubmit = useCallback(() => {
    onSubmit(value);
  }, [onSubmit, value]);
  
  const computedValue = useMemo(() => {
    return expensiveComputation(value);
  }, [value]);
  
  return (
    <div className="component-name">
      <input value={value} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
      <div>{computedValue}</div>
    </div>
  );
}

ComponentName.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
```

## CSS/Styling Standards

- Use CSS modules for component-specific styles
- Use BEM naming convention for CSS classes
- Use CSS variables for theming and consistent values
- Avoid inline styles except for dynamic values
- Use media queries for responsive design
- Keep selectors simple and avoid deep nesting
- Use flexbox and grid for layouts

### Example CSS Module

```css
/* ComponentName.module.css */
.component {
  display: flex;
  flex-direction: column;
}

.component__header {
  font-size: var(--font-size-large);
  color: var(--color-primary);
}

.component__button {
  padding: 8px 16px;
  border-radius: 4px;
}

.component__button--primary {
  background-color: var(--color-primary);
  color: white;
}
```

## File and Folder Structure

### Component Structure

Each component should have its own directory with the following files:

```
src/components/ComponentName/
├── ComponentName.jsx       # Component code
├── ComponentName.module.css # Component styles
├── ComponentName.test.jsx  # Component tests
└── index.js                # Export file
```

### Feature-based Organization

For larger applications, consider organizing by feature:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── index.js
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── index.js
├── components/            # Shared components
├── hooks/                 # Shared hooks
├── utils/                 # Shared utilities
└── App.jsx
```

## Component Design Principles

### Component Hierarchy

- Create small, reusable components
- Compose complex UIs from simple components
- Follow the single responsibility principle
- Use composition over inheritance

### Props

- Keep props simple and focused
- Use prop types or TypeScript for type checking
- Provide default props where appropriate
- Avoid prop drilling by using context or state management

### Hooks

- Create custom hooks for reusable logic
- Keep hooks focused on a single concern
- Follow the rules of hooks
- Name hooks with the `use` prefix

## State Management

### Local State

- Use `useState` for component-specific state
- Use `useReducer` for complex state logic within a component

### Application State

- Use React Context for state shared between components
- For complex applications, consider:
  - Redux Toolkit
  - Zustand
  - Jotai
  - Recoil

### State Management Guidelines

- Keep state as local as possible
- Lift state up only when necessary
- Use immutable patterns for updating state
- Normalize complex state objects

## Performance Optimization

- Use React.memo for pure components
- Use useCallback for event handlers
- Use useMemo for expensive calculations
- Implement code-splitting with React.lazy and Suspense
- Use windowing for long lists (react-window or react-virtualized)
- Optimize images and assets
- Use the React DevTools Profiler to identify performance bottlenecks

## Testing Standards

### Unit Tests

- Test each component in isolation
- Mock dependencies and external services
- Test both success and error cases
- Use meaningful test descriptions

### Integration Tests

- Test component interactions
- Test user workflows
- Focus on critical paths

### Test Structure

```jsx
// ComponentName.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly with default props', () => {
    render(<ComponentName initialValue="" onSubmit={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onSubmit when button is clicked', () => {
    const handleSubmit = jest.fn();
    render(<ComponentName initialValue="" onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
```

## Documentation

### Code Comments

- Use JSDoc comments for functions and components
- Comment complex logic
- Avoid commenting obvious code
- Keep comments up-to-date

### Component Documentation

- Document props and their types
- Provide usage examples
- Document side effects and dependencies

## Git Workflow

### Branches

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-description` - Bug fix branches

### Commits

- Use descriptive commit messages
- Follow conventional commits format:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `style: format code`
  - `refactor: improve code structure`
  - `test: add tests`
  - `chore: update dependencies`

### Pull Requests

- Keep PRs focused on a single change
- Provide a clear description
- Reference related issues
- Request reviews from appropriate team members
- Ensure all tests pass before merging

---

These standards are guidelines, not strict rules. Use your best judgment and discuss with the team when in doubt. 