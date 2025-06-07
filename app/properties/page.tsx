// app/properties/page.tsx

import React from 'react'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function PropertiesPage() {
  // 1) Načteme data přímo pomocí service‐role klienta
  const { data: properties, error } = await supabaseAdmin
    .from('Property')
    .select('*')

  // 2) Pokud nastala chyba, vypíšeme ji uživateli
  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Nemovitosti</h1>
        <div className="text-red-600">Chyba: {error.message}</div>
      </main>
    )
  }

  // 3) Jinak vykreslíme tabulku
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nemovitosti</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Název</th>
            <th className="border p-2 text-left">Adresa</th>
          </tr>
        </thead>
        <tbody>
          {properties && properties.length > 0 ? (
            properties.map((prop) => (
              <tr key={prop.id}>
                <td className="border p-2">{prop.name}</td>
                <td className="border p-2">{prop.address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border p-2 text-center">
                Žádné nemovitosti k dispozici.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}

