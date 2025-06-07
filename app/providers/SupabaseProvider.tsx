'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import { ReactNode } from 'react'

interface SupabaseProviderProps {
  children: ReactNode
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}
