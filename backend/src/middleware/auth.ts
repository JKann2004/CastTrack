import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { Role } from "@prisma/client";

export interface AuthPayload {
  userId: string;
  role: Role;
}

// Extend Express Request to include auth user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Requires a valid JWT. Returns 401 if missing or invalid.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Attaches user to req if a valid JWT is present, but does NOT block.
 * Use on routes that work for both logged-in and anonymous users.
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (token) {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
      req.user = payload;
    } catch {
      // Invalid token — just continue without user
    }
  }

  next();
};

/**
 * Requires user to have one of the specified roles.
 * Must be used AFTER requireAuth.
 */
export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

// ─── Helpers ────────────────────────────────────────────

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}
