// app/maintenance/create/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UnitOption {
  id: number;
  name: string;
  propertyName: string;
}

export default function CreateMaintenancePage() {
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [form, setForm] = useState({
    unitId: '',
    description: '',
    reportedBy: '',
    status: 'OPEN',
  });
  const router = useRouter();

  const fetchUnits = async () => {
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/units`);
    const data = await res.json();
    setUnits(
      data.map((u: any) => ({
        id: u.id,
        name: u.name,
        propertyName: u.property.name,
      }))
    );
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = window.location.origin;
    await fetch(`${origin}/api/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId: Number(form.unitId),
        description: form.description,
        reportedBy: form.reportedBy,
        status: form.status,
      }),
    });
    router.push('/maintenance');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nahlásit závadu</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-3">
          Jednotka
          <select
            value={form.unitId}
            onChange={(e) => setForm({ ...form, unitId: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">Vyberte jednotku</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.propertyName})
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-3">
          Popis závady
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Nahlásil
          <input
            type="text"
            value={form.reportedBy}
            onChange={(e) => setForm({ ...form, reportedBy: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Stav
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="OPEN">OPEN</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Odeslat
        </button>
      </form>
    </div>
  );
}
