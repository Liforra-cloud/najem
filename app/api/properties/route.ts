// app/api/properties/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '../../../lib/prisma'

// GET /api/properties – vrátí všechny nemovitosti
export async function GET() {
  const properties = await prisma.property.findMany()
  return NextResponse.json(properties)
}

// POST /api/properties – vytvoří novou nemovitost
export async function POST(request: Request) {
  // 1) Načteme session, abychom věděli, kdo volá API
  const session = await getServerSession(authOptions)
  if (!session) {
    // Není přihlášený → přesměrujeme na login
    return NextResponse.redirect('/api/auth/signin')
  }

  // 2) Vezmeme ID právě přihlášeného uživatele (UUID/string)
  const ownerId = session.user.id

  // 3) Parsujeme tělo požadavku
  const { name, address } = await request.json()

  // 4) Vytvoříme Property s dynamickým ownerId
  const newProperty = await prisma.property.create({
    data: {
      name,
      address,
      ownerId,
    },
  })

  return NextResponse.json(newProperty)
}
