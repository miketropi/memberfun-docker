# Build stage
# FROM node:20-alpine as builder

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Build the application
# RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host option
CMD ["npm", "run", "dev", "--", "--host"] 