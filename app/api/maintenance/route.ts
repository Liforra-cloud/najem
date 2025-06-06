// app/api/maintenance/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/maintenance – vrátí všechny hlášené závady (včetně jména jednotky)
export async function GET() {
  const maintenances = await prisma.maintenance.findMany({
    include: {
      unit: { select: { name: true, property: { select: { name: true } } } },
    },
  });
  return NextResponse.json(maintenances);
}

// POST /api/maintenance – vytvoří novou hlášenou závadu
export async function POST(request: Request) {
  const { unitId, description, reportedBy, status } = await request.json();
  const newMaintenance = await prisma.maintenance.create({
    data: {
      unitId,
      description,
      reportedBy,
      status,
    },
  });
  return NextResponse.json(newMaintenance);
}
