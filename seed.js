const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create Users
  const owner = await prisma.user.upsert({
    where: { username: 'owner' },
    update: {},
    create: { username: 'owner', password: '123', role: 'OWNER' }
  });

  const manager = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: { username: 'manager', password: '123', role: 'MANAGER' }
  });

  // 2. Create Expense Categories
  const categories = ['Transport', 'Tea & Snacks', 'Utility Bills', 'Maintenance', 'Other', 'Salary'];
  for (const c of categories) {
    await prisma.expenseCategory.upsert({
      where: { name: c },
      update: {},
      create: { name: c }
    });
  }

  // 3. Create Products
  const products = [
    { name: 'Radhuni Masala 500g', sku: 'RM-500', buyPrice: 40, sellPrice: 50, stock: 5 }, // Low stock
    { name: 'Fresh Atta 2kg', sku: 'FA-2K', buyPrice: 90, sellPrice: 110, stock: 45 },
    { name: 'Teer Soyabean Oil 5L', sku: 'TS-5L', buyPrice: 800, sellPrice: 830, stock: 12 },
    { name: 'Miniket Rice 50kg', sku: 'MR-50K', buyPrice: 3000, sellPrice: 3200, stock: 30 },
  ];
  
  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // 4. Create Clients (Suppliers & Customers)
  const clients = [
    { name: 'Karim Traders', type: 'supplier', phone: '01711000001', openingBalance: 5000 }, // I owe them 5000
    { name: 'Rahim General Store', type: 'customer', phone: '01811000002', openingBalance: -2000 }, // They owe me 2000
    { name: 'Maa Enterprise', type: 'supplier', phone: '01911000003', openingBalance: 0 },
  ];
  
  for (const c of clients) {
    await prisma.client.create({ data: c });
  }

  // Fetch created data to link in invoices
  const allProducts = await prisma.product.findMany();
  const allClients = await prisma.client.findMany();
  const salaryCat = await prisma.expenseCategory.findUnique({ where: { name: 'Salary' } });
  const snackCat = await prisma.expenseCategory.findUnique({ where: { name: 'Tea & Snacks' } });

  // 5. Create Employees
  const emp1 = await prisma.employee.create({
    data: { name: 'Jamal Hossain', type: 'permanent', phone: '01511000004', designation: 'Salesman', salaryAmount: 15000 }
  });
  const emp2 = await prisma.employee.create({
    data: { name: 'Korim Ali', type: 'daily', phone: '01611000005', designation: 'Labor', salaryAmount: 600 }
  });

  // 6. Create Attendances (Today and Yesterday)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  await prisma.attendance.createMany({
    data: [
      { employeeId: emp1.id, dateString: formatDate(today), status: 'PRESENT', date: today },
      { employeeId: emp2.id, dateString: formatDate(today), status: 'LATE', date: today },
      { employeeId: emp1.id, dateString: formatDate(yesterday), status: 'PRESENT', date: yesterday },
      { employeeId: emp2.id, dateString: formatDate(yesterday), status: 'ABSENT', date: yesterday },
    ]
  });

  // 7. Initial Main Cash Injection
  await prisma.transaction.create({
    data: {
      type: 'in',
      amount: 50000,
      description: 'Opening Balance (Owner Investment)',
      status: 'APPROVED',
      date: yesterday
    }
  });

  // 8. Create Invoices (Product IN - Purchases)
  const inv1 = await prisma.invoice.create({
    data: {
      type: 'product_in',
      clientId: allClients.find(c => c.type === 'supplier').id,
      totalAmount: 12000,
      paidAmount: 10000,
      paymentStatus: 'partial',
      status: 'APPROVED',
      date: yesterday,
      items: {
        create: [
          { productId: allProducts[3].id, quantity: 4, pricePerUnit: 3000, total: 12000 }
        ]
      }
    }
  });
  // Purchase transaction
  await prisma.transaction.create({
    data: {
      type: 'out',
      amount: 10000,
      description: 'Payment for Purchase Invoice',
      status: 'APPROVED',
      invoiceId: inv1.id,
      clientId: inv1.clientId,
      date: yesterday
    }
  });

  // 9. Create Invoices (Product OUT - Sales)
  const inv2 = await prisma.invoice.create({
    data: {
      type: 'product_out',
      clientId: allClients.find(c => c.type === 'customer').id,
      totalAmount: 3300,
      paidAmount: 3300,
      paymentStatus: 'paid',
      status: 'APPROVED',
      date: today,
      items: {
        create: [
          { productId: allProducts[1].id, quantity: 30, pricePerUnit: 110, total: 3300 }
        ]
      }
    }
  });
  // Sale transaction
  await prisma.transaction.create({
    data: {
      type: 'in',
      amount: 3300,
      description: 'Received for Sales Invoice',
      status: 'APPROVED',
      invoiceId: inv2.id,
      clientId: inv2.clientId,
      date: today
    }
  });

  // 10. Create Daily Expenses
  await prisma.expense.create({
    data: {
      categoryId: snackCat.id,
      amount: 150,
      description: 'Guests tea and snacks',
      paymentMethod: 'cash',
      status: 'APPROVED',
      date: today
    }
  });
  await prisma.transaction.create({
    data: {
      type: 'out',
      amount: 150,
      description: 'Guests tea and snacks',
      status: 'APPROVED',
      date: today
    }
  });

  // 11. Create Pending Approvals (Manager requests)
  await prisma.expense.create({
    data: {
      categoryId: salaryCat.id,
      amount: 15000,
      description: 'Salary payment for Jamal Hossain',
      paymentMethod: 'cash',
      status: 'PENDING',
      requestedBy: 'manager',
      employeeId: emp1.id,
      date: today
    }
  });
  
  const inv3 = await prisma.invoice.create({
    data: {
      type: 'product_in',
      clientId: allClients[2].id,
      totalAmount: 200,
      paidAmount: 0,
      paymentStatus: 'due',
      status: 'PENDING',
      requestedBy: 'manager',
      date: today,
      items: {
        create: [
          { productId: allProducts[0].id, quantity: 5, pricePerUnit: 40, total: 200 }
        ]
      }
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
