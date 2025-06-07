// app/api/signup/route.ts
console.log('SERVICE ROLE KEY prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,8))

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  // 1) Register user in Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  const userId = signUpData.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unable to get user ID' }, { status: 500 })
  }

  // 2) Insert into our own "User" table
  const { error: insertError } = await supabaseAdmin
    .from('User')
    .insert([
      {
        id: userId,
        name,
        email,
        role: 'USER', // nebo 'ADMIN', podle potřeby
      },
    ])
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // 3) Vraťme úspěch
  return NextResponse.json({ message: 'Registrace úspěšná' }, { status: 201 })
}
