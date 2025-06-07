// app/layout.tsx

import './globals.css'
import SupabaseProvider from './providers/SupabaseProvider'
import Sidebar from '../components/layout/Sidebar'

export const metadata = {
  title: 'Správa nájmů',
  description: 'Aplikace pro správu nemovitostí a nájmů',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>
        {/* Zabalíme celou aplikaci do Supabase Auth Provideru */}
        <SupabaseProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}
