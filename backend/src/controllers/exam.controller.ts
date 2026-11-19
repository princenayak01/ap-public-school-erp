import { Request, Response, NextFunction } from 'express';
import { ExamService } from '../services/exam.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createExamSchema,
  scheduleExamSubjectSchema,
  enterMarksSchema,
  generateReportCardsSchema,
} from '../validations/exam.validation';

const notReady = (res: Response, operation: string) =>
  res.status(501).json({
    success: false,
    message: `${operation} is disabled until its tenant-scoped PostgreSQL implementation is verified.`,
    code: 'SECURE_IMPLEMENTATION_REQUIRED',
  });

export class ExamController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createExamSchema.parse(req.body);
      const exam = await ExamService.createExam(validated);
      return res.status(201).json({ success: true, data: exam });
    } catch (err) {
      return next(err);
    }
  }

  static async scheduleSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = scheduleExamSubjectSchema.parse(req.body);
      const scheduled = await ExamService.scheduleExamSubject(validated);
      return res.status(201).json({ success: true, data: scheduled });
    } catch (err) {
      return next(err);
    }
  }

  static async enterMarks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = enterMarksSchema.parse(req.body);
      const result = await ExamService.enterMarks(
        validated.examSubjectId,
        validated.marksList,
        req.user?.userId
      );
      return res.status(200).json({ success: true, message: 'Marks recorded.', data: result });
    } catch (err) {
      return next(err);
    }
  }

  static async getMarks(_req: Request, res: Response) {
    return notReady(res, 'Marks listing');
  }

  static async generateReportCards(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = generateReportCardsSchema.parse(req.body);
      const result = await ExamService.generateReportCards(validated.examId, validated.classId);
      return res.status(200).json({
        success: true,
        message: 'Report cards generated.',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async downloadReportCard(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await ExamService.generateReportCardPDF(req.params.reportCardId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=ReportCard-${req.params.reportCardId}.pdf`);
      return res.send(pdfBuffer);
    } catch (err) {
      return next(err);
    }
  }
}
