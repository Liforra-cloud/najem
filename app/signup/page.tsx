'use client'

import { useState } from 'react'
import { supabase }   from '../../lib/supabaseClient'

export default function SignUpPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('Chyba při registraci: ' + error.message)
    } else {
      setMessage('Registrace proběhla. Teď se můžete přihlásit.')
      setEmail('')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSignUp} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Registrace</h1>
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
            minLength={6}
            placeholder="Minimálně 6 znaků"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Probíhá…' : 'Registrovat se'}
        </button>
      </form>
    </div>
  )
}
