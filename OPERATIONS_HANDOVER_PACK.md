# Bright Wave Enterprise - Operations & Engineering Handover Pack

> **Document Version:** 1.0.0  
> **Last Updated:** July 22, 2026  
> **Author:** Enterprise Systems Engineering Team  
> **Target Audience:** Site Reliability Engineers, DevOps Engineers, and System Architects (5+ Year Long-Term Maintenance Horizon)

---

## 1. Project Architecture Diagram

### System Architecture Topology

```
                                +---------------------------------------------------+
                                |                  Client Browser                   |
                                |     React 18 SPA (Tailwind CSS, Motion, Lucide)   |
                                +-------------------------+-------------------------+
                                                          |
                                           HTTPS / REST & WS (Port 443/80)
                                                          |
                                                          v
                                +---------------------------------------------------+
                                |             Nginx Reverse Proxy / WAF             |
                                |      (Rate Limiting, TLS Termination, Headers)    |
                                +-------------------------+-------------------------+
                                                          |
                                             Reverse Proxy (Port 3000)
                                                          |
                                                          v
                                +---------------------------------------------------+
                                |            Express.js / Node.js Runtime            |
                                |            (Security Headers, Auth Middleware)    |
                                +----+--------------------+--------------------+----+
                                     |                    |                    |
                                     v                    v                    v
                        +--------------------+  +-------------------+  +--------------------+
                        |  Database Engine   |  | Auth Engine & JWT |  | Google Gemini AI   |
                        | (Atomic Persistent |  | (Access 15m /     |  | (SDK Client via    |
                        | JSON / Postgres)   |  | Refresh 7d, RBAC) |  | GEMINI_API_KEY)    |
                        +--------------------+  +-------------------+  +--------------------+
```

### Component Description
1. **Client Tier**: Single Page Application built with React 18, Vite, Tailwind CSS, and Lucide Icons. Transpiled to optimized static assets in `/dist`.
2. **Reverse Proxy Tier**: Nginx container enforcing security headers (`X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`), rate limits, and SSL termination.
3. **Application Tier**: Express.js web server running on Node.js 20 LTS. Handles RESTful routing, authentication verification, rate limiting, and input sanitization.
4. **Data Engine**: File-backed persistent storage engine (`src/db/database.ts`) with atomic file writes, indexed lookups, and transaction safety.
5. **AI Services**: Google Gemini 3.5 Flash integration via `@google/genai` for localized NLP client assistance.

---

## 2. Folder Structure Explanation

```
/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI workflow (Lint, Vitest, Docker Build)
├── data/
│   └── brightwave_db.json         # Primary persistent database store (auto-generated)
├── src/
│   ├── components/                # React UI view components
│   │   ├── AdminDashboard.tsx     # Enterprise CMS, CRM, and Executive Metrics Cockpit
│   │   ├── AIAssistant.tsx        # Gemini AI Chat widget
│   │   ├── Blog.tsx               # Technical thought leadership feed
│   │   ├── Contact.tsx            # Interactive lead capture form
│   │   ├── Footer.tsx             # Footer layout
│   │   ├── Hero.tsx               # Hero display section
│   │   ├── Navbar.tsx             # Global navigation bar
│   │   ├── Portfolio.tsx          # Case study gallery
│   │   ├── Pricing.tsx            # Enterprise engagement tier estimator
│   │   ├── Services.tsx           # Technical capabilities display
│   │   └── Testimonials.tsx       # Enterprise client quotes
│   ├── db/
│   │   └── database.ts            # Persistent Database Engine class with ACID file locks
│   ├── middleware/
│   │   └── auth.ts                # JWT verification & RBAC authorization middleware
│   ├── App.tsx                    # Top-level React routing and state container
│   ├── main.tsx                   # Client entry point
│   └── index.css                  # Global Tailwind CSS imports
├── tests/
│   └── api.test.ts                # Automated Supertest & Vitest integration test suite
├── .dockerignore                  # Build context exclusion list
├── .env.example                   # Environment variable template
├── API.md                         # Detailed API reference documentation
├── DEPLOYMENT.md                  # Container & bare-metal deployment procedures
├── Dockerfile                     # Multi-stage security-hardened Docker build script
├── docker-compose.yml             # Orchestration for App + Nginx services
├── nginx.conf                     # Production Nginx reverse proxy configuration
├── package.json                   # NPM dependencies and execution scripts
├── SECURITY.md                    # Platform security architecture documentation
├── server.ts                      # Express.js backend server entry point
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundle configuration
```

