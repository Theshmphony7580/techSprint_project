import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            if (error.errors) {
                const messages = error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
                return res.status(400).json({ message: 'Validation Error', errors: messages });
            }
            res.status(400).json({ message: 'Invalid input' });
        }
    };
};
