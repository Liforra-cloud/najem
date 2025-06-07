// app/api/signup/route.ts
import { NextResponse } from 'next/server'
import { supabase }      from '../../../lib/supabaseClient'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 0) Zkontrolujeme, zda e-mail už nemáme v naší vlastní tabulce
    const { data: exists, error: existErr } = await supabaseAdmin
      .from('User')
      .select('id', { count: 'exact' })
      .eq('email', email)
      .maybeSingle()

    if (existErr) {
      return NextResponse.json(
        { error: 'Chyba při kontrole existence uživatele: ' + existErr.message },
        { status: 500 }
      )
    }
    if (exists) {
      return NextResponse.json(
        { error: 'Uživatel s tímto e-mailem už existuje.' },
        { status: 400 }
      )
    }

    // 1) Registrace v Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) {
      return NextResponse.json(
        { error: 'Auth error: ' + signUpError.message },
        { status: 400 }
      )
    }

    const userId = signUpData.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Nepodařilo se získat ID uživatele' },
        { status: 500 }
      )
    }

    // 2) Vložíme ho i do vlastní tabulky
    const { error: insertError } = await supabaseAdmin
      .from('User')
      .insert([{ id: userId, name, email, role: 'USER' }])
    if (insertError) {
      return NextResponse.json(
        { error: 'DB error: ' + insertError.message },
        { status: 500 }
      )
    }

    // 3) Všechno OK
    return NextResponse.json(
      { message: 'Registrace proběhla úspěšně.' },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Neočekávaná chyba.' },
      { status: 500 }
    )
  }
}
