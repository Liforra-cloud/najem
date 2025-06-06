// app/layout.tsx

import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';

export const metadata = {
  title: 'Správa nájmů',
  description: 'Aplikace pro správu nemovitostí a nájmů',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <SessionProvider>
          {/* ProtectedRoute zabalí celý obsah a zajistí, že uživatel je přihlášen */}
          <ProtectedRoute>
            {/* Layout vykreslí Sidebar a hlavní obsah */}
            <Layout>{children}</Layout>
          </ProtectedRoute>
        </SessionProvider>
      </body>
    </html>
  );
}

