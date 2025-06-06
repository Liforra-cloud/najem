// app/tenants/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Tenant } from '@prisma/client';

interface TenantForm {
  name: string;
  contact: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState<TenantForm>({ name: '', contact: '' });

  const fetchTenants = async () => {
    const res = await fetch('/api/tenants');
    const data: Tenant[] = await res.json();
    setTenants(data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', contact: '' });
    fetchTenants();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nájemníci</h1>

      {/* Formulář pro přidání nájemníka */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Jméno"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border border-gray-300 rounded p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Kontakt"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
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

      {/* Tabulka existujících nájemníků */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Jméno</th>
            <th className="p-3 text-left">Kontakt</th>
            <th className="p-3 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-t">
              <td className="p-3">{tenant.name}</td>
              <td className="p-3">{tenant.contact}</td>
              <td className="p-3 text-right">
                {/* Edit / Delete lze doplnit později */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
