// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL, // 👈 tohle zajistí použití přímé URL
      },
    },
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
