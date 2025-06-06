// app/dashboard/page.tsx

import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

interface DashboardProps {
  propertiesCount: number;
  tenantsCount: number;
  unpaidPaymentsCount: number;
}

export default async function DashboardPage() {
  // Načteme data z databáze
  const propertiesCount = await prisma.property.count();
  const tenantsCount = await prisma.tenant.count();
  const unpaidPaymentsCount = await prisma.payment.count({
    where: { status: 'UNPAID' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Počet nemovitostí</h2>
          <p className="text-3xl mt-2">{propertiesCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Počet nájemníků</h2>
          <p className="text-3xl mt-2">{tenantsCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Nezaplacené platby</h2>
          <p className="text-3xl mt-2">{unpaidPaymentsCount}</p>
        </div>
      </div>
    </div>
  );
}
