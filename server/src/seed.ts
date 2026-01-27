import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from './types';

async function main() {
    const passwordHash = await bcrypt.hash('password', 10);

    // Seed Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gov.in' },
        update: {},
        create: {
            name: 'System Admin',
            email: 'admin@gov.in',
            passwordHash,
            role: Role.ADMIN,
            verified: true
        },
    });

    // Seed Gov Employee
    const gov = await prisma.user.upsert({
        where: { email: 'demo@gov.in' },
        update: {},
        create: {
            name: 'Demo Officer',
            email: 'demo@gov.in',
            passwordHash,
            role: Role.GOV_EMPLOYEE,
            department: 'Public Works',
            verified: true
        },
    });

    console.log({ admin, gov });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
