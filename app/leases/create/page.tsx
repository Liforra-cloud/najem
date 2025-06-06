// app/leases/create/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Property, Unit, Tenant } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Option {
  id: number;
  label: string;
}

export default function CreateLeasePage() {
  const [tenants, setTenants] = useState<Option[]>([]);
  const [units, setUnits] = useState<Option[]>([]);
  const [form, setForm] = useState({
    tenantId: '',
    unitId: '',
    startDate: '',
    endDate: '',
    rent: '',
  });
  const router = useRouter();

  const fetchTenants = async () => {
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/tenants`);
    const data: Tenant[] = await res.json();
    setTenants(data.map((t) => ({ id: t.id, label: t.name })));
  };

  const fetchUnits = async () => {
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/units`);
    const data: (Unit & { property: { name: string } })[] = await res.json();
    setUnits(data.map((u) => ({ id: u.id, label: `${u.name} (${u.property.name})` })));
  };

  useEffect(() => {
    fetchTenants();
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = window.location.origin;
    await fetch(`${origin}/api/leases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: parseInt(form.tenantId, 10),
        unitId: parseInt(form.unitId, 10),
        startDate: form.startDate,
        endDate: form.endDate,
        rent: parseInt(form.rent, 10),
      }),
    });
    router.push('/leases');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Přidat smlouvu</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-3">
          Nájemník
          <select
            value={form.tenantId}
            onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">Vyberte nájemníka</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
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
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-3">
          Datum od
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Datum do
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>
        <label className="block mb-3">
          Nájem (CZK)
          <input
            type="number"
            value={form.rent}
            onChange={(e) => setForm({ ...form, rent: e.target.value })}
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
