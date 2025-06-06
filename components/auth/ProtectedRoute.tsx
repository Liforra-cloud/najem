// components/auth/ProtectedRoute.tsx

'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // Nepovinné: pokud chceme kontrolovat roli
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Pokud nebyla session načtena, čekáme
    if (status === 'loading') return;

    // Jestliže uživatel není přihlášen, přesměrujeme na /login
    if (!session) {
      router.push('/login');
      return;
    }

    // Jestliže je vyžadována konkrétní role a uživatel ji nemá, přesměrujeme na /unauthorized
    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [session, status, router, requiredRole]);

  // Pokud není session ani načtena, nebo se uživatel přesměrovává, nezobrazujeme obsah
  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center h-screen">Načítám...</div>;
  }

  // Jinak vykreslíme děti
  return <>{children}</>;
}
