import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { createStudentAdmissionSchema, promoteStudentSchema } from '../validations/student.validation';
import { isDbOnline } from '../prisma/client';

const databaseUnavailable = (res: Response) =>
  res.status(503).json({
    success: false,
    message: 'Student operations require the PostgreSQL database. Local JSON fallback is disabled.',
    code: 'DATABASE_UNAVAILABLE',
  });

const notImplementedSafely = (res: Response, operation: string) =>
  res.status(501).json({
    success: false,
    message: `${operation} is temporarily disabled until its tenant-scoped PostgreSQL implementation is completed.`,
    code: 'TENANT_SAFE_OPERATION_NOT_READY',
  });

export class StudentController {
  static async admit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isDbOnline) return databaseUnavailable(res);
      const validated = createStudentAdmissionSchema.parse(req.body);
      const student = await StudentService.admitStudent(validated);
      return res.status(201).json({ success: true, message: 'New student admitted successfully.', data: student });
    } catch (err) {
      return next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isDbOnline) return databaseUnavailable(res);
      if ((req as any).user?.role === 'PARENT') {
        return res.status(403).json({ success: false, message: 'Use the parent portal to access linked children.' });
      }

      const filters = {
        classId: req.query.classId as string,
        sectionId: req.query.sectionId as string,
        search: req.query.search as string,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 25,
      };
      const result = await StudentService.getStudents(filters);
      return res.status(200).json({
        success: true,
        data: result.students,
        pagination: result.pagination,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isDbOnline) return databaseUnavailable(res);
      if ((req as any).user?.role === 'PARENT') {
        return res.status(403).json({ success: false, message: 'Use the parent portal to access linked children.' });
      }
      const student = await StudentService.getStudentById(req.params.id);
      return res.status(200).json({ success: true, data: student });
    } catch (err: any) {
      if (err?.status === 404) return res.status(404).json({ success: false, message: 'Student not found.' });
      return next(err);
    }
  }

  static async updateRollNo(_req: Request, res: Response) {
    return notImplementedSafely(res, 'Roll number update');
  }

  static async bulkUpload(_req: Request, res: Response) {
    return notImplementedSafely(res, 'Bulk student upload');
  }

  static async delete(_req: Request, res: Response) {
    return notImplementedSafely(res, 'Student deletion');
  }

  static async clearAll(_req: Request, res: Response) {
    return res.status(403).json({
      success: false,
      message: 'Bulk deletion is disabled for production safety.',
      code: 'DESTRUCTIVE_OPERATION_DISABLED',
    });
  }

  static async update(_req: Request, res: Response) {
    return notImplementedSafely(res, 'Student update');
  }

  static async promote(req: Request, res: Response) {
    try {
      promoteStudentSchema.parse(req.body);
      return notImplementedSafely(res, 'Student promotion');
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid student promotion request.' });
    }
  }
}
