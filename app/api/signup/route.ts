// app/api/signup/route.ts

import { NextResponse } from 'next/server'
import { supabase }      from '../../../lib/supabaseClient'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Debug: vraťme prefix service-role key (není vidět v browser console,
    // ale ve Vercel Logs nebo v next dev terminálu)
    console.log('SR-KEY prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,8))

    // 1) Registrace v Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) {
      return NextResponse.json(
        { step: 'auth.signUp', message: signUpError.message, status: signUpError.status },
        { status: 400 }
      )
    }

    const userId = signUpData.user?.id
    if (!userId) {
      return NextResponse.json(
        { step: 'noUserId', message: 'Nepodařilo se načíst user.id' },
        { status: 500 }
      )
    }

    // 2) Vložení do vlastní tabulky pomocí service-role klienta
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('User')
      .insert([{ id: userId, name, email, role: 'USER' }])
      .select() // vrátíme vložený řádek
      .single()

    if (insertError) {
      return NextResponse.json(
        { step: 'admin.insert', message: insertError.message, details: insertError },
        { status: 500 }
      )
    }

    // 3) Úspěch
    return NextResponse.json({ message: 'Registrace úspěšná', user: insertData }, { status: 201 })
  } catch (err) {
    // 4) Libovolná neočekávaná chyba
    console.error('Unexpected error in /api/signup:', err)
    return NextResponse.json(
      { step: 'unexpected', message: (err as Error).message },
      { status: 500 }
    )
  }
}
