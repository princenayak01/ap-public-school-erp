import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please verify input data.',
      errors: formattedErrors,
    });
  }

  // Prisma Unique Constraint Error (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return res.status(409).json({
      success: false,
      message: `Conflict: A record with this unique field already exists${target}.`,
    });
  }

  // Prisma Not Found Error (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested record does not exist or has been removed.',
    });
  }

  // General server error
  console.error('[SERVER_ERROR]:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
