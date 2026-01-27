import { Router } from 'express';
import { createProject, getProjects, getProjectDetails, addEvent } from '../controllers/project.controller';

import { authenticateToken } from '../middleware/auth.middleware';

import { validateRequest } from '../middleware/validation.middleware';
import { projectSchema } from '../lib/validation';

const router = Router();

router.post('/', authenticateToken, validateRequest(projectSchema), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectDetails);
router.post('/:id/events', authenticateToken, addEvent);

export default router;
