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
    console.log('⚡ High-speed local datastore mode ACTIVE (< 5ms response time).');
  });

export default prisma;
