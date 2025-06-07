// app/api/signup/route.ts

// Pro ověření, že se načetl správný service-role key:
console.log('SERVICE ROLE KEY prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 8))

import { NextResponse } from 'next/server'
import { supabase }      from '../../../lib/supabaseClient'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(request: Request) {
  // 1) Rozparsujeme JSON z těla požadavku
  const { email, password, name } = await request.json()

  // 2) Zaregistrujeme uživatele přes Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  // 3) Vytáhneme ID nově vytvořeného uživatele
  const userId = signUpData.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unable to get user ID' }, { status: 500 })
  }

  // 4) Vložíme ho i do vlastní tabulky "User" pomocí service-role klienta
  const { error: insertError } = await supabaseAdmin
    .from('User')
    .insert([
      {
        id:    userId,
        name,
        email,
        role:  'USER', // nebo 'ADMIN'
      },
    ])
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // 5) Všechno proběhlo, vrátíme úspěch
  return NextResponse.json({ message: 'Registrace úspěšná' }, { status: 201 })
}
