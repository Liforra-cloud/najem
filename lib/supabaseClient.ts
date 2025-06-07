// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// 1) Čteme URL a ANON key z env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2) Inicializujeme klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
