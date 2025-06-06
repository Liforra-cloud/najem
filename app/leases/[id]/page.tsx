// app/leases/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Payment {
  id: number;
  amount: number;
  dueDate: string;
  status: string;
}

interface Invoice {
  id: number;
  amount: number;
  issuedAt: string;
}

interface LeaseDetail {
  id: number;
  startDate: string;
  endDate: string;
  rent: number;
  tenant: { name: string };
  unit: { name: string; property: { name: string } };
  payments: Payment[];
  invoices: Invoice[];
}

export default function LeaseDetailPage() {
  const [lease, setLease] = useState<LeaseDetail | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDue, setPaymentDue] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || '';
  const leaseId = parseInt(idParam, 10);

  useEffect(() => {
    if (!leaseId) return;
    const origin = window.location.origin;
    fetch(`${origin}/api/leases/${leaseId}`)
      .then((res) => res.json())
      .then((data: LeaseDetail) => setLease(data));
  }, [leaseId]);

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lease) return;
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leaseId: lease.id,
        amount: Number(paymentAmount),
        dueDate: paymentDue,
        status: 'UNPAID',
      }),
    });
    const newPayment = await res.json();
    setLease({ ...lease, payments: [...lease.payments, newPayment] });
    setPaymentAmount('');
    setPaymentDue('');
  };

  const addInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lease) return;
    const origin = window.location.origin;
    const res = await fetch(`${origin}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leaseId: lease.id,
        amount: Number(invoiceAmount),
      }),
    });
    const newInvoice = await res.json();
    setLease({ ...lease, invoices: [...lease.invoices, newInvoice] });
    setInvoiceAmount('');
  };

  if (!lease) {
    return <div className="flex items-center justify-center h-screen">Načítám…</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Smlouva: {lease.id}</h1>
      <p className="mb-2">Nájemník: {lease.tenant.name}</p>
      <p className="mb-2">
        Jednotka: {lease.unit.name} ({lease.unit.property.name})
      </p>
      <p className="mb-2">
        Období:{' '}
        {new Date(lease.startDate).toLocaleDateString()} –{' '}
        {new Date(lease.endDate).toLocaleDateString()}
      </p>
      <p className="mb-6">Nájem: {lease.rent} CZK</p>

      <h2 className="text-2xl font-semibold mb-2">Platby</h2>
      <ul className="mb-4 space-y-2">
        {lease.payments.map((p) => (
          <li key={p.id} className="bg-white p-3 rounded shadow flex justify-between">
            <span>
              {new Date(p.dueDate).toLocaleDateString()} – {p.amount} CZK
            </span>
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

      <h2 className="text-2xl font-semibold mb-2">Faktury</h2>
      <ul className="mb-4 space-y-2">
        {lease.invoices.map((inv) => (
          <li key={inv.id} className="bg-white p-3 rounded shadow flex justify-between">
            <span>
              {new Date(inv.issuedAt).toLocaleDateString()} – {inv.amount} CZK
            </span>
            <a href={`/api/invoices/${inv.id}`} className="text-blue-600 hover:underline">
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
