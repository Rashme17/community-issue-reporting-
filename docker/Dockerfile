# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 -G nodejs

# Change ownership of app directory to reactuser
RUN chown -R reactuser:nodejs /app

# Create uploads directory for file handling (if needed)
RUN mkdir -p /app/uploads && chown -R reactuser:nodejs /app/uploads

# Switch to non-root user
USER reactuser

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start React development server with proper host binding
CMD ["npm", "start"]