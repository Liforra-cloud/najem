// lib/supabaseAdmin.ts

import { createClient } from '@supabase/supabase-js'

// URL a service-role key z .env.local
const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service-role klient se hodí pro serverové API (obejde RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
