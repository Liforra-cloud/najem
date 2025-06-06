// app/api/invoices/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/invoices – vrátí všechny faktury (včetně jména nájemníka a jednotky)
export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: {
      lease: { include: { tenant: { select: { name: true } }, unit: { select: { name: true } } } },
    },
  });
  return NextResponse.json(invoices);
}

// POST /api/invoices – vytvoří novou fakturu
export async function POST(request: Request) {
  const { leaseId, amount } = await request.json();
  const newInvoice = await prisma.invoice.create({
    data: {
      leaseId,
      amount: Number(amount),
      // issuedAt se nastaví automaticky na now()
    },
  });
  return NextResponse.json(newInvoice);
}
