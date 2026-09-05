import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes.js';
import { securityHeadersMiddleware, sanitizationMiddleware, rateLimiter } from './server/security.js';
import { performanceTimingMiddleware } from './server/cache.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Security & Performance Middlewares
  app.use(securityHeadersMiddleware);
  app.use(performanceTimingMiddleware);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // 2. Input Sanitization
  app.use(sanitizationMiddleware);

  // 3. Rate Limiter on API surface
  app.use('/api', rateLimiter(180, 60000, 'global_api'), apiRouter);

  // 4. Safe Error Handler (prevent stack trace leak)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[ProjectMentor AI] Internal Error:', err?.message || err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'A secure internal error occurred. Detailed telemetry logged.',
      timestamp: new Date().toISOString()
    });
  });

  // 5. Development: Vite middleware; Production: Static dist
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ProjectMentor AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ProjectMentor AI] Startup failed:', err);
});
