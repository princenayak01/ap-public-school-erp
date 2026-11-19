import { Request, Response, NextFunction } from 'express';
import { FeeService } from '../services/fee.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createFeeStructureSchema, recordFeePaymentSchema } from '../validations/fee.validation';

const notReady = (res: Response, operation: string) =>
  res.status(501).json({
    success: false,
    message: `${operation} is disabled until a verified PostgreSQL implementation with tenant ownership and authorization is available.`,
    code: 'SECURE_IMPLEMENTATION_REQUIRED',
  });

export class FeeController {
  static async createStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createFeeStructureSchema.parse(req.body);
      const structure = await FeeService.createFeeStructure(validated);
      return res.status(201).json({ success: true, data: structure });
    } catch (err) {
      return next(err);
    }
  }

  static async getStructures(req: Request, res: Response, next: NextFunction) {
    try {
      const academicYearId = req.query.academicYearId as string;
      const list = await FeeService.getFeeStructures(academicYearId);
      return res.status(200).json({ success: true, data: list });
    } catch (err) {
      return next(err);
    }
  }

  static async getInvoices(_req: Request, res: Response) {
    return notReady(res, 'Fee invoice listing');
  }

  static async createReceipt(_req: Request, res: Response) {
    return notReady(res, 'Manual fee receipt creation');
  }

  static async generateInvoices(_req: Request, res: Response) {
    return notReady(res, 'Bulk fee invoice generation');
  }

  static async pay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = recordFeePaymentSchema.parse(req.body);
      const payment = await FeeService.recordPayment(
        validated.invoiceId,
        validated.amountPaid,
        validated.paymentMode,
        req.user?.userId,
        validated.notes
      );
      return res.status(201).json({
        success: true,
        message: 'Payment recorded successfully.',
        data: payment,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async createRazorpayOrder(_req: Request, res: Response) {
    return notReady(res, 'Online payment order creation');
  }

  static async verifyRazorpay(_req: Request, res: Response) {
    return notReady(res, 'Online payment verification');
  }

  static async getAnalytics(_req: Request, res: Response) {
    return notReady(res, 'Fee analytics');
  }

  static async downloadReceipt(_req: Request, res: Response) {
    return notReady(res, 'Fee receipt download');
  }
}
