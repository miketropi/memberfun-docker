# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project (if needed for production)
RUN npm run build

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host option
CMD ["npm", "run", "dev", "--", "--host"] 