// app/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    const body = await res.json()

    if (!res.ok) {
      setMessage('Chyba: ' + body.error)
    } else {
      setMessage('Registrace úspěšná! Nyní se můžete přihlásit.')
      // volitelně přesměrujte:
      router.push('/signin')
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
          Jméno
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>
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
            minLength={6}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Minimálně 6 znaků"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Probíhá registrace…' : 'Registrovat se'}
        </button>
      </form>
    </div>
  )
}
