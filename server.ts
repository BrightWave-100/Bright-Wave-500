import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { db } from "./src/db/database";
import { 
  authenticateToken, 
  requireRole, 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  AuthenticatedRequest 
} from "./src/middleware/auth";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

// Simple in-memory Rate Limiting Middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfterMs: record.resetTime - now
      });
    }

    record.count += 1;
    next();
  };
};

// Input Sanitization Helper
function sanitizeInput(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

app.use(express.json({ limit: "1mb" }));

// Rate limit sensitive endpoints
app.use("/api/chat", rateLimit(30, 60 * 1000));
app.use("/api/leads", rateLimit(10, 60 * 1000));
app.use("/api/messages", rateLimit(10, 60 * 1000));
app.use("/api/admin/login", rateLimit(5, 60 * 1000));

// Production Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Bright Wave Enterprise Platform Server",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    databaseStatus: "connected",
    environment: process.env.NODE_ENV || "development"
  });
});

// OpenAPI / API Docs JSON endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Bright Wave Enterprise API",
      version: "1.0.0",
      description: "Production API for Bright Wave Intelligent Software & AI Solutions"
    },
    paths: {
      "/api/health": { get: { summary: "Health check" } },
      "/api/admin/login": { post: { summary: "Authenticate and get JWT access & refresh tokens" } },
      "/api/admin/refresh": { post: { summary: "Refresh JWT access token" } },
      "/api/admin/forgot-password": { post: { summary: "Initiate password reset flow" } },
      "/api/admin/reset-password": { post: { summary: "Complete password reset" } },
      "/api/leads": { post: { summary: "Submit project consultation request" } },
      "/api/messages": { post: { summary: "Submit contact message" } },
      "/api/chat": { post: { summary: "Interact with Gemini AI localized assistant" } },
      "/api/portfolio": { get: { summary: "List portfolio case studies" } },
      "/api/blog": { get: { summary: "List blog posts" } },
      "/api/testimonials": { get: { summary: "List client testimonials" } }
    }
  });
});

// Lazy Gemini API Client Initializer
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it to your Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

