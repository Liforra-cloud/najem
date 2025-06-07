// app/api/users/update/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

interface Body {
  id: string | number
  name?: string
  email?: string
  role?: string
}

export async function PATCH(request: Request) {
  // 1) Přečteme JSON z těla requestu
  const { id, name, email, role } = (await request.json()) as Body

  // 2) Přetypujeme id na string (prisma i Supabase očekávají string/UUID)
  const idStr = String(id)

  // 3) Provedeme update přes supabaseAdmin (server-side client)
  const { data, error } = await supabaseAdmin
    .from('User')
    .update({
      ...(name  !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(role  !== undefined && { role }),
    })
    .eq('id', idStr)
    .single()

  // 4) Ošetření chyby
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 5) Vrátíme aktualizovaný záznam
  return NextResponse.json(data)
}
