import { Router } from 'express';
import { getAllUsers, verifyUser } from '../controllers/admin.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '../types';

const router = Router();

// Protect all routes with Auth + Admin Role
router.use(authenticateToken, requireRole([Role.ADMIN]));

router.get('/users', getAllUsers);
router.put('/users/:id/verify', verifyUser);

export default router;
