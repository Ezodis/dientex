# Development Dockerfile for Next.js frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Note: Source code is mounted from host via volume in development.yml
# This allows for hot-reloading during development

# Expose port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
