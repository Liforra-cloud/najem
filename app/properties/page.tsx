// app/properties/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Property } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface PropertyForm {
  name: string;
  address: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState<PropertyForm>({ name: '', address: '' });
  const router = useRouter();

  // Načtení existujících nemovitostí
  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Odeslání nové nemovitosti
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', address: '' });
    fetchProperties();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nemovitosti</h1>

      {/* Formulář pro přidání nové nemovitosti */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Název"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border border-gray-300 rounded p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Adresa"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          className="border border-gray-300 rounded p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Přidat
        </button>
      </form>

      {/* Tabulka existujících nemovitostí */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Název</th>
            <th className="p-3 text-left">Adresa</th>
            <th className="p-3 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.id} className="border-t">
              <td className="p-3">{prop.name}</td>
              <td className="p-3">{prop.address}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => router.push(`/properties/${prop.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Detail
                </button>
                {/* Edit a Delete lze přidat později */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