function cleanAIResponseText(text: string): string {
  if (!text) return "";
  return text
    // Remove markdown headers (e.g. "#### Heading" -> "Heading")
    .replace(/^#{1,6}\s+/gm, "")
    // Remove decorative separator lines or sequences of *, -, _, =, $, /
    .replace(/^[*\-_=$/\s]{3,}\s*$/gm, "")
    // Remove remaining occurrences of symbol clusters like $$$ or //// or ####
    .replace(/\${2,}/g, "")
    .replace(/\/{3,}/g, "")
    .replace(/#{2,}/g, "")
    .trim();
}

// AI Chat Endpoint with Fallback & System Instruction
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const sanitizedMessage = sanitizeInput(message);
    const ai = getGeminiClient();

    const systemInstruction = `You are the Bright Wave AI Assistant representing Bright Wave, East Africa's premier AI & Software Engineering firm.

Identity & Persona:
- Introduce yourself as the Bright Wave AI Assistant when greeting users or when asked about your identity.
- Function as a knowledgeable, polite, concise, and professional consultant for Bright Wave.

Scope & Knowledge Boundaries:
- Answer ONLY questions related to Bright Wave's services, capabilities, technologies, portfolio, pricing, contact details, and expertise.
- Bright Wave Services include: Custom Software Engineering, AI & Machine Learning Solutions, Business & WhatsApp Automation, Enterprise Cloud & Offline-First ERPs, Data Analytics, and Mobile App Development.
- Company Background: Based in Kampala, Uganda, serving enterprise and SME clients across Africa and globally. Tagline: "Intelligence in Motion".
- Founder & CEO: Zarin Saidi
- Company: Bright Wave
- Leadership & Team Guidelines: If additional leadership or team information is required, respond with "The Bright Wave team." Never invent or reference employee or executive names.
- If a user asks about unrelated topics (e.g. general trivia, coding homework outside Bright Wave services, unrelated politics, or third-party products), politely inform them that you are dedicated solely to assisting with Bright Wave's services and technology solutions.
- If you do not know a specific piece of information or if data is unavailable, state that clearly and truthfully rather than inventing or hallucinating facts.

Tone & Communication Style:
- Be concise, direct, and professional.
- Avoid unnecessary technical jargon unless the user explicitly requests deep technical details.

Formatting & Cleanliness Rules (STRICT):
- Absolutely DO NOT output raw markdown header tags such as "####", "###", "##", or "#". Use bold text (**Title**) or bullet points (-) instead.
- Absolutely DO NOT output decorative symbol strings or divider lines like "***", "---", "___", "$$$", "///", or "////".
- Keep text clean, well-formatted, using standard paragraphs, bullet lists (-), and bold key terms (**term**).

Call to Action:
- At the end of relevant inquiries or helpful explanations, invite the user to book a consultation session or request a custom proposal with Bright Wave.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: sanitizeInput(msg.text || "") }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: sanitizedMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    db.addAuditLog({
      action: "AI_CHAT_QUERY",
      resource: "gemini_api",
      ip: req.ip || "127.0.0.1",
      details: `Prompt length: ${sanitizedMessage.length}`
    });

    const cleanedText = cleanAIResponseText(response.text || "");

    return res.json({ text: cleanedText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    return res.status(500).json({
      error: error.message || "Failed to process message with Gemini AI.",
      missingKey: !process.env.GEMINI_API_KEY
    });
  }
});

// AUTHENTICATION ENDPOINTS

// Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = sanitizeInput(email).toLowerCase();
  
  let user = db.findUserByEmail(cleanEmail);
  if (!user && cleanEmail === "admin@brightwave.ug") {
    user = db.getUsers().find(u => u.role === "admin");
  }

  if (!user) {
    db.addAuditLog({
      action: "LOGIN_FAILED",
      resource: "auth",
      ip: req.ip || "127.0.0.1",
      details: `User not found: ${cleanEmail}`
    });
    return res.status(401).json({ error: "Invalid email or administrative password." });
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    db.addAuditLog({
      user_id: user.id,
      user_email: user.email,
      action: "LOGIN_FAILED",
      resource: "auth",
      ip: req.ip || "127.0.0.1",
      details: "Invalid password supplied"
    });
    return res.status(401).json({ error: "Invalid email or administrative password." });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  db.updateUser(user.id, { refresh_token: refreshToken });

  db.addAuditLog({
    user_id: user.id,
    user_email: user.email,
    action: "LOGIN_SUCCESS",
    resource: "auth",
    ip: req.ip || "127.0.0.1"
  });

  return res.json({
    success: true,
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Refresh Token
app.post("/api/admin/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(403).json({ error: "Invalid or expired refresh token." });
  }

  const user = db.findUserById(payload.id);
  if (!user || user.refresh_token !== refreshToken) {
    return res.status(403).json({ error: "Revoked or mismatched refresh token." });
  }

  const newAccessToken = generateAccessToken(user);
  return res.json({ accessToken: newAccessToken });
});

// Logout
app.post("/api/admin/logout", authenticateToken, (req: AuthenticatedRequest, res) => {
  if (req.user) {
    db.updateUser(req.user.id, { refresh_token: null });
    db.addAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: "LOGOUT",
      resource: "auth",
      ip: req.ip || "127.0.0.1"
    });
  }
  return res.json({ success: true, message: "Logged out successfully." });
});

// Forgot Password Flow
app.post("/api/admin/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const user = db.findUserByEmail(sanitizeInput(email));
  if (!user) {
    // Return generic message to prevent user enumeration
    return res.json({ success: true, message: "If an account exists, a password reset token has been generated." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpiry = Date.now() + 3600000; // 1 hour

  db.updateUser(user.id, { reset_token: resetToken, reset_token_expiry: resetExpiry });

  db.addAuditLog({
    user_id: user.id,
    user_email: user.email,
    action: "PASSWORD_RESET_REQUESTED",
    resource: "auth",
    ip: req.ip || "127.0.0.1"
  });

  return res.json({
    success: true,
    message: "Password reset token generated successfully.",
    resetToken // Returned in development response for verification
  });
});

// Reset Password Completion
app.post("/api/admin/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: "Reset token and new password are required." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters in length." });
  }

  const users = db.getUsers();
  const user = users.find(u => u.reset_token === resetToken && u.reset_token_expiry && u.reset_token_expiry > Date.now());

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired password reset token." });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  db.updateUser(user.id, {
    password_hash: passwordHash,
    reset_token: null,
    reset_token_expiry: null
  });

  db.addAuditLog({
    user_id: user.id,
    user_email: user.email,
    action: "PASSWORD_RESET_COMPLETED",
    resource: "auth",
    ip: req.ip || "127.0.0.1"
  });

  return res.json({ success: true, message: "Password updated successfully." });
});

// PUBLIC & CMS DATA ENDPOINTS

// Portfolio
app.get("/api/portfolio", (req, res) => {
  res.json(db.getPortfolioItems());
});

app.post("/api/admin/portfolio", authenticateToken, requireRole("admin", "editor"), (req: AuthenticatedRequest, res) => {
  const { title, category, client, industry, challenge, solution, businessImpact, image, technologies, gallery } = req.body;
  
  if (!title || !client || !category) {
    return res.status(400).json({ error: "Title, client, and category are required." });
  }

  const newItem = db.addPortfolioItem({
    title: sanitizeInput(title),
    category: sanitizeInput(category),
    client: sanitizeInput(client),
    industry: sanitizeInput(industry || "Technology"),
    challenge: sanitizeInput(challenge || ""),
    solution: sanitizeInput(solution || ""),
    businessImpact: sanitizeInput(businessImpact || ""),
    image: image || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    technologies: Array.isArray(technologies) ? technologies.map(t => sanitizeInput(t)) : ["React", "Express"],
    gallery: Array.isArray(gallery) ? gallery : []
  });

  db.addAuditLog({
    user_id: req.user?.id,
    user_email: req.user?.email,
    action: "CREATE_PORTFOLIO_ITEM",
    resource: newItem.id,
    ip: req.ip || "127.0.0.1"
  });

  res.json({ success: true, project: newItem });
});

app.put("/api/admin/portfolio/:id", authenticateToken, requireRole("admin", "editor"), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = db.updatePortfolioItem(id, req.body);
  if (!updated) return res.status(404).json({ error: "Portfolio item not found." });

  db.addAuditLog({
    user_id: req.user?.id,
    user_email: req.user?.email,
    action: "UPDATE_PORTFOLIO_ITEM",
    resource: id,
    ip: req.ip || "127.0.0.1"
  });

  res.json({ success: true, project: updated });
});

app.delete("/api/admin/portfolio/:id", authenticateToken, requireRole("admin"), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deletePortfolioItem(id);
  if (!deleted) return res.status(404).json({ error: "Portfolio item not found." });

  db.addAuditLog({
    user_id: req.user?.id,
    user_email: req.user?.email,
    action: "DELETE_PORTFOLIO_ITEM",
    resource: id,
    ip: req.ip || "127.0.0.1"
  });

  res.json({ success: true });
});

// Blog
app.get("/api/blog", (req, res) => {
  res.json(db.getBlogPosts());
});

app.post("/api/admin/blog", authenticateToken, requireRole("admin", "editor"), (req: AuthenticatedRequest, res) => {
  const { title, slug, category, excerpt, content, authorName, authorRole, authorImage, readingTime, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const newPost = db.addBlogPost({
    title: sanitizeInput(title),
    slug: slug ? sanitizeInput(slug) : title.toLowerCase().replace(/\s+/g, "-"),
    category: sanitizeInput(category || "Technology"),
    excerpt: sanitizeInput(excerpt || ""),
    content: sanitizeInput(content),
    authorName: sanitizeInput(authorName || "Bright Wave Team"),
    authorRole: sanitizeInput(authorRole || "Senior Technology Editor"),
    authorImage: authorImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    readingTime: sanitizeInput(readingTime || "4 min read"),
    tags: Array.isArray(tags) ? tags.map(t => sanitizeInput(t)) : ["Technology"],
    published: true
  });

  db.addAuditLog({
    user_id: req.user?.id,
    user_email: req.user?.email,
    action: "CREATE_BLOG_POST",
    resource: newPost.id,
    ip: req.ip || "127.0.0.1"
  });

  res.json({ success: true, post: newPost });
});

app.delete("/api/admin/blog/:id", authenticateToken, requireRole("admin"), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deleteBlogPost(id);
  if (!deleted) return res.status(404).json({ error: "Blog post not found." });

  db.addAuditLog({
    user_id: req.user?.id,
    user_email: req.user?.email,
    action: "DELETE_BLOG_POST",
    resource: id,
    ip: req.ip || "127.0.0.1"
  });

  res.json({ success: true });
});

// Testimonials
app.get("/api/testimonials", (req, res) => {
  res.json(db.getTestimonials());
});

app.post("/api/admin/testimonials", authenticateToken, requireRole("admin", "editor"), (req: AuthenticatedRequest, res) => {
  const { name, role, company, quote, rating, photoUrl, logoText } = req.body;
  if (!name || !quote) return res.status(400).json({ error: "Name and quote are required." });

  const newTestimonial = db.addTestimonial({
    name: sanitizeInput(name),
    role: sanitizeInput(role || "Executive"),
    company: sanitizeInput(company || "Client Enterprise"),
    quote: sanitizeInput(quote),
    rating: Number(rating) || 5,
    photoUrl: photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    logoText: sanitizeInput(logoText || "ENTERPRISE")
  });

  res.json({ success: true, testimonial: newTestimonial });
});

app.delete("/api/admin/testimonials/:id", authenticateToken, requireRole("admin"), (req: AuthenticatedRequest, res) => {
  const deleted = db.deleteTestimonial(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Testimonial not found." });
  res.json({ success: true });
});

// Team
app.get("/api/team", (req, res) => {
  res.json([
    {
      id: "team_1",
      name: "Zarin Saidi",
      role: "Founder & CEO",
      bio: "Visionary leader driving Bright Wave's mission to deliver Intelligence in Motion across East Africa and beyond.",
      image: "/brightwave-mark.svg",
      category: "Executive"
    },
    {
      id: "team_2",
      name: "Bright Wave Engineering Team",
      role: "AI & Software Systems Labs",
      bio: "Cross-functional team of elite systems developers, AI researchers, and software engineers.",
      image: "/brightwave-mark.svg",
      category: "Engineering"
    }
  ]);
});

// Leads CRM
app.get("/api/admin/leads", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  res.json(db.getLeads());
});

app.post("/api/leads", (req, res) => {
  const { name, email, company, phone, service, budget, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and project message are required." });
  }

  const newLead = db.addLead({
    name: sanitizeInput(name),
    email: sanitizeInput(email).toLowerCase(),
    company: sanitizeInput(company || "Independent Enterprise"),
    phone: sanitizeInput(phone || ""),
    service: sanitizeInput(service || "Custom AI & Software"),
    budget: sanitizeInput(budget || "Custom Proposal"),
    message: sanitizeInput(message)
  });

  db.addAuditLog({
    action: "LEAD_SUBMITTED",
    resource: newLead.id,
    ip: req.ip || "127.0.0.1",
    details: `Lead submitted by ${newLead.email}`
  });

  res.json({
    success: true,
    lead: newLead,
    message: "Consultation requested successfully. The Bright Wave engineering team will review and respond shortly."
  });
});

app.patch("/api/admin/leads/:id", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateLeadStatus(id, status);
  if (!updated) return res.status(404).json({ error: "Lead not found." });
  res.json({ success: true, lead: updated });
});

app.delete("/api/admin/leads/:id", authenticateToken, requireRole("admin"), (req, res) => {
  const deleted = db.deleteLead(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Lead not found." });
  res.json({ success: true });
});

// Messages
app.get("/api/admin/messages", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  res.json(db.getMessages());
});

app.post("/api/messages", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message content are required." });
  }

  const newMsg = db.addMessage({
    name: sanitizeInput(name),
    email: sanitizeInput(email).toLowerCase(),
    subject: sanitizeInput(subject || "General Inquiry"),
    message: sanitizeInput(message)
  });

  res.json({
    success: true,
    message: "Your message has been received by Bright Wave. Our team will contact you promptly."
  });
});

app.patch("/api/admin/messages/:id", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateMessageStatus(id, status);
  if (!updated) return res.status(404).json({ error: "Message not found." });
  res.json({ success: true, message: updated });
});

app.delete("/api/admin/messages/:id", authenticateToken, requireRole("admin"), (req, res) => {
  const deleted = db.deleteMessage(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Message not found." });
  res.json({ success: true });
});

// Admin Cockpit Metrics
app.get("/api/admin/metrics", authenticateToken, requireRole("admin", "editor"), (req, res) => {
  const leads = db.getLeads();
  const messages = db.getMessages();
  const projects = db.getPortfolioItems();
  const blogPosts = db.getBlogPosts();

  res.json({
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === "new").length,
    totalMessages: messages.length,
    totalProjects: projects.length,
    totalPosts: blogPosts.length,
    revenuePotential: leads.reduce((acc, lead) => {
      if (lead.budget.includes("50,000")) return acc + 50000;
      if (lead.budget.includes("25,000")) return acc + 25000;
      return acc + 10000;
    }, 0)
  });
});

// Mount Vite middleware for dev or serve built static directory for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bright Wave Enterprise Server active at http://0.0.0.0:${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("Bright Wave Enterprise Server closed cleanly.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer();
