// app/api/payments/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/payments – vrátí všechny platby (včetně jména nájemníka a jednotky)
export async function GET() {
  const payments = await prisma.payment.findMany({
    include: {
      lease: { include: { tenant: { select: { name: true } }, unit: { select: { name: true } } } },
    },
  });
  return NextResponse.json(payments);
}

// POST /api/payments – vytvoří novou platbu
export async function POST(request: Request) {
  const { leaseId, amount, dueDate, status } = await request.json();
  const newPayment = await prisma.payment.create({
    data: {
      leaseId,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      status,
    },
  });
  return NextResponse.json(newPayment);
}
