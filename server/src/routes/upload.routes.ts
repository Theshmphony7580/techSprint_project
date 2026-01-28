import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import fs from 'fs';
import crypto from 'crypto';
import prisma from '../lib/prisma';

const router = Router();

router.post('/', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // 1. Calculate SHA-256 Hash
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // 2. Save to Database (Document Model)
        // @ts-ignore
        const userId = req.user?.userId;

        await prisma.document.create({
            data: {
                fileUrl: `/uploads/${req.file.filename}`,
                fileHash: fileHash,
                fileSize: BigInt(req.file.size), // Prisma BigInt
                uploadedBy: userId,
                // If we had projectId in body, we could link it here
            }
        });

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            fileHash: fileHash, // Return hash to client
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'File upload processing failed' });
    }
});

export default router;
