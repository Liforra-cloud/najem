// app/api/properties/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

// GET /api/properties – vrátí všechny nemovitosti
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('Property')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// POST /api/properties – vytvoří novou nemovitost
export async function POST(request: Request) {
  const { name, address, ownerId } = await request.json()

  const { data, error } = await supabaseAdmin
    .from('Property')
    .insert([{ name, address, ownerId }])
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
