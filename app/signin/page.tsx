// app/signin/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Pošleme magic link – žádné signUp, jen signInWithOtp
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Chyba při odesílání odkazu: ' + error.message)
    } else {
      setMessage('Zkontroluj e-mail – poslali jsme ti odkaz na přihlášení.')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSignIn} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Přihlášení</h1>
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              message.startsWith('Chyba') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
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
          {loading ? 'Probíhá odesílání…' : 'Odeslat magic-link'}
        </button>
      </form>
    </div>
  )
}
