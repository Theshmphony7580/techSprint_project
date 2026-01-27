import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    department: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export const projectSchema = z.object({
    projectName: z.string().min(3, 'Project name too short'),
    department: z.string().min(2, 'Department required'),
    budget: z.number().positive('Budget must be positive'),
    location: z.object({
        district: z.string().min(2),
        state: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional()
    }).optional()
});

export const complaintSchema = z.object({
    projectId: z.string().uuid(),
    complaintType: z.enum(['DELAY', 'CORRUPTION', 'QUALITY', 'OTHER']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    evidenceUrl: z.string().optional()
});
