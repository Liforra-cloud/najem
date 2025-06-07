// app/properties/page.tsx
export const dynamic = 'force-dynamic'

import { prisma } from '../../lib/prisma'

export default async function PropertiesPage() {
  // Spočítáme celkový počet jednotek
  const unitsCount = await prisma.unit.count()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Přehled nemovitostí</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Celkem jednotek</h2>
          <p className="text-4xl mt-2">{unitsCount}</p>
        </div>
      </div>

      <p className="text-gray-600">
        Zatím zde budeme zobrazovat jen celkový počet jednotek.  
        Do budoucna sem přidáme seznam nemovitostí a detailní přehled jednotek.
      </p>
    </div>
  )
}
