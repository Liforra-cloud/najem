// components/layout/Layout.tsx

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();

  // Zatímco se session načítá, můžeme zobrazit „Loading...“
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Načítám...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Levý postranní panel */}
      <Sidebar />

      {/* Hlavní obsah */}
      <main className="flex-1 overflow-y-auto p-6 bg-white">{children}</main>
    </div>
  );
}
