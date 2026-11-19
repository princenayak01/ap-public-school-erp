import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';

/**
 * Parent access is resolved only through the authenticated userId stored in
 * the verified JWT. Phone/email query parameters and local demo maps are
 * deliberately not accepted as identity or authorization evidence.
 */
export class ParentController {
  static async getMyChildren(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authenticated user identity is missing.' });
      }

      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: {
            include: { class: true, section: true },
            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
          },
        },
      });

      if (!parent) {
        return res.status(200).json({ success: true, data: [] });
      }

      return res.status(200).json({ success: true, data: parent.students });
    } catch (err) {
      return next(err);
    }
  }

  static async getChildDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const studentId = req.params.studentId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authenticated user identity is missing.' });
      }

      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: {
            where: { id: studentId },
            include: {
              class: true,
              section: true,
              attendances: { take: 60, orderBy: { date: 'desc' } },
              feeInvoices: {
                include: { payments: true },
                orderBy: { dueDate: 'desc' },
              },
              reportCards: {
                include: { exam: true },
                orderBy: { publishedAt: 'desc' },
              },
              documents: true,
            },
          },
        },
      });

      const child = parent?.students?.[0];
      if (!child) {
        // Do not reveal whether a foreign student's identifier exists.
        return res.status(404).json({
          success: false,
          message: 'Student not found or not linked to this parent account.',
          data: null,
        });
      }

      return res.status(200).json({ success: true, data: child });
    } catch (err) {
      return next(err);
    }
  }
}
