import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

// Import routes
import healthRouter from './routes/health.routes';
import students from './routes/students';
import tasksRouter from './routes/tasks';
import communicationsRouter from './routes/communications';
import interactionsRouter from './routes/interactions';
import notesRouter from './routes/notes';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/students', students);
app.use('/api/tasks', tasksRouter);
app.use('/api/communications', communicationsRouter);
app.use('/api/interactions', interactionsRouter);
app.use('/api/notes', notesRouter);

// Base route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'CRM API Server',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;