// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,            // URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!,           // SERVICE‐ROLE KEY
  {
    auth: { persistSession: false },
    global: { headers: { 'x-my-custom-header': 'my-app' } },
  }
)
