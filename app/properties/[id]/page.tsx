// app/properties/[id]/page.tsx

import { prisma } from '../../../lib/prisma';
import { Unit, Property } from '@prisma/client';
import { notFound } from 'next/navigation';
import { useState } from 'react';

interface PageProps {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const propertyId = parseInt(params.id, 10);

  // Načteme detail nemovitosti včetně jednotek
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { units: true },
  });

  if (!property) return notFound();

  return <PropertyDetail property={property} />;
}

function PropertyDetail({ property }: { property: Property & { units: Unit[] } }) {
  const [units, setUnits] = useState<Unit[]>(property.units);
  const [unitName, setUnitName] = useState('');
  const [unitSize, setUnitSize] = useState('');
  const [unitFloor, setUnitFloor] = useState('');

  // Odeslat novou jednotku
  const addUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: unitName,
        size: unitSize,
        floor: parseInt(unitFloor, 10),
        propertyId: property.id,
      }),
    });
    const newUnit = await res.json();
    setUnits([...units, newUnit]);
    setUnitName('');
    setUnitSize('');
    setUnitFloor('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      <p className="mb-6 text-gray-700">{property.address}</p>

      {/* Seznam jednotek */}
      <h2 className="text-2xl font-semibold mb-2">Jednotky</h2>
      <ul className="mb-6 space-y-2">
        {units.map((unit) => (
          <li key={unit.id} className="bg-white p-3 rounded shadow">
            {unit.name} ({unit.size}, patro {unit.floor})
          </li>
        ))}
      </ul>

      {/* Formulář pro přidání nové jednotky */}
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
