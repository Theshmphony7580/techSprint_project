import { Request, Response } from 'express';
import { LedgerService } from '../services/ledger.service';
import prisma from '../lib/prisma';

export const createProject = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        const userId = user?.userId || 'admin-123'; // Fallback if auth missing in dev

        const { projectName, department, budget, location } = req.body;

        const newProject = await prisma.project.create({
            data: {
                projectName,
                department,
                budget, // Prisma handles decimal/string conversion usually
                district: location?.district || 'Unknown',
                state: location?.state || 'Unknown',
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
                startDate: new Date(),
                expectedEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                currentStatus: 'SANCTIONED',
                currentProgress: 0,
                createdBy: userId
            }
        });

        // Create Genesis Event
        await LedgerService.createEvent(
            newProject.id,
            'PROJECT_CREATED',
            { projectName, department, budget },
            userId
        );

        res.status(201).json({ message: 'Project created', project: newProject });
    } catch (error) {
        console.error('Create Project Error:', error);
        res.status(500).json({ message: 'Failed to create project', error });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects', error });
    }
};

export const getProjectDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const project = await prisma.project.findUnique({
            where: { id }
        });

        if (!project) return res.status(404).json({ message: 'Project not found' });

        const timeline = await LedgerService.getTimeline(id);
        const integrity = await LedgerService.verifyIntegrity(id);

        res.json({ project, timeline, integrity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching details', error });
    }
};

export const addEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { eventType, data } = req.body;
        // @ts-ignore
        const userId = req.user?.userId || 'admin-123';

        // Verify project exists
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const event = await LedgerService.createEvent(id, eventType, data, userId);

        // Update project status if needed
        if (eventType === 'PROGRESS_UPDATE' && data.progress) {
            await prisma.project.update({
                where: { id },
                data: { currentProgress: data.progress }
            });
        }

        res.status(201).json({ message: 'Event added', event });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event', error });
    }
};
