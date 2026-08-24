const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('1234', 10);
    
    // Upsert owner user
    const user = await prisma.user.upsert({
        where: { username: 'owner' },
        update: {
            password: hashedPassword,
            role: 'OWNER'
        },
        create: {
            username: 'owner',
            password: hashedPassword,
            role: 'OWNER'
        }
    });
    
    console.log("Successfully set owner password to 1234!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
