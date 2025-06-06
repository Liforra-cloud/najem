// app/api/units/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/units/[id]/route.ts (hloubka 4 → app/api/units/[id]).
// Abychom se dostali do kořene, jdeme čtyřikrát "..":
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/units/[id] – vrátí detail jednotky (včetně názvu nemovitosti)
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { property: true },
  });
  if (!unit) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(unit);
}

