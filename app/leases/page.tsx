// app/leases/page.tsx

'use client';

import { useEffect, useState } from 'react';

interface LeaseWithRelations {
  id: number;
  startDate: string;
  endDate: string;
  rent: number;
  tenant: { name: string };
  unit: { name: string; property: { name: string } };
}

export default function LeasesPage() {
  const [leases, setLeases] = useState<LeaseWithRelations[]>([]);

  useEffect(() => {
    fetch('/api/leases')
      .then((res) => res.json())
      .then((data: LeaseWithRelations[]) => setLeases(data));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smlouvy</h1>
        <button
          onClick={() => (window.location.href = '/leases/create')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Přidat smlouvu
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nájemník</th>
            <th className="p-3 text-left">Jednotka</th>
            <th className="p-3 text-left">Nemovitost</th>
            <th className="p-3 text-left">Datum od</th>
            <th className="p-3 text-left">Datum do</th>
            <th className="p-3 text-left">Nájem</th>
            <th className="p-3 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {leases.map((lease) => (
            <tr key={lease.id} className="border-t">
              <td className="p-3">{lease.tenant.name}</td>
              <td className="p-3">{lease.unit.name}</td>
              <td className="p-3">{lease.unit.property.name}</td>
              <td className="p-3">{new Date(lease.startDate).toLocaleDateString()}</td>
              <td className="p-3">{new Date(lease.endDate).toLocaleDateString()}</td>
              <td className="p-3">{lease.rent}</td>
              <td className="p-3">
                <button
                  onClick={() => (window.location.href = `/leases/${lease.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

