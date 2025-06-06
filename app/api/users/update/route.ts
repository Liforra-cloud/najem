// app/api/users/update/route.ts

import { NextResponse } from 'next/server';
// Soubor je v /app/api/users/update/route.ts, takže k lib/prisma dojdeme čtyřmi úrovněmi nahoru:
import { prisma } from '../../../../lib/prisma';

interface Body {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

// PUT /api/users/update – aktualizuje uživatele podle id
export async function PUT(request: Request) {
  const { id, name, email, role } = (await request.json()) as Body;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(role !== undefined && { role }),
    },
  });
  return NextResponse.json(updatedUser);
}
