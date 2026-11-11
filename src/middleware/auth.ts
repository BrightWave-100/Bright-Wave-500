import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db, UserRecord } from "../db/database";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is required in production mode.");
    }
    return "brightwave-enterprise-jwt-access-secret-2026";
  }
  return secret;
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_REFRESH_SECRET environment variable is required in production mode.");
    }
    return "brightwave-enterprise-jwt-refresh-secret-2026";
  }
  return secret;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "admin" | "editor" | "user";
    name: string;
  };
}

export function generateAccessToken(user: UserRecord): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    getJwtSecret(),
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(user: UserRecord): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    getJwtRefreshSecret(),
    { expiresIn: "7d" }
  );
}

export function verifyRefreshToken(token: string): { id: string; email: string } | null {
  try {
    return jwt.verify(token, getJwtRefreshSecret()) as { id: string; email: string };
  } catch (err) {
    return null;
  }
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  // Fallback to cookie if present
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc: Record<string, string>, item) => {
      const [k, v] = item.trim().split("=");
      acc[k] = v;
      return acc;
    }, {});
    token = cookies["bw_access_token"];
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Expired or invalid authentication token" });
  }
}

export function requireRole(...roles: Array<"admin" | "editor" | "user">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User context unavailable" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden: Access restricted to roles [${roles.join(", ")}]. Current role: ${req.user.role}` 
      });
    }

    next();
  };
}
