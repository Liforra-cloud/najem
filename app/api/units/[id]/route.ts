// app/api/units/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor v /app/api/units/[id]/route.ts → lib/prisma na úrovni kořene dosáhnete relativně takto:
import { prisma } from '../../../lib/prisma';

interface Params {
  params: { id: string };
}

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
