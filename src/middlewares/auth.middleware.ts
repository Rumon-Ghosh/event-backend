import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // verify token
    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as any;

    // ✅ ADD HERE
    (req as any).user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};