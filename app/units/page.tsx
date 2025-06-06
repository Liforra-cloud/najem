// app/units/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Unit } from '@prisma/client';
import { useRouter } from 'next/navigation';

// Definujeme vlastní typ, který přidá jméno property
interface UnitWithProperty extends Unit {
  property: { name: string };
}

export default function UnitsPage() {
  const [units, setUnits] = useState<UnitWithProperty[]>([]);
  const router = useRouter();

  const fetchUnits = async () => {
    const res = await fetch('/api/units');
    const data: UnitWithProperty[] = await res.json();
    setUnits(data);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jednotky</h1>
        <button
          onClick={() => router.push('/units/create')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Přidat jednotku
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Název</th>
            <th className="p-3 text-left">Nemovitost</th>
            <th className="p-3 text-left">Velikost</th>
            <th className="p-3 text-left">Patro</th>
            <th className="p-3 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-t">
              <td className="p-3">{unit.name}</td>
              <td className="p-3">{unit.property.name}</td>
              <td className="p-3">{unit.size}</td>
              <td className="p-3">{unit.floor}</td>
              <td className="p-3">
                <button
                  onClick={() => router.push(`/properties/${unit.propertyId}`)}
                  className="text-blue-600 hover:underline"
                >
                  Detail nemovitosti
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
