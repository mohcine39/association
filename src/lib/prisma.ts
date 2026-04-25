import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Lazy initialization using a Proxy prevents Prisma from being instantiated during build-time module evaluation
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: ['query'],
      });
    }
    return Reflect.get(globalForPrisma.prisma, prop);
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
