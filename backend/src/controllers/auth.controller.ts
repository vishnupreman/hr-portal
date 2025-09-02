import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../models/User";


export class AuthController {
  // ----------------- REGISTER -----------------
  static async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await AuthService.register(email, password, role);

      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        requiresVerification: true, 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // ----------------- LOGIN -----------------
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
       const { accessToken, refreshToken, role } = await AuthService.login(email, password);

      // Save refreshToken in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken, role });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      await AuthService.verifyOtp(email, otp);
      res.json({ message: "Email verified successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.json({ message: "Password reset OTP sent to your email" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

    static async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      console.log(req.body,'from the reset password controller')
      await AuthService.resetPassword(email, otp, newPassword);
      res.json({ message: "Password has been reset successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // ----------------- REFRESH -----------------
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const token = await AuthService.refresh(refreshToken);
      res.json(token);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  // ----------------- LOGOUT -----------------
  static async logout(req: Request, res: Response) {
    try {
      await AuthService.logout();
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
