// app/api/leases/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/leases/[id]/route.ts → cesta do lib/prisma:
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const lease = await prisma.lease.findUnique({
    where: { id },
    include: {
      tenant: true,
      unit: { include: { property: true } },
      payments: true,
      invoices: true,
    },
  });
  if (!lease) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(lease);
}
