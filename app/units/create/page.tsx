// app/units/create/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Property } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface PropertyOption {
  id: number;
  name: string;
}

export default function CreateUnitPage() {
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [form, setForm] = useState({
    name: '',
    size: '',
    floor: '',
    propertyId: '',
  });
  const router = useRouter();

  const fetchProperties = async () => {
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/properties`);
    const data: Property[] = await res.json();
    setProperties(data.map((p) => ({ id: p.id, name: p.name })));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = window.location.origin;
    await fetch(`${origin}/api/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        size: form.size,
        floor: parseInt(form.floor, 10),
        propertyId: parseInt(form.propertyId, 10),
      }),
    });
    router.push('/units');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Přidat jednotku</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-3">
          Nemovitost
          <select
            value={form.propertyId}
            onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">Vyberte nemovitost</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-3">
          Název jednotky
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Velikost (např. 2+kk)
          <input
            type="text"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Patro
          <input
            type="number"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Uložit
        </button>
      </form>
    </div>
  );
}
