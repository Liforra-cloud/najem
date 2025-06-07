// app/signin/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Chyba při odesílání e-mailu: ' + error.message)
    } else {
      setMessage('Zkontroluj svůj e-mail, poslali jsme ti přihlašovací odkaz.')
      // můžete přesměrovat např. na úvodní stránku:
      // router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSignIn}
        className="p-8 bg-white rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl mb-4">Přihlášení</h1>
        {message && (
          <div
            className={`p-2 mb-4 text-sm ${
              message.startsWith('Chyba')
                ? 'text-red-700 bg-red-100'
                : 'text-green-700 bg-green-100'
            } rounded`}
          >
            {message}
          </div>
        )}
        <label className="block mb-2">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
            placeholder="tvůj@email.cz"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Odesíláme…' : 'Odeslat magic-link'}
        </button>
      </form>
    </div>
  )
}
