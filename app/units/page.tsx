// app/units/page.tsx
import { prisma } from "@/lib/prisma";

export default async function UnitsPage() {
  const units = await prisma.unit.findMany({
    include: { property: true }, // aby se načetlo i jméno nemovitosti
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seznam jednotek</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Název</th>
            <th className="p-2 border">Velikost</th>
            <th className="p-2 border">Patro</th>
            <th className="p-2 border">Nemovitost</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td className="p-2 border">{unit.name}</td>
              <td className="p-2 border">{unit.size}</td>
              <td className="p-2 border">{unit.floor}. patro</td>
              <td className="p-2 border">{unit.property?.name ?? "?"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
