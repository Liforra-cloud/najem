// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../../lib/prisma';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user!,
        id: user.id,
        role: user.role as string,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
