import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const password = "DataBas1250";
const projectRef = "gmbajjhfuhfavkxymjuw";
const url = `postgres://postgres.${projectRef}:${password}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;

const prisma = new PrismaClient({
  datasources: {
    db: { url }
  }
});

async function main() {
  console.log("🌱 Starting seeding process...");
  const saltRounds = 10;
  const hash = await bcrypt.hash("DataBas1250", saltRounds);

  // 1. Create a Clinic
  console.log("Creating Clinic...");
  const clinic = await prisma.clinic.create({
    data: {
      name: "City Health Medical Center",
      address: "123 Main Street",
      city: "Seoul",
      phone: "+82-2-1234-5678",
      email: "info@cityhealth.com"
    }
  });
  console.log("Clinic created:", clinic.id);

  // 2. Create a Doctor User
  console.log("Creating Doctor...");
  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor_test@example.com",
      passwordHash: hash,
      role: "DOCTOR",
      firstName: "James",
      lastName: "Smith",
      phone: "+82-10-1111-2222"
    }
  });

  const doctorProfile = await prisma.doctorProfile.create({
    data: {
      userId: doctorUser.id,
      specialty: "General Practice",
      treatmentType: "ALLOPATHIC",
      diseasesTreated: ["Fever", "Flu", "Common Cold", "Headache"],
      licenseNumber: "LIC-12345",
      bio: "Experienced family physician dedicated to patient-centric care.",
      consultationFee: 50.00,
      experienceYears: 12,
      clinics: {
        connect: { id: clinic.id }
      }
    }
  });
  console.log("Doctor created. User ID:", doctorUser.id, "Profile ID:", doctorProfile.id);

  // 3. Create an Assistant User
  console.log("Creating Assistant...");
  const assistantUser = await prisma.user.create({
    data: {
      email: "assistant_test@example.com",
      passwordHash: hash,
      role: "ASSISTANT",
      firstName: "Sarah",
      lastName: "Connor",
      phone: "+82-10-3333-4444"
    }
  });

  const assistantProfile = await prisma.assistantProfile.create({
    data: {
      userId: assistantUser.id,
      clinicId: clinic.id
    }
  });
  console.log("Assistant created. User ID:", assistantUser.id, "Profile ID:", assistantProfile.id);

  // 4. Create an Admin User
  console.log("Creating Admin...");
  const adminUser = await prisma.user.create({
    data: {
      email: "admin_test@example.com",
      passwordHash: hash,
      role: "ADMIN",
      firstName: "John",
      lastName: "Miller",
      phone: "+82-10-5555-6666"
    }
  });

  const adminProfile = await prisma.adminProfile.create({
    data: {
      userId: adminUser.id,
      clinicId: clinic.id
    }
  });
  console.log("Admin created. User ID:", adminUser.id, "Profile ID:", adminProfile.id);

  // 5. Create a Super Admin User
  console.log("Creating Super Admin...");
  const superAdminUser = await prisma.user.create({
    data: {
      email: "super_admin_test@example.com",
      passwordHash: hash,
      role: "SUPER_ADMIN",
      firstName: "Alex",
      lastName: "Chief",
      phone: "+82-10-7777-8888"
    }
  });
  console.log("Super Admin created. User ID:", superAdminUser.id);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
