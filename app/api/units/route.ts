// app/api/units/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/units – vrátí všechny jednotky (včetně názvu nemovitosti)
export async function GET() {
  const units = await prisma.unit.findMany({
    include: { property: { select: { name: true } } },
  });
  return NextResponse.json(units);
}

// POST /api/units – vytvoří novou jednotku
export async function POST(request: Request) {
  const { name, size, floor, propertyId } = await request.json();
  const newUnit = await prisma.unit.create({
    data: { name, size, floor, propertyId },
  });
  return NextResponse.json(newUnit);
}
