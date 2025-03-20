# Docker Compose Setup Documentation

This document describes the setup for a WordPress backend with MySQL, Adminer, Redis, and a Vite React frontend using Traefik as reverse proxy with SSL/TLS.

## Project Structure

```
project-root/
├── frontend/          # Vite React application
├── backend/           # WordPress files
├── .env              # Environment variables
└── docker-compose.yml # Docker compose configuration
```

## Environment Variables (.env)

Create a `.env` file in your project root with the following variables:

```env
# Traefik
DOMAIN=localhost
CERT_RESOLVER=letsencrypt

# WordPress
WORDPRESS_DB_HOST=mysql
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress_password
WORDPRESS_TABLE_PREFIX=wp_

# MySQL
MYSQL_ROOT_PASSWORD=somewordpress
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress
MYSQL_PASSWORD=wordpress_password

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=redis_password

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=YourAppName

# Ports
TRAEFIK_PORT=80
TRAEFIK_SECURE_PORT=443
MYSQL_PORT=3306
ADMINER_PORT=8080
```

## Docker Compose Configuration

Here's the `docker-compose.yml` configuration:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "${TRAEFIK_PORT}:80"
      - "${TRAEFIK_SECURE_PORT}:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "letsencrypt:/letsencrypt"
    networks:
      - web

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    environment:
      - VITE_API_URL=${VITE_API_URL}
      - VITE_APP_NAME=${VITE_APP_NAME}
    volumes:
      - ./frontend:/app
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=${CERT_RESOLVER}"
    networks:
      - web

  wordpress:
    image: wordpress:latest
    container_name: wordpress
    environment:
      - WORDPRESS_DB_HOST=${WORDPRESS_DB_HOST}
      - WORDPRESS_DB_USER=${WORDPRESS_DB_USER}
      - WORDPRESS_DB_PASSWORD=${WORDPRESS_DB_PASSWORD}
      - WORDPRESS_DB_NAME=${WORDPRESS_DB_NAME}
      - WORDPRESS_TABLE_PREFIX=${WORDPRESS_TABLE_PREFIX}
    volumes:
      - wordpress:/var/www/html
      - ./backend/wp-content:/var/www/html/wp-content
    depends_on:
      - mysql
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.wordpress.rule=Host(`api.${DOMAIN}`)"
      - "traefik.http.routers.wordpress.entrypoints=websecure"
      - "traefik.http.routers.wordpress.tls.certresolver=${CERT_RESOLVER}"
    networks:
      - web

  mysql:
    image: mysql:8
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql:/var/lib/mysql
    networks:
      - web

  adminer:
    image: adminer
    container_name: adminer
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.adminer.rule=Host(`adminer.${DOMAIN}`)"
      - "traefik.http.routers.adminer.entrypoints=websecure"
      - "traefik.http.routers.adminer.tls.certresolver=${CERT_RESOLVER}"
    networks:
      - web

  redis:
    image: redis:alpine
    container_name: redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis:/data
    networks:
      - web

networks:
  web:
    driver: bridge

volumes:
  wordpress:
  mysql:
  redis:
  letsencrypt:
```

## Frontend Dockerfile

Create a `Dockerfile` in your frontend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

## Usage

1. Create all necessary files as shown above
2. Configure your domain DNS settings to point to your server
3. Start the services:

```bash
docker-compose up -d
```

## Access Points

- Frontend: https://yourdomain.com
- WordPress API: https://api.yourdomain.com
- Adminer: https://adminer.yourdomain.com

## Notes

- Make sure to replace `your@email.com` in the Traefik configuration with your actual email
- Update the domain in `.env` file to match your actual domain
- The WordPress installation will be available at first run through api.yourdomain.com
- Adminer will be accessible for database management through adminer.yourdomain.com
- SSL certificates will be automatically generated by Let's Encrypt

## Security Considerations

- All sensitive information is stored in the `.env` file
- SSL/TLS certificates are automatically managed by Traefik
- Redis is password protected
- MySQL uses separate user credentials
- Traefik's dashboard is disabled for security

Remember to add `.env` to your `.gitignore` file to prevent committing sensitive information to version control.
