import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createGovUser() {
    try {
        const email = 'gov@test.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('Gov user already exists');
            return;
        }

        const user = await prisma.user.create({
            data: {
                email,
                name: 'Gov Employee Test',
                passwordHash: hashedPassword,
                role: 'GOV_EMPLOYEE',
                department: 'Public Works',
                verified: true // Auto-verify
            },
        });

        console.log('Created verified Gov user:', user.email);
    } catch (error) {
        console.error('Error creating gov user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createGovUser();
