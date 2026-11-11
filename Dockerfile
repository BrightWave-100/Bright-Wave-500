# Multi-stage Enterprise Dockerfile for Bright Wave Platform

# Stage 1: Dependency Installation & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Vite static bundle and Esbuild server.cjs bundle
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Create application non-root system user for security hardening
RUN addgroup -S brightwave && adduser -S brightwave -G brightwave

# Copy build artifacts and package.json from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Ensure persistence directory exists and possesses proper permissions
RUN mkdir -p /app/data && chown -R brightwave:brightwave /app

# Switch to non-root user
USER brightwave

# Expose production application port
EXPOSE 3000

# Health check instructions
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Launch production bundled server
CMD ["node", "dist/server.cjs"]
