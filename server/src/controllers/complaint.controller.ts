import { Request, Response } from 'express';
import prisma from '../lib/prisma'; // Ensure correct path
import { Role } from '../types';

export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { projectId, complaintType, description, evidenceUrl } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const complaint = await prisma.complaint.create({
            data: {
                projectId,
                complaintType,
                description,
                evidenceUrl,
                submittedBy: userId,
                status: 'SUBMITTED'
            }
        });

        res.status(201).json({ message: 'Complaint submitted', complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit complaint', error });
    }
};

export const getComplaints = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        // @ts-ignore
        const user = req.user;

        const where: any = {};

        // If projectId provided, filter by it
        if (projectId) {
            where.projectId = String(projectId);
        }

        // If generic public user, maybe limit what they see? 
        // For transparency, maybe they see all? Or only their own?
        // PRD says "Public can view project details". 
        // Let's allow public to see all complaints for a project.

        const complaints = await prisma.complaint.findMany({
            where,
            include: {
                submitter: { select: { name: true } },
                responder: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch complaints', error });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // Complaint ID
        const { status, response } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verify user role (Gov or Admin only)
        // @ts-ignore
        const userRole = req.user?.role;
        if (userRole !== Role.GOV_EMPLOYEE && userRole !== Role.ADMIN) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const complaint = await prisma.complaint.update({
            where: { id },
            data: {
                status,
                response,
                respondedBy: userId,
                respondedAt: new Date()
            }
        });

        res.json({ message: 'Complaint updated', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update complaint', error });
    }
};