---

## 3. Environment Variables

| Variable Name | Required | Default / Fallback | Description |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Execution environment (`development`, `production`, `test`). Controls Vite middleware vs static file serving. |
| `PORT` | Yes | `3000` | Internal server binding port. Hardcoded ingress expected by Cloud Run / Reverse Proxy. |
| `JWT_SECRET` | Yes | `Required in Prod` | 256-bit cryptographic key used to sign short-lived (15 min) JWT access tokens. |
| `JWT_REFRESH_SECRET` | Yes | `Required in Prod` | 256-bit key used to sign long-lived (7 day) JWT refresh tokens. |
| `GEMINI_API_KEY` | Yes | `None` | Google Gemini API key used for AI Chat assistant (`/api/chat`). Server-side only. |
| `ADMIN_PASSWORD` | No | `BrightWave2026!Enterprise` | Initial bootstrap password for `admin@brightwave.ug`. |

---

## 4. Backup and Restore Procedure

### Automated Data Backup
The persistent state is saved atomically at `./data/brightwave_db.json`.

#### Daily Backup Cron Job
Add the following job to `/etc/crontab` on the host server:

```bash
# Daily backup at 02:00 AM UTC
0 2 * * * root tar -czf /backups/brightwave_db_$(date +\%Y\%m\%d_\%H\%M\%S).tar.gz -C /app/data brightwave_db.json
```

### Manual Backup Command
```bash
docker exec brightwave_app tar -czf - -C /app/data brightwave_db.json > ./backups/manual_backup_$(date +%s).tar.gz
```

### Data Restore Procedure
1. **Stop Application Container**:
   ```bash
   docker-compose stop app
   ```
2. **Extract Backup File**:
   ```bash
   tar -xzf ./backups/brightwave_db_20260722_020000.tar.gz -C ./data/
   ```
3. **Restart Application Container**:
   ```bash
   docker-compose start app
   ```
4. **Verify Database Integrity**:
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## 5. Database Migration Plan (JSON to PostgreSQL)

When transaction concurrency exceeds 10,000 active daily writers, migrate to PostgreSQL using the following execution path:

### Step 1: Provision PostgreSQL Container / Database
```bash
docker run --name brightwave_pg -e POSTGRES_DB=brightwave_db -e POSTGRES_PASSWORD=SecurePass2026! -p 5432:5432 -d postgres:16-alpine
```

