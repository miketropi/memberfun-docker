# MemberFun - Member Management System

A modern web application built with WordPress (Headless CMS) backend and Vite React frontend for managing members, points, seminars, and challenges.

## Features

- 👥 **Member Management**
  - User registration and authentication
  - Member profiles and information management
  - Role-based access control

- 🎯 **Points System**
  - Track and manage member points
  - Points history and analytics
  - Rewards and achievements

- 📅 **Seminar Scheduling**
  - Create and manage seminars
  - Registration and attendance tracking
  - Calendar integration

- 🏆 **Challenge System**
  - Create custom challenges
  - Track participant progress
  - Leaderboards and rankings

## Tech Stack

- **Frontend**: Vite + React
- **Backend**: WordPress (Headless CMS)
- **Database**: MySQL 8
- **Cache**: Redis
- **Database Management**: Adminer
- **Reverse Proxy**: Traefik (Production)
- **Container**: Docker

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

## Project Structure

```
project-root/
├── frontend/          # Vite React application
├── backend/          # WordPress files
│   └── wp-content/   # WordPress themes and plugins
├── .env              # Environment variables
├── docker-compose.yml        # Production configuration
└── docker-compose.dev.yml    # Development configuration
```

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create a `.env` file in the root directory with the following variables:
```env
# WordPress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress_password
WORDPRESS_DB_NAME=wordpress
WORDPRESS_TABLE_PREFIX=wp_

# MySQL
MYSQL_ROOT_PASSWORD=somewordpress
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress
MYSQL_PASSWORD=wordpress_password

# Redis
REDIS_PASSWORD=redis_password

# Frontend
VITE_API_URL=http://localhost:8000/wp-json
VITE_APP_NAME=MemberFun-Dev

# JWT Authentication
JWT_AUTH_SECRET_KEY=your-secret-key
JWT_AUTH_CORS_ENABLE=true
WP_ENVIRONMENT_TYPE=local
```

3. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d
```

Development services will be available at:
- Frontend: http://localhost:5173
- WordPress Backend: http://localhost:8000
- WordPress API: http://localhost:8000/wp-json
- Adminer: http://localhost:8080
- MySQL: localhost:3306
- Redis: localhost:6379

### Development Environment Details

The development environment (`docker-compose.dev.yml`) includes:

- Hot-reloading for frontend development
- WordPress debug mode enabled
- Exposed ports for direct service access
- Volume mounts for real-time code updates
- No SSL/TLS (plain HTTP for local development)

## Production Setup

1. Update your `.env` file with production values:
```env
# Traefik
DOMAIN=yourdomain.com
CERT_RESOLVER=letsencrypt
LETSENCRYPT_EMAIL=your@email.com
TRAEFIK_PORT=80
TRAEFIK_SECURE_PORT=443

# Frontend
VITE_API_URL=https://api.yourdomain.com/wp-json
VITE_APP_NAME=MemberFun

# Add other variables from development .env
```

2. Start the production environment:
```bash
docker-compose up -d
```

### Production Environment Details

The production environment (`docker-compose.yml`) includes:

- Traefik reverse proxy with automatic SSL/TLS
- Secure HTTPS endpoints
- Network isolation
- Production-optimized configurations
- No exposed ports except 80/443

Production services will be available at:
- Frontend: https://yourdomain.com
- WordPress API: https://api.yourdomain.com
- Adminer: https://adminer.yourdomain.com

## WordPress Configuration

1. After initial setup, install and activate required plugins:
- WP REST API
- JWT Authentication
- Custom Post Types (for members, seminars, challenges)
- CORS enabler

2. Configure WordPress permalinks to "Post name" (/settings/permalinks)

## Development Workflow

1. Frontend development:
- Code is in the `frontend` directory
- Hot-reloading enabled at http://localhost:5173
- API calls to WordPress backend

2. Backend development:
- Custom endpoints in `backend/wp-content`
- WordPress admin at http://localhost:8000/wp-admin
- API documentation at http://localhost:8000/wp-json

## Security Notes

- All sensitive information should be stored in `.env` files
- Production environment uses SSL/TLS certificates via Traefik
- Redis is password protected
- MySQL uses separate user credentials
- `.env` files should be added to `.gitignore`

## Troubleshooting

1. **Container Access**:
```bash
# Access WordPress container
docker exec -it wordpress-dev bash

# Access MySQL container
docker exec -it mysql-dev bash
```

2. **Logs**:
```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f [service-name]
```

3. **Reset Development Environment**:
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

4. **Common Issues**:
- If frontend can't connect to API, check CORS settings
- For database connection issues, verify MySQL credentials
- For Redis connection issues, check Redis password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Support

For support, please open an issue in the GitHub repository or contact the development team.
