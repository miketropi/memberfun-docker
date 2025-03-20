# MemberFun Developer Instructions

This document provides detailed instructions for developers working on the MemberFun project, a modern web application built with Vite and React.

## Development Environment Setup

### Required Tools

1. **Node.js and npm**
   - Install Node.js v18.0.0 or higher
   - npm v9.0.0 or higher will be installed with Node.js

2. **Code Editor**
   - Recommended: VS Code with the following extensions:
     - ESLint
     - Prettier
     - React Developer Tools
     - Vite

3. **Browser Extensions**
   - React Developer Tools
   - Redux DevTools (if using Redux)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memberfun
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - For new features
- `bugfix/bug-description` - For bug fixes

### Creating a New Feature

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Implement your feature following the project's coding standards

3. Write tests for your feature (if applicable)

4. Submit a pull request to the `develop` branch

### Code Organization

#### Component Structure

- Create a new directory for each component in `src/components/`
- Each component directory should contain:
  - ComponentName.jsx - The component code
  - ComponentName.css - Component-specific styles (if needed)
  - ComponentName.test.jsx - Tests for the component (if applicable)
  - index.js - For exporting the component

Example:
```
src/components/Button/
├── Button.jsx
├── Button.css
├── Button.test.jsx
└── index.js
```

#### State Management

- For simple state, use React's useState and useContext hooks
- For complex state, consider using:
  - Redux Toolkit
  - Zustand
  - Jotai
  - Recoil

### Styling Guidelines

- Use CSS modules for component-specific styles
- Use CSS variables for theming
- Follow BEM naming convention for CSS classes
- Consider using Tailwind CSS or styled-components for more complex styling needs

### Performance Optimization

- Use React.memo for components that render often with the same props
- Use useCallback for event handlers passed to child components
- Use useMemo for expensive calculations
- Implement code-splitting with React.lazy and Suspense
- Use the React DevTools Profiler to identify performance bottlenecks

### Testing

- Write unit tests for components using Vitest (Vite's recommended testing framework)
- Write integration tests for complex interactions
- Aim for good test coverage, especially for critical components

## Building and Deployment

### Building for Production

```bash
npm run build
```

This creates a `dist` directory with production-ready files.

### Previewing the Production Build

```bash
npm run preview
```

### Deployment

- The project can be deployed to various platforms:
  - Vercel
  - Netlify
  - AWS Amplify
  - GitHub Pages

## Best Practices

### Code Quality

- Follow the ESLint rules configured in the project
- Use meaningful variable and function names
- Write comments for complex logic
- Keep components small and focused
- Use TypeScript for type safety (if applicable)

### Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

### Security

- Sanitize user inputs
- Avoid using dangerouslySetInnerHTML
- Keep dependencies updated
- Use environment variables for sensitive information

## Troubleshooting

### Common Issues and Solutions

1. **Hot Module Replacement (HMR) not working**
   - Check if you're exporting components correctly
   - Verify that your Vite config is correct

2. **ESLint errors**
   - Run `npm run lint` to see all errors
   - Fix errors according to the project's ESLint rules

3. **Build failures**
   - Check for syntax errors
   - Verify that all imports are correct
   - Check for missing dependencies

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [React Hooks API Reference](https://react.dev/reference/react)
- [React Router Documentation](https://reactrouter.com/en/main)
