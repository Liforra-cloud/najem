// app/page.tsx

import { supabase } from '@/lib/supabaseClient'

export default async function Page() {
  // 1) Načteme všechny záznamy z tabulky Property
  const { data, error } = await supabase.from('Property').select('*')

  // 2) Vypíšeme je do konzole (v terminálu, kde běží `npm run dev`)
  console.log('Supabase Property rows:', data, 'Error:', error)

  // 3) Vrátíme jednoduchou UI pro kontrolu
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase – seznam nemovitostí</h1>
      {error && <p style={{ color: 'red' }}>Chyba: {error.message}</p>}
      {!error && (
        <ul>
          {data && data.length > 0 ? (
            data.map((prop: any) => (
              <li key={prop.id}>
                <strong>{prop.name}</strong> – {prop.address}
              </li>
            ))
          ) : (
            <li>(v tabulce `Property` zatím žádná data)</li>
          )}
        </ul>
      )}
    </main>
  )
}
