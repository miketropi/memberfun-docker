# Development Environment Setup Documentation

This document describes how to set up and use the development environment for the MemberFun project, which includes a Vite React frontend, WordPress backend, MySQL database, Redis cache, and Adminer for database management.

## Project Structure

```
project-root/
├── frontend/          # Vite React application
│   ├── Dockerfile    # Frontend Docker configuration
│   └── src/          # React source code
├── backend/
│   └── wp-content/   # WordPress custom content
├── documents/        # Project documentation
├── docker-compose.dev.yml  # Development docker compose
└── .env.dev         # Development environment variables
```

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm (for local development)
- Git (for version control)

## Environment Variables

The development environment uses `.env.dev` with the following configuration:

```env
# WordPress Database Configuration
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress_dev
WORDPRESS_DB_NAME=wordpress
WORDPRESS_TABLE_PREFIX=wp_

# MySQL Configuration
MYSQL_ROOT_PASSWORD=root_dev
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress
MYSQL_PASSWORD=wordpress_dev

# Redis Configuration
REDIS_PASSWORD=redis_dev

# Frontend Configuration
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=MemberFun-Dev
```

## Services and Ports

The development environment exposes the following services:

| Service    | URL/Port                  | Description                    |
|------------|---------------------------|--------------------------------|
| Frontend   | http://localhost:5173     | Vite React development server |
| WordPress  | http://localhost:8000     | WordPress backend             |
| Adminer    | http://localhost:8080     | Database management interface |
| MySQL      | localhost:3306            | MySQL database                |
| Redis      | localhost:6379            | Redis cache                   |

## Getting Started

1. **Clone the repository and set up environment**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   cp .env.dev.example .env.dev  # If using example file
   ```

2. **Start the development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d
   ```

3. **Check service status**:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

4. **View logs**:
   ```bash
   # All services
   docker-compose -f docker-compose.dev.yml logs -f

   # Specific service
   docker-compose -f docker-compose.dev.yml logs -f frontend
   ```

## Development Workflow

### Frontend Development

- The frontend code is mounted at `/app` in the container
- Hot-reloading is enabled by default
- Access the development server at http://localhost:5173
- Node modules are in a named volume for better performance

### WordPress Development

- WordPress files are accessible in `backend/wp-content`
- Debug mode is enabled for development
- Custom plugins and themes can be added to `wp-content` directory
- Changes are reflected immediately

### Database Management

1. **Access Adminer**:
   - Open http://localhost:8080
   - System: MySQL
   - Server: mysql
   - Username: wordpress (or root)
   - Password: wordpress_dev (or root_dev)
   - Database: wordpress

2. **Direct MySQL Access**:
   ```bash
   docker-compose -f docker-compose.dev.yml exec mysql mysql -u wordpress -pwordpress_dev wordpress
   ```

### Redis Cache

- Redis is password protected
- Connect using:
  ```bash
  docker-compose -f docker-compose.dev.yml exec redis redis-cli -a redis_dev
  ```

## Common Tasks

### Rebuilding Services

```bash
# Rebuild specific service
docker-compose -f docker-compose.dev.yml build frontend

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up -d --build
```

### Managing Services

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop specific service
docker-compose -f docker-compose.dev.yml stop frontend

# Restart specific service
docker-compose -f docker-compose.dev.yml restart wordpress
```

### Cleaning Up

```bash
# Remove containers and networks
docker-compose -f docker-compose.dev.yml down

# Remove containers, networks, and volumes
docker-compose -f docker-compose.dev.yml down -v
```

## Troubleshooting

1. **Frontend not updating**:
   - Check if the volume is properly mounted
   - Restart the frontend service
   ```bash
   docker-compose -f docker-compose.dev.yml restart frontend
   ```

2. **Database connection issues**:
   - Verify MySQL is running
   - Check credentials in .env.dev
   - Ensure ports are not in use
   ```bash
   docker-compose -f docker-compose.dev.yml logs mysql
   ```

3. **WordPress errors**:
   - Check WordPress debug log
   - Verify database connection
   - Check file permissions in wp-content

## Best Practices

1. **Version Control**:
   - Don't commit .env.dev files
   - Keep sensitive data out of version control
   - Use .gitignore for local development files

2. **Database**:
   - Regular backups during development
   - Use Adminer for database management
   - Don't use production data in development

3. **Performance**:
   - Use named volumes for node_modules
   - Enable WordPress debug mode only in development
   - Use Redis for caching

## Security Notes

1. Development environment is not secured by default
2. Use different passwords in production
3. Don't expose development ports in production
4. Keep .env.dev file secure and don't share it

Remember to never use development configurations or credentials in a production environment.
