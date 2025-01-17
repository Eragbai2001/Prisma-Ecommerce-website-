// filepath: /c:/Users/Joshua/Desktop/next-prisma-tailwind-ecommerce/apps/admin/test-connection.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();