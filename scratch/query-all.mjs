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
    const clinics = await prisma.clinic.findMany();
    const doctors = await prisma.doctorProfile.findMany({
      include: { user: true }
    });
    const assistants = await prisma.assistantProfile.findMany({
      include: { user: true }
    });
    const admins = await prisma.adminProfile.findMany({
      include: { user: true }
    });
    const users = await prisma.user.findMany();

    console.log("Clinics:", JSON.stringify(clinics, null, 2));
    console.log("Doctors:", JSON.stringify(doctors, null, 2));
    console.log("Assistants:", JSON.stringify(assistants, null, 2));
    console.log("Admins:", JSON.stringify(admins, null, 2));
    console.log("Total Users Count:", users.length);
  } catch (error) {
    console.error("Error querying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
