import { PrismaClient } from '@prisma/client';

async function testConnection(url) {
  console.log(`\n--- Testing Connection: ${url.replace(/:[^:@]+@/, ':***@')} ---`);
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });
  try {
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("✅ Success! Result:", result);
  } catch (err) {
    console.error("❌ Failed:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  const password = "DataBas1250";
  const projectRef = "gmbajjhfuhfavkxymjuw";
  
  // 1. Transaction Pooler (port 6543)
  const url1 = `postgres://postgres.${projectRef}:${password}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  await testConnection(url1);

  // 2. Session Pooler (port 5432)
  const url2 = `postgres://postgres.${projectRef}:${password}@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres`;
  await testConnection(url2);

  // 3. Direct Connection (port 5432 to db host)
  const url3 = `postgres://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
  await testConnection(url3);
}

run();
