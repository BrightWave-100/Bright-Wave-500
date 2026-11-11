# Bright Wave Enterprise API Documentation

## Overview
The Bright Wave Enterprise API powers custom AI solutions, lead pipeline CRM, contact messages, and CMS database management.

Base URL: `http://localhost:3000/api`

---

## Health & Documentation

### `GET /api/health`
Returns system status, database health, uptime, and node environment.
- **Response 200 OK**:
  ```json
  {
    "status": "ok",
    "service": "Bright Wave Enterprise Platform Server",
    "timestamp": "2026-07-21T18:00:00.000Z",
    "uptime": 124.5,
    "databaseStatus": "connected",
    "environment": "production"
  }
  ```

### `GET /api/docs`
Returns OpenAPI 3.0 specification in JSON format.

---

## Authentication Endpoints

### `POST /api/admin/login`
Authenticates executive credentials and generates JWT access & refresh tokens.
- **Request Body**:
  ```json
  {
    "email": "admin@brightwave.ug",
    "password": "<ADMIN_PASSWORD>"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "token": "<JWT_ACCESS_TOKEN>",
    "refreshToken": "<JWT_REFRESH_TOKEN>",
    "user": {
      "id": "usr_admin_001",
      "name": "Super Admin",
      "email": "admin@brightwave.ug",
      "role": "admin"
    }
  }
  ```

### `POST /api/admin/refresh`
Exchanges a valid refresh token for a new access token.
- **Request Body**: `{ "refreshToken": "<JWT_REFRESH_TOKEN>" }`

### `POST /api/admin/logout`
Revokes user refresh token (Requires `Authorization: Bearer <TOKEN>`).

### `POST /api/admin/forgot-password`
Initiates password reset flow and generates reset token.
- **Request Body**: `{ "email": "admin@brightwave.ug" }`

### `POST /api/admin/reset-password`
Completes password reset with reset token and new password.
- **Request Body**: `{ "resetToken": "<TOKEN>", "newPassword": "<NEW_SECURE_PASSWORD>" }`

---

## Public & AI Endpoints

### `POST /api/chat`
Sends user message to Gemini model with localized system instruction.
- **Request Body**:
  ```json
  {
    "message": "What custom software solutions does Bright Wave build in East Africa?",
    "history": []
  }
  ```

### `POST /api/leads`
Submits project consultation request to CRM.
- **Request Body**:
  ```json
  {
    "name": "Executive Client",
    "email": "client@enterprise.co.ug",
    "company": "Enterprise Client",
    "phone": "+256 781 132 887",
    "service": "AI Voice Assistant",
    "budget": "Custom",
    "message": "Requesting technical proposal for voice NLP integration."
  }
  ```

### `POST /api/messages`
Submits general contact message.

---

## Protected Administrative Endpoints
*(All endpoints below require header `Authorization: Bearer <JWT_ACCESS_TOKEN>`)*

- `GET /api/admin/metrics` - Fetch cockpit revenue and lead metrics
- `GET /api/admin/leads` - List all CRM project leads
- `PATCH /api/admin/leads/:id` - Update lead pipeline status
- `DELETE /api/admin/leads/:id` - Remove lead from database
- `GET /api/admin/messages` - List contact messages
- `POST /api/admin/portfolio` - Create portfolio case study
- `PUT /api/admin/portfolio/:id` - Update portfolio case study
- `DELETE /api/admin/portfolio/:id` - Delete portfolio case study
- `POST /api/admin/blog` - Create blog article
- `DELETE /api/admin/blog/:id` - Delete blog article
- `POST /api/admin/testimonials` - Create testimonial entry
- `DELETE /api/admin/testimonials/:id` - Delete testimonial entry
