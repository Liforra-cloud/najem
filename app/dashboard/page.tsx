// app/dashboard/page.tsx

export const dynamic = "force-dynamic"

import React from 'react'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function DashboardPage() {
  // 1) Načteme počty z tabulek přes service‐role klienta
  const { count: propertiesCount, error: propError } = await supabaseAdmin
    .from('Property')
    .select('id', { count: 'exact', head: true })

  const { count: tenantsCount, error: tenantError } = await supabaseAdmin
    .from('Tenant')
    .select('id', { count: 'exact', head: true })

  const { count: unpaidPaymentsCount, error: payError } = await supabaseAdmin
    .from('Payment')
    .select('id', { count: 'exact', head: true })
    .filter('status', 'eq', 'UNPAID')

  // 2) Pokud by nastala chyba, můžeme ji zachytit (volitelně)
  if (propError || tenantError || payError) {
    console.error('Dashboard data error:', propError || tenantError || payError)
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Počet nemovitostí</h2>
          <p className="text-3xl mt-2">{propertiesCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Počet nájemníků</h2>
          <p className="text-3xl mt-2">{tenantsCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Nezaplacené platby</h2>
          <p className="text-3xl mt-2">{unpaidPaymentsCount ?? 0}</p>
        </div>
      </div>
    </main>
  )
}
