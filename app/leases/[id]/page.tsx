// app/leases/[id]/page.tsx

import { prisma } from '../../../lib/prisma';
import { Lease, Payment, Invoice } from '@prisma/client';
import { notFound } from 'next/navigation';
import { useState } from 'react';

interface PageProps {
  params: { id: string };
}

export default async function LeaseDetailPage({ params }: PageProps) {
  const leaseId = parseInt(params.id, 10);

  // Načteme detail smlouvy včetně nájemníka, jednotky, plateb a faktur
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      tenant: true,
      unit: { include: { property: true } },
      payments: true,
      invoices: true,
    },
  });
  if (!lease) return notFound();

  return <LeaseDetail lease={lease} />;
}

function LeaseDetail({ lease }: { lease: Lease & { payments: Payment[]; invoices: Invoice[] } }) {
  const [payments, setPayments] = useState<Payment[]>(lease.payments);
  const [invoices, setInvoices] = useState<Invoice[]>(lease.invoices);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDue, setPaymentDue] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leaseId: lease.id,
        amount: parseInt(paymentAmount, 10),
        dueDate: paymentDue,
        status: 'UNPAID',
      }),
    });
    const newPayment = await res.json();
    setPayments([...payments, newPayment]);
    setPaymentAmount('');
    setPaymentDue('');
  };

  const addInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leaseId: lease.id,
        amount: parseInt(invoiceAmount, 10),
      }),
    });
    const newInvoice = await res.json();
    setInvoices([...invoices, newInvoice]);
    setInvoiceAmount('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Smlouva: {lease.id}</h1>
      <p className="mb-2">Nájemník: {lease.tenant.name}</p>
      <p className="mb-2">
        Jednotka: {lease.unit.name} ({lease.unit.property.name})
      </p>
      <p className="mb-2">
        Období: {new Date(lease.startDate).toLocaleDateString()} – {new Date(lease.endDate).toLocaleDateString()}
      </p>
      <p className="mb-6">Nájem: {lease.rent} CZK</p>

      {/* Seznam plateb */}
      <h2 className="text-2xl font-semibold mb-2">Platby</h2>
      <ul className="mb-4 space-y-2">
        {payments.map((p) => (
          <li key={p.id} className="bg-white p-3 rounded shadow flex justify-between">
            <span>{new Date(p.dueDate).toLocaleDateString()} – {p.amount} CZK</span>
            <span className={p.status === 'PAID' ? 'text-green-600' : 'text-red-600'}>
              {p.status}
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={addPayment} className="mb-6 max-w-md bg-gray-50 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Přidat platbu</h3>
        <input
          type="number"
          placeholder="Částka (CZK)"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <input
          type="date"
          value={paymentDue}
          onChange={(e) => setPaymentDue(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Uložit platbu
        </button>
      </form>

      {/* Seznam faktur */}
      <h2 className="text-2xl font-semibold mb-2">Faktury</h2>
      <ul className="mb-4 space-y-2">
        {invoices.map((inv) => (
          <li key={inv.id} className="bg-white p-3 rounded shadow flex justify-between">
            <span>{new Date(inv.issuedAt).toLocaleDateString()} – {inv.amount} CZK</span>
            <a
              href={`/api/invoices/${inv.id}`} // V budoucnu lze vygenerovat PDF
              className="text-blue-600 hover:underline"
            >
              Stáhnout
            </a>
          </li>
        ))}
      </ul>
      <form onSubmit={addInvoice} className="max-w-md bg-gray-50 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Vytvořit fakturu</h3>
        <input
          type="number"
          placeholder="Částka (CZK)"
          value={invoiceAmount}
          onChange={(e) => setInvoiceAmount(e.target.value)}
          required
          className="mb-2 w-full border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Uložit fakturu
        </button>
      </form>
    </div>
  );
}
