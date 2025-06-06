// components/layout/Sidebar.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/properties', label: 'Nemovitosti' },
  { href: '/units', label: 'Jednotky' },
  { href: '/tenants', label: 'Nájemníci' },
  { href: '/leases', label: 'Smlouvy' },
  { href: '/payments', label: 'Platby' },
  { href: '/invoices', label: 'Faktury' },
  { href: '/maintenance', label: 'Údržba' },
  { href: '/settings', label: 'Nastavení' },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  // Pokud není session, neukazujeme nic (layout aplikace chrání ProtectedRoute)
  if (!session) return null;

  return (
    <aside className="w-60 bg-gray-100 h-screen p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Správa nájmů</h2>
        <p className="text-sm text-gray-600">Vítejte, {session.user?.name}</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={`block px-3 py-2 rounded ${
                    router.pathname === item.href
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
