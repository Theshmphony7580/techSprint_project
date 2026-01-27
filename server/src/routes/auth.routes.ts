import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

import { validateRequest } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../lib/validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
