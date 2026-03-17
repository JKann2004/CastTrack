import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas";
import { authService } from "../services/auth.service";
import { sendEmail } from "../utils/email";

export const authRouter = Router();

// Stricter rate limit on auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: "Too many attempts, please try again later." },
});

// ─── POST /api/auth/register ────────────────────────────

authRouter.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, displayName } = req.body;
      const user = await authService.register(email, password, displayName);

      return res.status(201).json({
        message: "Account created successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /api/auth/login ───────────────────────────────

authRouter.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      return res.json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /api/auth/forgot-password ─────────────────────

authRouter.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const resetToken = await authService.forgotPassword(email);

      // Send reset email if user exists (token will be undefined if not)
      if (resetToken) {
        const resetUrl = `${req.headers.origin || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        await sendEmail({
          to: email,
          subject: "CastTrack — Password Reset Request",
          text: `You requested a password reset.\n\nClick here to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, you can safely ignore this email.`,
          html: `
            <p>You requested a password reset.</p>
            <p><a href="${resetUrl}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          `,
        });
      }

      // Always return success to prevent user enumeration
      return res.json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /api/auth/reset-password ──────────────────────

authRouter.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);

      return res.json({
        message: "Password has been reset successfully. You can now log in.",
      });
    } catch (error) {
      next(error);
    }
  }
);