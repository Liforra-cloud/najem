// app/page.tsx
'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function HomePage() {
  const session = useSession()
  const router = useRouter()

  // Pokud už je přihlášený, přesměrujeme na dashboard
  useEffect(() => {
    if (session) {
      router.replace('/dashboard')
    }
  }, [session, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8">Správa nájmů</h1>
      <div className="space-x-4">
        <Link href="/signin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Přihlásit se
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
            Zaregistrovat
          </button>
        </Link>
      </div>
    </div>
  )
}
