import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'transparency-platform' });
});

import path from 'path';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import complaintRoutes from './routes/complaint.routes';

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/complaints', complaintRoutes);
app.use('/upload', uploadRoutes);
app.use('/admin', adminRoutes);

// Middleware for error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

export default app;
