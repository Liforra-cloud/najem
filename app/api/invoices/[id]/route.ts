// app/api/invoices/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/invoices/[id]/route.ts → 
// abychom se dostali do kořenového projektu, použijeme čtyři úrovně '..':
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/invoices/[id] – vrátí detail faktury
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      lease: {
        include: {
          tenant: { select: { name: true } },
          unit: { select: { name: true } },
        },
      },
    },
  });
  if (!invoice) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(invoice);
}
