# Stage 1: Build React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built artifacts from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# OCI Image annotations
LABEL org.opencontainers.image.title="Secure Systems Frontend" \
      org.opencontainers.image.description="React application for secure systems" \
      org.opencontainers.image.vendor="FIAP" \
      org.opencontainers.image.source="https://github.com/yourusername/secure-systems-frontend"
