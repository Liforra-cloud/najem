'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../../lib/supabaseClient'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/properties', label: 'Nemovitosti' },
  { href: '/units', label: 'Jednotky' },
  { href: '/tenants', label: 'Nájemníci' },
  { href: '/leases', label: 'Smlouvy' },
  { href: '/payments', label: 'Platby' },
  { href: '/invoices', label: 'Faktury' },
  { href: '/maintenance', label: 'Údržba' },
  { href: '/settings', label: 'Nastavení' },
]

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname       = usePathname()
  const router         = useRouter()

  if (!session) return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/signin')
  }

  return (
    <aside className="w-60 bg-gray-100 h-screen p-4 shadow-md flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold">Správa nájmů</h2>
          <p className="text-sm text-gray-600">Vítejte, {session.user.email}</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={`block px-3 py-2 rounded ${
                      pathname === item.href
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-left text-red-600 rounded hover:bg-red-100"
        >
          Odhlásit se
        </button>
      </div>
    </aside>
  )
}
