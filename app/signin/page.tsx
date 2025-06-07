// app/signin/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link           from 'next/link'
import { supabase }    from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage('Chyba při přihlášení: ' + error.message)
      } else {
        router.replace('/dashboard')
      }
    } catch {
      setMessage('Neočekávaná chyba.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSignIn} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Přihlášení</h1>

        {message && (
          <div className={`mb-4 p-2 rounded ${
            message.startsWith('Chyba') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <label className="block mb-2">
          E-mail
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <label className="block mb-2">
          Heslo
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Probíhá…' : 'Přihlásit se'}
        </button>

        <p className="mt-4 text-center text-sm">
          Ještě nemáte účet?{' '}
          <Link href="/signup">
            <a className="text-green-600 hover:underline">Registrovat se</a>
          </Link>
        </p>
      </form>
    </div>
)
}
