import { Request, Response } from 'express';

const disabled = (res: Response) =>
  res.status(501).json({
    success: false,
    message: 'Timetable operations are disabled until a tenant-scoped PostgreSQL implementation replaces the shared JSON datastore.',
    code: 'SECURE_IMPLEMENTATION_REQUIRED',
  });

export class TimetableController {
  static async getTimetable(_req: Request, res: Response) {
    return disabled(res);
  }

  static async saveSlot(_req: Request, res: Response) {
    return disabled(res);
  }

  static async bulkSave(_req: Request, res: Response) {
    return disabled(res);
  }
}