### Step 2: DDL Schema Mapping
```sql
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    refresh_token TEXT,
    reset_token VARCHAR(255),
    reset_token_expiry BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(64),
    service VARCHAR(255),
    budget VARCHAR(128),
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_items (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    client VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    challenge TEXT,
    solution TEXT,
    business_impact TEXT,
    image TEXT,
    technologies JSONB,
    gallery JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_email VARCHAR(255),
    action VARCHAR(128) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    ip VARCHAR(64) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Migration Execution Script
Run a migration utility script that reads `brightwave_db.json` and performs batch `INSERT` operations using `pg-promise` or `drizzle-orm`.

---

## 6. Deployment Checklist

- [ ] Environment variables verified in `.env` (`JWT_SECRET`, `GEMINI_API_KEY`).
- [ ] TypeScript type-checking completes cleanly (`npm run lint`).
- [ ] Automated Vitest unit & integration tests pass 100% (`npm test`).
- [ ] Build outputs generated cleanly in `/dist` (`npm run build`).
- [ ] Docker container image builds cleanly without warnings (`docker build -t brightwave:latest .`).
- [ ] Nginx configuration passes validation (`nginx -t`).
- [ ] Health check endpoint `/api/health` returns HTTP 200 OK.
- [ ] Non-root container user verified (`USER brightwave`).

---

## 7. Rollback Procedure

If a deployed version exhibits high error rates or runtime anomalies:

1. **Revert Docker Image Tag**:
   ```bash
   docker-compose down
   docker tag brightwave:previous brightwave:latest
   docker-compose up -d
   ```
2. **Revert Git Release Tag**:
   ```bash
   git checkout tags/v1.0.0-stable
   npm ci
   npm run build
   docker-compose up --build -d
   ```
3. **Verify Operational Status**:
   ```bash
   curl -I http://localhost:3000/api/health
   ```

---

## 8. Monitoring and Logging Guide

### Application Log Formats
All HTTP requests and audit events generate structured stdout logs:
```
[2026-07-22T06:00:00.000Z] ACTION: LOGIN_SUCCESS | USER: admin@brightwave.ug | IP: 127.0.0.1
```

### Collecting Logs
To aggregate container logs:
```bash
docker logs -f --tail 100 brightwave_app
```

### Key Performance Metrics to Monitor
- **HTTP 5xx Error Rate**: Must remain below 0.1%.
- **P95 Latency**: REST API endpoints should respond in under 50ms.
- **Node.js Heap Memory**: Alert if heap memory usage exceeds 400 MB.
- **Process Uptime**: Monitor via `/api/health`.

---

## 9. Disaster Recovery Procedure

### Scenario: Total Server Failure / Host Crash
1. **Provision New Compute Node** (Ubuntu 24.04 LTS / Cloud Run container).
2. **Clone Code Repository**:
   ```bash
   git clone https://github.com/brightwave/brightwave-platform.git /app
   cd /app
   ```
3. **Restore Last Known Valid Database Backup**:
   ```bash
   mkdir -p ./data
   cp /external_backups/brightwave_db_latest.json ./data/brightwave_db.json
   ```
4. **Deploy Containers**:
   ```bash
   docker-compose up -d
   ```
5. **Reroute DNS**: Update A Records to point to new host IP.

---

## 10. Maintenance Schedule

| Interval | Task | Target Component |
| :--- | :--- | :--- |
| **Daily** | Automated DB Backup Verification & Health Log Scan | Data Engine / Disk |
| **Weekly** | Review Security Audit Logs (`audit_logs`) | CRM & Auth |
| **Monthly** | NPM Dependency Vulnerability Scan (`npm audit`) | Package Manifest |
| **Quarterly** | Full System Stress Test & Disaster Recovery Simulation | Infra / Load Balancers |
| **Annually** | Cryptographic Key Rotation (`JWT_SECRET`, SSL Certs) | Authentication Engine |

---

## 11. Dependency Update Policy

1. **Patch Updates (`1.0.x`)**: Auto-approved after CI pipeline execution.
2. **Minor Updates (`1.x.0`)**: Tested in staging for 48 hours prior to production release.
3. **Major Updates (`2.0.0`)**: Requires dedicated regression testing and architecture review.
4. **Command**:
   ```bash
   npm audit fix
   npm update
   ```

---

## 12. Security Update Checklist

- [ ] Keep Node.js base image updated in `Dockerfile` (`FROM node:20-alpine`).
- [ ] Enforce strict CORS and Security Headers in Express & Nginx.
- [ ] Rotate `JWT_SECRET` and `JWT_REFRESH_SECRET` periodically.
- [ ] Verify that `GEMINI_API_KEY` is NEVER committed to Git or exposed in client bundles.
- [ ] Enforce rate limits on all auth and mutation routes.

---

## 13. API Reference Summary

Refer to `API.md` for complete schema definitions. Key routes:
- `GET /api/health` - Platform health check.
- `POST /api/chat` - Gemini AI chat interaction.
- `POST /api/leads` - Lead consultation form submission.
- `POST /api/admin/login` - Executive authentication.
- `GET /api/admin/metrics` - Admin dashboard analytics.

---

## 14. Admin User Guide

1. **Access Cockpit**: Navigate to `http://<domain>/` and click **Portal** in the navigation header (or footer).
2. **Login Credentials**:
   - **Email**: `admin@brightwave.ug`
   - **Password**: Set via environment variable `ADMIN_PASSWORD`.
3. **Manage Leads**: View incoming client requests, update status (`new`, `contacted`, `qualified`, `closed`), or delete entries.
4. **Content Management**: Create, edit, and publish portfolio case studies, blog posts, and testimonials.
5. **Password Reset**: Use the **Forgot Password** link on the login modal to receive a reset token.

---

## 15. Troubleshooting Guide for Production Issues

### Issue 1: High Latency or 504 Gateway Timeout
- **Cause**: AI Gemini API or underlying network bottleneck.
- **Resolution**: Check system CPU/RAM using `docker stats`. Restart server container if memory leaked: `docker-compose restart app`.

### Issue 2: "Unauthorized: Missing authentication token"
- **Cause**: Client token expired (15-minute TTL) and refresh token failed to exchange.
- **Resolution**: Log out and log back in to obtain fresh JWT tokens.

### Issue 3: Persistent Data Not Saving
- **Cause**: File permission error on `./data` directory.
- **Resolution**: Grant ownership to non-root container user: `chown -R 1000:1000 ./data`.

---
*Operations Handover Pack Certified Ready for Deployment.*
