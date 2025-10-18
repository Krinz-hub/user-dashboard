import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

const app = express();

// Security & Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development origins or no-origin (mobile/curl)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested API route does not exist',
    },
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server function
export async function startServer() {
  await connectDB();
  const server = app.listen(env.PORT, () => {
    console.log(`[DevOS API] Server active on http://localhost:${env.PORT}`);
    console.log(`[DevOS API] Environment: ${env.NODE_ENV}`);
  });
  return server;
}

// Auto-run if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('[DevOS API] Startup failed:', err);
    process.exit(1);
  });
}

export default app;
