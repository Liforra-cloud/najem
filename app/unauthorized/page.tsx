// app/unauthorized/page.tsx

'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Nepovolený přístup</h1>
      <p className="mb-6">K této stránce nemáte dostatečná oprávnění.</p>
      <Link href="/dashboard">
        <a className="text-blue-600 hover:underline">Zpět na Dashboard</a>
      </Link>
    </div>
  );
}
