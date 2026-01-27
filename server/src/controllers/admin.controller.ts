import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Role } from '../types';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                verified: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { verified } = req.body; // Boolean

        const user = await prisma.user.update({
            where: { id },
            data: { verified }
        });

        res.json({ message: `User ${verified ? 'verified' : 'unverified'}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user verification', error });
    }
};
