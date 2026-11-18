import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import prisma from '../prisma/client';

export function recordAuditLog(action: string, entity: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Intercept response finish
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.userId || null,
              action,
              entity,
              entityId: req.params.id || req.body?.id || null,
              details: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                bodySummary: req.body ? Object.keys(req.body) : [],
              },
              ipAddress: req.ip || null,
              userAgent: req.headers['user-agent'] || null,
            },
          });
        } catch (e) {
          console.warn('[AUDIT_LOG_FAILED]:', e);
        }
      }
    });

    next();
  };
}
