# Bright Wave Enterprise Security Architecture

## Overview
Bright Wave implements defense-in-depth security mechanisms designed to protect customer consultation data, administrative access, and AI integrations against modern web vulnerabilities.

---

## Security Features & Implementations

### 1. Authentication & Session Security
- **JWT Access Tokens**: Short-lived (15 minutes expiry) signed using HMAC SHA-256 (`JWT_SECRET`).
- **Refresh Tokens**: Long-lived (7 days expiry) stored in persistent database store (`JWT_REFRESH_SECRET`). Supports token rotation and immediate administrative revocation.
- **Bcrypt Password Hashing**: Passwords stored using 12 salt rounds (`bcryptjs`).
- **Role-Based Access Control (RBAC)**: Endpoint authorization enforced via `requireRole("admin", "editor")` middleware.

### 2. HTTP Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### 3. Rate Limiting Protection
- `/api/admin/login`: Maximum 5 requests per minute per IP.
- `/api/chat`: Maximum 30 requests per minute per IP.
- `/api/leads` and `/api/messages`: Maximum 10 submissions per minute per IP.

### 4. Input Sanitization & Anti-XSS
- All user inputs processed through HTML entity escaping (`sanitizeInput`) before saving to database or forwarding to Gemini LLM prompts.

### 5. Persistent Audit Logging
- Every authentication attempt, lead submission, CMS mutation, and AI chat query writes a structured audit log entry containing `timestamp`, `ip`, `user_id`, `action`, and `resource`.

### 6. Container Security
- Dockerfile runs as an isolated non-root system user (`brightwave`).
