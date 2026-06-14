import { PrismaClient } from '@prisma/client';

const password = "DataBas1250";
const projectRef = "gmbajjhfuhfavkxymjuw";
const url = `postgres://postgres.${projectRef}:${password}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;

const prisma = new PrismaClient({
  datasources: {
    db: { url }
  }
});

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    console.log("Registered Users in DB:", JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
