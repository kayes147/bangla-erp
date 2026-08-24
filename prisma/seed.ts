import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.product.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.user.deleteMany(); // ADDED
  await prisma.employee.deleteMany();
  await prisma.client.deleteMany();

  // Create Categories
  const catTransport = await prisma.expenseCategory.create({ data: { name: 'Transport' } });
  const catSnacks = await prisma.expenseCategory.create({ data: { name: 'Tea & Snacks' } });

  // Create Clients
  const customer1 = await prisma.client.create({
    data: { type: 'customer', name: 'Rahim Uddin', phone: '01711-000000', openingBalance: 500 }
  });
  const supplier1 = await prisma.client.create({
    data: { type: 'supplier', name: 'Karim Traders', phone: '01822-000000', openingBalance: -1500 }
  });

  // Create Employees
  const emp1 = await prisma.employee.create({
    data: { type: 'permanent', name: 'Hasibul Islam', phone: '01933-000000', designation: 'Manager', salaryAmount: 15000 }
  });

  // CREATE USERS
  const hashedPassword = await bcrypt.hash('1234', 10);
  
  await prisma.user.create({
    data: {
      username: 'owner',
      password: hashedPassword,
      role: 'OWNER'
    }
  });

  await prisma.user.create({
    data: {
      username: 'manager',
      password: hashedPassword,
      role: 'MANAGER',
      employeeId: emp1.id
    }
  });

  await prisma.user.create({
    data: {
      username: 'client',
      password: hashedPassword,
      role: 'CLIENT',
      clientId: customer1.id
    }
  });

  // Create some initial transactions for Main Cash
  await prisma.transaction.create({
    data: { type: 'in', amount: 50000, description: 'Initial Capital' }
  });

  const t1 = await prisma.transaction.create({
    data: { type: 'out', amount: 120, description: 'Morning tea' }
  });

  // Create an Expense
  await prisma.expense.create({
    data: {
      categoryId: catSnacks.id,
      amount: 120,
      description: 'Morning tea',
      paymentMethod: 'cash',
      transactionId: t1.id
    }
  });

  console.log('Database seeded successfully with Users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
