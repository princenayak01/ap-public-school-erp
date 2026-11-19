import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, refreshTokenSchema } from '../validations/auth.validation';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.emailOrPhone, validated.password);
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully! Registration is pending authorization by the School Admin / Principal.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, email } = req.body;
      const result = await AuthService.sendOtp(phone, email);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(err.status || 400).json({ success: false, message: err.message || 'Failed to send OTP' });
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;
      const result = await AuthService.verifyOtp(phone, otp);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(err.status || 400).json({ success: false, message: err.message || 'OTP verification failed' });
    }
  }

  static async registerTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerTeacher(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(err.status || 400).json({ success: false, message: err.message || 'Teacher registration failed' });
    }
  }

  static async getPendingUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getPendingUsers();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updatePrincipalCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentEmailOrPhone, newEmail, newPassword, otp } = req.body;
      const result = await AuthService.updatePrincipalCredentials({
        currentEmailOrPhone,
        newEmail,
        newPassword,
        otp,
      });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'Failed to update Principal credentials',
      });
    }
  }

  static async approveUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const approved = await AuthService.approveUser(userId);
      return res.status(200).json({
        success: true,
        message: `Account for ${approved.name} (${approved.role}) has been APPROVED by Administrator.`,
        data: approved,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || 'Approval failed' });
    }
  }

  static async rejectUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const rejected = await AuthService.rejectUser(userId);
      return res.status(200).json({
        success: true,
        message: `Account registration for ${rejected.name} has been REJECTED by Administrator.`,
        data: rejected,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || 'Rejection failed' });
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = refreshTokenSchema.parse(req.body);
      const result = await AuthService.refreshToken(validated.refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Token refreshed.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });
      const user = await AuthService.getCurrentUser(req.user.userId);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
