// app/invoices/page.tsx

import { prisma } from '../../lib/prisma';
import { Invoice } from '@prisma/client';

export default async function InvoicesPage() {
  const invoices: (Invoice & { lease: { tenant: { name: string }; unit: { name: string } } })[] =
    await prisma.invoice.findMany({
      include: {
        lease: {
          include: {
            tenant: { select: { name: true } },
            unit: { select: { name: true } },
          },
        },
      },
    });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Faktury</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nájemník</th>
            <th className="p-3 text-left">Jednotka</th>
            <th className="p-3 text-left">Datum vystavení</th>
            <th className="p-3 text-left">Částka</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-t">
              <td className="p-3">{inv.lease.tenant.name}</td>
              <td className="p-3">{inv.lease.unit.name}</td>
              <td className="p-3">{new Date(inv.issuedAt).toLocaleDateString()}</td>
              <td className="p-3">{inv.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
