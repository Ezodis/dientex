# Development Dockerfile for Next.js frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies will be done via volume mount
# The source code is mounted from the host via volume in development.yml

# Expose port
EXPOSE 3000

# Run in development mode
# Note: The actual installation happens on first run via the volume
CMD ["sh", "-c", "npm install && npm run dev"]
