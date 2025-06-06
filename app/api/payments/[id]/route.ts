// app/api/payments/[id]/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/payments/[id]/route.ts → abychom se dostali do kořene, jdeme čtyřikrát "..":
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET /api/payments/[id] – vrátí detail konkrétní platby
export async function GET(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      lease: {
        include: {
          tenant: { select: { name: true } },
          unit: { select: { name: true } },
        },
      },
    },
  });
  if (!payment) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(payment);
}

// 🚀 Můžete přidat i další metody PUT/DELETE, pokud chcete například aktualizovat stav nebo smazat platbu:
// export async function PUT(request: Request, { params }: Params) { … }
// export async function DELETE(request: Request, { params }: Params) { … }
