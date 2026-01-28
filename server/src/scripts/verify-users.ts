import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllUsers() {
    try {
        const result = await prisma.user.updateMany({
            where: {
                verified: false
            },
            data: {
                verified: true
            }
        });

        console.log(`✓ Updated ${result.count} users to verified status`);

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                verified: true
            }
        });

        console.log('\nAll users:');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Role: ${user.role}, Verified: ${user.verified}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAllUsers();
