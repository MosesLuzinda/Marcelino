import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@marcelino/shared";
import { AppError } from "./errorHandler.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateJWT(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.accessToken;

  if (!token) return next(new AppError(401, "Authentication required"));

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requirePermission(...required: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, "Authentication required"));

    const perms = req.user.permissions || [];
    if (perms.includes("*")) return next();

    const hasPermission = required.some((p) => perms.includes(p));
    if (!hasPermission) return next(new AppError(403, "Insufficient permissions"));

    next();
  };
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, "Authentication required"));

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) return next(new AppError(403, "Insufficient role"));

    next();
  };
}
