import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getPrincipalMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const academicYearId = req.query.academicYearId as string;
      const data = await DashboardService.getPrincipalDashboardData(academicYearId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
