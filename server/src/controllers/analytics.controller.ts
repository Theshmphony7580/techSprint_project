import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getOverviewStats = async (req: Request, res: Response) => {
    try {
        const totalProjects = await prisma.project.count();
        const totalBudget = await prisma.project.aggregate({
            _sum: { budget: true }
        });

        const projectsByStatus = await prisma.project.groupBy({
            by: ['currentStatus'],
            _count: true
        });

        const complaintsStats = await prisma.complaint.groupBy({
            by: ['status'],
            _count: true
        });

        res.json({
            totalProjects,
            totalBudget: totalBudget._sum.budget || 0,
            projectsByStatus: projectsByStatus.map(s => ({ status: s.currentStatus, count: s._count })),
            complaintsStats: complaintsStats.map(c => ({ status: c.status, count: c._count }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getProjectsByState = async (req: Request, res: Response) => {
    try {
        const byState = await prisma.project.groupBy({
            by: ['state'],
            _count: true
        });
        res.json(byState.map(s => ({ state: s.state, count: s._count })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching state stats', error });
    }
};
