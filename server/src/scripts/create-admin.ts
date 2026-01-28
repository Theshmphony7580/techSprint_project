import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@govtransparency.in' }
        });

        if (existingAdmin) {
            console.log('⚠ Admin user already exists!');
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Name: ${existingAdmin.name}`);
            console.log(`Role: ${existingAdmin.role}`);
            return;
        }

        // Create admin user
        const passwordHash = await bcrypt.hash('admin@123', 10);

        const adminUser = await prisma.user.create({
            data: {
                name: 'System Administrator',
                email: 'admin@govtransparency.in',
                passwordHash: passwordHash,
                role: 'ADMIN',
                department: 'Administration',
                verified: true,
                mfaEnabled: false
            }
        });

        console.log('✓ Admin user created successfully!');
        console.log('\n=== Admin Credentials ===');
        console.log(`Email: ${adminUser.email}`);
        console.log(`Password: admin@123`);
        console.log(`Role: ${adminUser.role}`);
        console.log(`User ID: ${adminUser.id}`);
        console.log('\n⚠ IMPORTANT: Change the password after first login!');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
