// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('password', salt);

  // Vytvoříme dva uživatele s rolemi OWNER a MANAGER
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Majitel',
      email: 'alice@example.com',
      role: 'OWNER',
      hashedPassword: hash,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Správce',
      email: 'bob@example.com',
      role: 'MANAGER',
      hashedPassword: hash,
    },
  });

  // Vytvoříme dvě nemovitosti pro Alice
  const prop1 = await prisma.property.create({
    data: {
      name: 'Byt Praha 1',
      address: 'Vodičkova 12, Praha',
      ownerId: user1.id,
    },
  });
  const prop2 = await prisma.property.create({
    data: {
      name: 'Dům Brno',
      address: 'Lidická 22, Brno',
      ownerId: user1.id,
    },
  });

  // Vytvoříme několik jednotek
  const unit1 = await prisma.unit.create({
    data: {
      name: 'Byt 1A',
      size: '2+kk',
      floor: 1,
      propertyId: prop1.id,
    },
  });
  const unit2 = await prisma.unit.create({
    data: {
      name: 'Byt 1B',
      size: '3+1',
      floor: 2,
      propertyId: prop1.id,
    },
  });
  const unit3 = await prisma.unit.create({
    data: {
      name: 'Kancelář 2A',
      size: 'open-space',
      floor: 3,
      propertyId: prop2.id,
    },
  });

  // Vytvoříme nájemníky
  const tenant1 = await prisma.tenant.create({
    data: { name: 'Jan Novák', contact: 'jan.novak@example.com' },
  });
  const tenant2 = await prisma.tenant.create({
    data: { name: 'ABC s.r.o.', contact: 'info@abc.cz' },
  });

  // Vytvoříme smlouvy
  const lease1 = await prisma.lease.create({
    data: {
      unitId: unit1.id,
      tenantId: tenant1.id,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      rent: 12000,
    },
  });
  const lease2 = await prisma.lease.create({
    data: {
      unitId: unit3.id,
      tenantId: tenant2.id,
      startDate: new Date('2022-06-01'),
      endDate: new Date('2025-06-01'),
      rent: 25000,
    },
  });

  // Vytvoříme platby
  await prisma.payment.create({
    data: {
      leaseId: lease1.id,
      amount: 12000,
      dueDate: new Date('2024-06-01'),
      status: 'PAID',
    },
  });
  await prisma.payment.create({
    data: {
      leaseId: lease2.id,
      amount: 25000,
      dueDate: new Date('2024-06-01'),
      status: 'UNPAID',
    },
  });

  // Vytvoříme hlášenou závadu
  await prisma.maintenance.create({
    data: {
      unitId: unit2.id,
      description: 'Závada topení',
      reportedBy: 'Jan Novák',
      status: 'OPEN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
