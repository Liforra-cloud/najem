// app/api/tenants/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/tenants/[id]/route.ts, takže relativně jdeme čtyřikrát nahoru:
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/tenants/[id] – vrátí detail konkrétního nájemníka
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const tenant = await prisma.tenant.findUnique({
    where: { id },
  });
  if (!tenant) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(tenant);
}
