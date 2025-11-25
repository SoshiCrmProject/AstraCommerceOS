import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  console.log('Initializing Prisma Client...');
  console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
  console.log('DIRECT_URL configured:', !!process.env.DIRECT_URL);
  
  return new PrismaClient({
    log: ['query', 'error', 'warn'], // Enable all logging in production temporarily
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
