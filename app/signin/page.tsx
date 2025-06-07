// app/signin/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState<string | null>(null)
  const router                  = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // chyba v přihlášení
        setMessage('Chyba při přihlášení: ' + error.message)
      } else if (data.session) {
        // úspěšné přihlášení
        router.replace('/dashboard')
      } else {
        // neočekávaný stav, žádná session a žádná chyba
        setMessage('Přihlášení selhalo, zkuste to prosím znovu.')
      }
    } catch (err) {
      // jakákoli další neočekávaná chyba
      console.error('SignIn unexpected error', err)
      setMessage('Neočekávaná chyba při přihlášení.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSignIn}
        className="p-8 bg-white rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl mb-4">Přihlášení</h1>
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              message.startsWith('Chyba')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
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
          />
        </label>
        <label className="block mb-2">
          Heslo
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </form>
    </div>
  )
}
