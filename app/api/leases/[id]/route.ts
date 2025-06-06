// app/api/leases/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/leases/[id] – vrátí detail smlouvy (včetně plateb a faktur)
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

// DELETE a PUT lze doplnit později
