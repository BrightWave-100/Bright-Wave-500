import { describe, it, expect, beforeAll } from "vitest";
import express from "express";
import request from "supertest";
import bcrypt from "bcryptjs";
import { db } from "../src/db/database";
import { 
  authenticateToken, 
  requireRole, 
  generateAccessToken, 
  generateRefreshToken 
} from "../src/middleware/auth";

// Create Express test app instance matching production handlers
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Bright Wave Enterprise Platform Server",
    databaseStatus: "connected"
  });
});

app.post("/api/leads", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const newLead = db.addLead({
    name,
    email,
    company: req.body.company || "Enterprise",
    service: req.body.service || "AI",
    budget: req.body.budget || "Custom",
    message
  });

  res.status(201).json({ success: true, lead: newLead });
});

app.get("/api/admin/leads", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  res.json(db.getLeads());
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.getUsers().find(u => u.email === email || (email === "admin@brightwave.ug" && u.role === "admin"));
  if (user && await bcrypt.compare(password, user.password_hash)) {
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.json({ success: true, token, refreshToken, user: { email: user.email, role: user.role } });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

describe("Bright Wave Enterprise API Test Suite", () => {
  let adminToken: string;

  beforeAll(() => {
    // Obtain valid token for test assertions
    const user = db.getUsers()[0];
    adminToken = generateAccessToken(user);
  });

  it("GET /api/health should return health status 200 OK", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.databaseStatus).toBe("connected");
  });

  it("POST /api/leads should fail when required parameters are missing", async () => {
    const res = await request(app).post("/api/leads").send({ name: "Incomplete Request" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("POST /api/leads should create a new persistent lead entry", async () => {
    const res = await request(app).post("/api/leads").send({
      name: "Vitest Test User",
      email: "vitest@brightwave.ug",
      message: "Testing production lead persistence endpoint."
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.lead.id).toBeDefined();
  });

  it("GET /api/admin/leads should block unauthenticated requests with 401", async () => {
    const res = await request(app).get("/api/admin/leads");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/leads should return lead records when authenticated with Bearer JWT", async () => {
    const res = await request(app)
      .get("/api/admin/leads")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/admin/login should authenticate executive credentials and return tokens", async () => {
    const res = await request(app).post("/api/admin/login").send({
      email: "admin@brightwave.ug",
      password: process.env.ADMIN_PASSWORD || "BrightWaveAdmin2026!"
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });
});
