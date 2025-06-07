// app/api/units/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

// GET /api/units – seznam všech jednotek
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('Unit')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// POST /api/units – vytvoří novou jednotku
export async function POST(request: Request) {
  const { name, size, floor, propertyId } = await request.json()

  const { data, error } = await supabaseAdmin
    .from('Unit')
    .insert([{ name, size, floor, propertyId }])
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
