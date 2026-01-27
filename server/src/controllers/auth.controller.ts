import { Request, Response } from 'express';
import { RegisterRequest, Role } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, department } = req.body as RegisterRequest;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        let role = Role.PUBLIC;
        let verified = false;

        // Auto-assign role logic (for MVP/Dev)
        if (department) {
            role = Role.GOV_EMPLOYEE;
            // In PRD, verified stays false for GOV until Admin approval
            // For MVP/Demo: verified = true? Let's keep it false and require Admin or Seed
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role,
                department,
                verified
            }
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role === Role.GOV_EMPLOYEE && !user.verified) {
            return res.status(403).json({ message: 'Account pending verification' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '15m' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};
