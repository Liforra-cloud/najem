// app/invoices/page.tsx

import { prisma } from "../../lib/prisma";
import Link from "next/link";

export default async function InvoicesPage() {
  // Načteme všechny faktury včetně pronájmu a nájemce
  const invoices = await prisma.invoice.findMany({
    include: {
      lease: {
        include: {
          tenant: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Faktury</h1>
        <Link
          href="/invoices/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Vytvořit fakturu
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nájemce</th>
            <th className="p-3 text-left">Částka</th>
            <th className="p-3 text-left">Datum vystavení</th>
            <th className="p-3 text-left">PDF</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t">
              <td className="p-3">{invoice.id}</td>
              <td className="p-3">{invoice.lease.tenant.name}</td>
              <td className="p-3">{invoice.amount}</td>
              <td className="p-3">
                {new Date(invoice.issuedAt).toLocaleDateString("cs-CZ")}
              </td>
              <td className="p-3">
                {invoice.pdfPath ? (
                  <Link
                    href={invoice.pdfPath}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Stáhnout
                  </Link>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
