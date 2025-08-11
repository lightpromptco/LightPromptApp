import type { Request, Response, NextFunction } from "express";

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        name?: string;
      };
    }
  }
}

// Simple authentication middleware (replace with real auth later)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // For development, simulate authentication
  // In production, this would verify JWT tokens or session data
  const authHeader = req.headers.authorization;
  const userId = req.headers['x-user-id'] as string;
  
  if (userId) {
    req.user = {
      id: userId,
      email: req.headers['x-user-email'] as string,
      name: req.headers['x-user-name'] as string
    };
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
}

// Optional auth middleware - sets user if present but doesn't require it
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string;
  
  if (userId) {
    req.user = {
      id: userId,
      email: req.headers['x-user-email'] as string,
      name: req.headers['x-user-name'] as string
    };
  }
  
  next();
}