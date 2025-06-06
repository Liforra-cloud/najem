// app/api/properties/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/properties  – vrátí všechny nemovitosti
export async function GET() {
  const properties = await prisma.property.findMany();
  return NextResponse.json(properties);
}

// POST /api/properties  – vytvoří novou nemovitost
export async function POST(request: Request) {
  const { name, address } = await request.json();
  const newProperty = await prisma.property.create({
    data: { name, address, ownerId: 1 }, // prozatím pevně ownerId = 1
  });
  return NextResponse.json(newProperty);
}
