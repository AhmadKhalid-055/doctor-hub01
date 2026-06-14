import { PrismaClient } from "@prisma/client";

const urls = [
  "postgres://postgres.gmbajjhfuhfavkxymjuw:DataBas1250@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
  "postgresql://postgres.gmbajjhfuhfavkxymjuw:DOCTORHUB%4004@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
  "postgresql://postgres:DOCTORHUB%4004@db.gmbajjhfuhfavkxymjuw.supabase.co:5432/postgres",
  "postgresql://postgres:DataBas1250@db.gmbajjhfuhfavkxymjuw.supabase.co:5432/postgres"
];

async function testUrl(url) {
  console.log(`\nTesting connection string: ${url.replace(/:[^:@]+@/, ":****@")}`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("✅ SUCCESS!");
    console.log("Result:", result);
    return true;
  } catch (error) {
    console.error("❌ FAILED:", error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  for (const url of urls) {
    await testUrl(url);
  }
}

run();
