import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AIService } from '../services/ai.service';
import { z } from 'zod';

const askSchema = z.object({
  question: z.string().min(2, 'Question must not be empty'),
});

export class AIController {
  static async ask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = askSchema.parse(req.body);
      const user = {
        userId: req.user!.userId,
        role: req.user!.role,
      };

      const result = await AIService.askAssistant(validated.question, user);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
