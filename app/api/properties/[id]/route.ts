// app/api/properties/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/properties/[id] – vrátí detail nemovitosti
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const property = await prisma.property.findUnique({
    where: { id },
    include: { units: true },
  });
  if (!property) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(property);
}

// DELETE a PUT lze doplnit později, pokud bude třeba.
