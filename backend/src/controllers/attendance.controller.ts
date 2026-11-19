import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  markDailyAttendanceSchema,
  bulkDateRangeAttendanceSchema,
} from '../validations/attendance.validation';

const notReady = (res: Response) =>
  res.status(501).json({
    success: false,
    message: 'Teacher attendance is disabled until its tenant-scoped PostgreSQL implementation is complete.',
    code: 'SECURE_IMPLEMENTATION_REQUIRED',
  });

export class AttendanceController {
  static async markDaily(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = markDailyAttendanceSchema.parse(req.body);
      const result = await AttendanceService.markSectionAttendance(
        validated.sectionId,
        validated.date,
        validated.records,
        req.user?.userId
      );
      return res.status(200).json({
        success: true,
        message: 'Attendance recorded successfully.',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async bulkRange(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = bulkDateRangeAttendanceSchema.parse(req.body);
      const result = await AttendanceService.bulkDateRangeAttendance(
        validated.sectionId,
        validated.startDate,
        validated.endDate,
        validated.defaultStatus,
        validated.excludeSundays
      );
      return res.status(200).json({
        success: true,
        message: 'Attendance date range saved successfully.',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getDailySheet(req: Request, res: Response, next: NextFunction) {
    try {
      const sectionId = req.query.sectionId as string;
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      if (!sectionId) {
        return res.status(400).json({ success: false, message: 'sectionId is required.' });
      }
      const sheet = await AttendanceService.getSectionDailySheet(sectionId, date);
      return res.status(200).json({ success: true, data: sheet });
    } catch (err) {
      return next(err);
    }
  }

  static async getMonthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const sectionId = req.query.sectionId as string;
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      if (!sectionId || !Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000) {
        return res.status(400).json({ success: false, message: 'Valid sectionId, month (1-12), and year are required.' });
      }
      const report = await AttendanceService.getMonthlySectionReport(sectionId, month, year);
      return res.status(200).json({ success: true, data: report });
    } catch (err) {
      return next(err);
    }
  }

  static async markTeachers(_req: Request, res: Response) {
    return notReady(res);
  }
}
