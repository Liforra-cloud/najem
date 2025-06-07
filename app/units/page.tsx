// app/units/page.tsx
import { prisma } from "@/lib/prisma";

export default async function UnitsPage() {
  const units = await prisma.unit.findMany();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Jednotky</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Název</th>
            <th className="p-2 border">Velikost</th>
            <th className="p-2 border">Nájem</th>
            <th className="p-2 border">Nájemce</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td className="p-2 border">{unit.name}</td>
              <td className="p-2 border">{unit.size || "-"}</td>
              <td className="p-2 border">{unit.rent ? `${unit.rent} Kč` : "-"}</td>
              <td className="p-2 border">{unit.tenantName || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
