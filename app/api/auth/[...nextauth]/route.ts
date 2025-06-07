// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER!,  // z .env: smtp://uživatel:heslo@host:port
      from: process.env.EMAIL_FROM!,      // z .env: noreply@vasedomena.cz
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,   // z .env
}

const handler = NextAuth(authOptions)

// Pro App Router je potřeba export GET i POST
export { handler as GET, handler as POST }
