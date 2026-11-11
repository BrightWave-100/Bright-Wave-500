# Bright Wave Enterprise Deployment Guide

This document outlines the step-by-step procedures for deploying Bright Wave to production environments handling high traffic volume.

---

## Prerequisites

- **Docker & Docker Compose**: Version 20.10+ and Compose v2.0+
- **Node.js**: Node 20.x LTS or higher
- **Domain & SSL Certificates**: Nginx reverse proxy configured for TLS 1.3

---

## Environment Variable Configuration

Create `.env` in the project root:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=brightwave_prod_jwt_access_secret_key_2026_x89a
JWT_REFRESH_SECRET=brightwave_prod_jwt_refresh_secret_key_2026_z91b
GEMINI_API_KEY=your_production_gemini_api_key_here
ADMIN_PASSWORD=BrightWave2026!Enterprise
```

---

## Containerized Deployment (Recommended)

1. **Build and launch multi-stage Docker containers**:
   ```bash
   docker-compose up --build -d
   ```

2. **Verify container health status**:
   ```bash
   docker-compose ps
   curl http://localhost/api/health
   ```

3. **View live container logs**:
   ```bash
   docker-compose logs -f app
   ```

---

## Bare-Metal / Virtual Machine Deployment

1. **Install dependencies and build production assets**:
   ```bash
   npm ci
   npm run build
   ```

2. **Launch Node.js single-file CommonJS production server**:
   ```bash
   NODE_ENV=production PORT=3000 node dist/server.cjs
   ```

---

## Data Backup & Persistence

- Persistent database records are atomically stored in `./data/brightwave_db.json`.
- Backup script cron job:
  ```bash
  0 2 * * * cp /app/data/brightwave_db.json /backups/brightwave_db_$(date +\%F).json
  ```
