import { PrismaClient } from '@prisma/client';

export let isDbOnline = false;

export const prisma = new PrismaClient({
  log: ['error'],
});

prisma
  .$connect()
  .then(() => {
    isDbOnline = true;
    console.log('✅ PostgreSQL Database connected successfully!');
  })
  .catch(() => {
    isDbOnline = false;
    console.error('❌ PostgreSQL unavailable. Protected API requests will fail closed.');
  });

export default prisma;
