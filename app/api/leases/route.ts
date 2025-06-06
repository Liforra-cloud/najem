// app/api/leases/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/leases – vrátí všechny smlouvy (včetně nájemníka a jednotky)
export async function GET() {
  const leases = await prisma.lease.findMany({
    include: {
      tenant: { select: { id: true, name: true } },
      unit: { select: { id: true, name: true, property: { select: { name: true } } } },
    },
  });
  return NextResponse.json(leases);
}

// POST /api/leases – vytvoří novou smlouvu
export async function POST(request: Request) {
  const { unitId, tenantId, startDate, endDate, rent } = await request.json();
  const newLease = await prisma.lease.create({
    data: {
      unitId,
      tenantId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rent: Number(rent),
    },
  });
  return NextResponse.json(newLease);
}
