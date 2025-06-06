// app/layout.tsx

import './globals.css';
import AuthProvider from '../components/providers/AuthProvider';
import Sidebar from '../components/layout/Sidebar';

export const metadata = {
  title: 'Správa nájmů',
  description: 'Aplikace pro správu nemovitostí a nájmů',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        {/* Přesunuli jsme SessionProvider do klientské složky */}
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
