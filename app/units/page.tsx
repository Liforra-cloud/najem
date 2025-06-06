// app/units/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "../../lib/prisma";
import Link from "next/link";

export default async function UnitsPage() {
  const units = await prisma.unit.findMany({
    include: { property: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jednotky</h1>
        <Link
          href="/units/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Přidat jednotku
        </Link>
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
                <Link
                  href={`/properties/${unit.property.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Detail nemovitosti
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
