import { Router } from 'express';
import { getOverviewStats, getProjectsByState } from '../controllers/analytics.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '../types';

const router = Router();

// Only Admins and Gov Employees can see detailed analytics
router.get('/overview', authenticateToken, requireRole([Role.ADMIN, Role.GOV_EMPLOYEE]), getOverviewStats);
router.get('/by-state', authenticateToken, requireRole([Role.ADMIN, Role.GOV_EMPLOYEE]), getProjectsByState);

export default router;
