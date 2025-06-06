// app/api/maintenance/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/maintenance/[id]/route.ts, takže k lib/prisma se dostanete relativně čtyřmi kroky nahoru:
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/maintenance/[id] – vrátí detail hlášené závady
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const maintenance = await prisma.maintenance.findUnique({
    where: { id },
    include: {
      unit: { include: { property: { select: { name: true } } } },
    },
  });
  if (!maintenance) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(maintenance);
}

// PUT /api/maintenance/[id] – aktualizovat stav závady (volitelné, přidejte podle potřeby)
// export async function PUT(request: Request, { params }: Params) {
//   const id = parseInt(params.id, 10);
//   const { status } = await request.json();
//   const updated = await prisma.maintenance.update({
//     where: { id },
//     data: { status },
//   });
//   return NextResponse.json(updated);
// }

// DELETE /api/maintenance/[id] – smazat závadu (volitelné, přidejte podle potřeby)
// export async function DELETE(request: Request, { params }: Params) {
//   const id = parseInt(params.id, 10);
//   await prisma.maintenance.delete({ where: { id } });
//   return new NextResponse(null, { status: 204 });
// }
