// app/api/tenants/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/tenants – vrátí všechny nájemníky
export async function GET() {
  const tenants = await prisma.tenant.findMany();
  return NextResponse.json(tenants);
}

// POST /api/tenants – vytvoří nového nájemníka
export async function POST(request: Request) {
  const { name, contact } = await request.json();
  const newTenant = await prisma.tenant.create({
    data: { name, contact },
  });
  return NextResponse.json(newTenant);
}
