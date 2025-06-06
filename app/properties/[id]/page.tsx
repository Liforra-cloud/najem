// app/properties/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Unit {
  id: number;
  name: string;
  size: string;
  floor: number;
}

interface PropertyDetail {
  id: number;
  name: string;
  address: string;
  units: Unit[];
}

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [unitName, setUnitName] = useState('');
  const [unitSize, setUnitSize] = useState('');
  const [unitFloor, setUnitFloor] = useState('');
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || '';
  const propertyId = parseInt(idParam, 10);

  useEffect(() => {
    if (!propertyId) return;
    const origin = window.location.origin;
    fetch(`${origin}/api/properties/${propertyId}`)
      .then((res) => res.json())
      .then((data: PropertyDetail) => setProperty(data));
  }, [propertyId]);

  const addUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: unitName,
        size: unitSize,
        floor: parseInt(unitFloor, 10),
        propertyId: property.id,
      }),
    });
    const newUnit: Unit = await res.json();
    setProperty({ ...property, units: [...property.units, newUnit] });
    setUnitName('');
    setUnitSize('');
    setUnitFloor('');
  };

  if (!property) {
    return <div className="flex items-center justify-center h-screen">Načítám…</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      <p className="mb-6 text-gray-700">{property.address}</p>

      <h2 className="text-2xl font-semibold mb-2">Jednotky</h2>
      <ul className="mb-6 space-y-2">
        {property.units.map((unit) => (
          <li key={unit.id} className="bg-white p-3 rounded shadow">
            {unit.name} ({unit.size}, patro {unit.floor})
          </li>
        ))}
      </ul>

      <form onSubmit={addUnit} className="bg-gray-50 p-4 rounded shadow w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Přidat jednotku</h3>
        <input
          type="text"
          placeholder="Název jednotky"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="Velikost (např. 2+kk)"
          value={unitSize}
          onChange={(e) => setUnitSize(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <input
          type="number"
          placeholder="Patro"
          value={unitFloor}
          onChange={(e) => setUnitFloor(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Přidat jednotku
        </button>
      </form>
    </div>
  );
}
