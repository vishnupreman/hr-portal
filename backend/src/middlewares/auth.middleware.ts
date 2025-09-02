import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../models/User";

// Extend Express Request type locally for middleware
export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string; role: UserRole };
}

// Authentication middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing from environment");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload & { id: string; role: UserRole };
    console.log(decoded,'from teh middleware')
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Authorization middleware
export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
