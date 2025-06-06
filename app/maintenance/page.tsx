// app/maintenance/page.tsx

export const dynamic = "force-dynamic";
import { prisma } from '../../lib/prisma';
import { Maintenance } from '@prisma/client';

export default async function MaintenancePage() {
  const maintenances: (Maintenance & { unit: { name: string; property: { name: string } } })[] =
    await prisma.maintenance.findMany({
      include: {
        unit: { include: { property: { select: { name: true } } } },
      },
    });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Údržba</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Jednotka</th>
            <th className="p-3 text-left">Nemovitost</th>
            <th className="p-3 text-left">Popis</th>
            <th className="p-3 text-left">Nahlášeno</th>
            <th className="p-3 text-left">Stav</th>
          </tr>
        </thead>
        <tbody>
          {maintenances.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{m.unit.name}</td>
              <td className="p-3">{m.unit.property.name}</td>
              <td className="p-3">{m.description}</td>
              <td className="p-3">{m.reportedBy}</td>
              <td className={`p-3 ${m.status === 'OPEN' ? 'text-yellow-600' : 'text-green-600'}`}>
                {m.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
