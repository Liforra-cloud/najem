// app/page.tsx

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Při navigaci na kořenovou URL automaticky přesměrujeme na /dashboard
  redirect('/dashboard');
}
