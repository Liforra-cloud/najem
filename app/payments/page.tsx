// app/payments/page.tsx

export const dynamic = "force-dynamic";
import { prisma } from '../../lib/prisma';
import { Payment } from '@prisma/client';

export default async function PaymentsPage() {
  const payments: (Payment & { lease: { tenant: { name: string }; unit: { name: string } } })[] =
    await prisma.payment.findMany({
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
      <h1 className="text-3xl font-bold mb-6">Platby</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nájemník</th>
            <th className="p-3 text-left">Jednotka</th>
            <th className="p-3 text-left">Datum splatnosti</th>
            <th className="p-3 text-left">Částka</th>
            <th className="p-3 text-left">Stav</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.lease.tenant.name}</td>
              <td className="p-3">{p.lease.unit.name}</td>
              <td className="p-3">{new Date(p.dueDate).toLocaleDateString()}</td>
              <td className="p-3">{p.amount}</td>
              <td className={`p-3 ${p.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
