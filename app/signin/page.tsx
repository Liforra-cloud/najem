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

    // 1) Zkusíme registrovat (pokud už existuje, vrátí error, který ignorujeme)
    const { error: signUpError } = await supabase.auth.signUp({ email })
    if (signUpError && signUpError.status !== 400) {
      // Jiná chyba než „uživatel existuje“
      setMessage('Chyba při registraci: ' + signUpError.message)
      setLoading(false)
      return
    }

    // 2) Po registraci (nebo pokud už existoval) pošleme magic link
    const { error: signInError } = await supabase.auth.signInWithOtp({ email })
    if (signInError) {
      setMessage('Chyba při posílání odkazu: ' + signInError.message)
    } else {
      setMessage('Zkontroluj e-mail – poslali jsme ti odkaz na přihlášení.')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSignIn} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Přihlášení / Registrace</h1>
        {message && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>}
        <label className="block mb-2">
          E-mail
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          {loading ? 'Probíhá...' : 'Pokračovat'}
        </button>
      </form>
    </div>
  )
}
