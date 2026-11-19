import { Request, Response, NextFunction } from 'express';
import { isDbOnline } from '../prisma/client';

/**
 * Prevent controllers from silently falling back to shared local JSON state.
 * All protected application data must be served by PostgreSQL.
 */
export function requireDatabase(_req: Request, res: Response, next: NextFunction) {
  if (!isDbOnline) {
    return res.status(503).json({
      success: false,
      message: 'The PostgreSQL database is unavailable. Data operations are temporarily disabled.',
      code: 'DATABASE_UNAVAILABLE',
    });
  }
  return next();
}
