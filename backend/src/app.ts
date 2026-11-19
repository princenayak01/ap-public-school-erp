import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import apiRouter from './routes/api.router';
import { errorHandler } from './middleware/error.middleware';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = new Set(config.cors.origin);
app.use(
  cors({
    origin: (origin, callback) => {
      // Native clients and server-to-server requests may omit Origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    school: 'A. P PUBLIC SCHOOL, Jhansi',
    board: 'CBSE',
    session: '2026-27',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', apiRouter);
app.use(errorHandler);

export default app;
