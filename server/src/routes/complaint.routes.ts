import { Router } from 'express';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaint.controller';
import { authenticateToken } from '../middleware/auth.middleware';

import { validateRequest } from '../middleware/validation.middleware';
import { complaintSchema } from '../lib/validation';

const router = Router();

// Submit complaint - Authenticated users
router.post('/', authenticateToken, validateRequest(complaintSchema), createComplaint);

// Get complaints - Public can see (filtered), or Authenticated
// For this platform, let's allow public read-only of project complaints?
// Or maybe just Authenticated for now to simplify transparency logic?
// PRD says "Transparency Platform", so likely public.
// Controller handles "userId" extraction if present.
router.get('/', getComplaints);

// Update status - Gov/Admin only
router.put('/:id', authenticateToken, updateComplaintStatus);

export default router;
