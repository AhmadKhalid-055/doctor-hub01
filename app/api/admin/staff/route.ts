import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// Schema for creating a Doctor
const createDoctorSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  specialty: z.string().min(2),
  treatmentType: z.enum(["ALLOPATHIC", "HOMEOPATHIC", "HERBAL"]).default("ALLOPATHIC"),
  licenseNumber: z.string().min(3),
  consultationFee: z.number().min(0),
  experienceYears: z.number().min(0),
  bio: z.string().optional(),
  clinicId: z.string().uuid().optional(),
});

// Schema for creating an Assistant
const createAssistantSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  clinicId: z.string().uuid(),
});

async function getAuthUser(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

// POST /api/admin/staff?type=doctor|assistant
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const body = await request.json();

    if (type === "doctor") {
      const parsed = createDoctorSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation failed", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const {
        firstName, lastName, email, password, phone,
        specialty, treatmentType, licenseNumber,
        consultationFee, experienceYears, bio, clinicId
      } = parsed.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: { email, passwordHash, firstName, lastName, phone, role: "DOCTOR" }
        });
        await tx.doctorProfile.create({
          data: {
            userId: u.id,
            specialty,
            treatmentType,
            licenseNumber,
            consultationFee,
            experienceYears,
            bio,
            ...(clinicId ? { clinics: { connect: { id: clinicId } } } : {}),
          }
        });
        return u;
      });

      return NextResponse.json(
        { message: "Doctor account created", userId: newUser.id },
        { status: 201 }
      );
    }

    if (type === "assistant") {
      const parsed = createAssistantSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation failed", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { firstName, lastName, email, password, phone, clinicId } = parsed.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: { email, passwordHash, firstName, lastName, phone, role: "ASSISTANT" }
        });
        await tx.assistantProfile.create({
          data: { userId: u.id, clinicId }
        });
        return u;
      });

      return NextResponse.json(
        { message: "Assistant account created", userId: newUser.id },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid type. Use ?type=doctor or ?type=assistant" }, { status: 400 });

  } catch (error) {
    console.error("[Admin Staff Create Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/admin/staff?type=doctor|assistant  — list staff
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "doctor") {
      const doctors = await prisma.doctorProfile.findMany({
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, createdAt: true }
          },
          clinics: { select: { id: true, name: true } }
        }
      });
      return NextResponse.json({ doctors });
    }

    if (type === "assistant") {
      const assistants = await prisma.assistantProfile.findMany({
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, createdAt: true }
          },
          clinic: { select: { id: true, name: true } }
        }
      });
      return NextResponse.json({ assistants });
    }

    return NextResponse.json({ error: "Invalid type. Use ?type=doctor or ?type=assistant" }, { status: 400 });
  } catch (error) {
    console.error("[Admin Staff List Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/staff?type=doctor|assistant&userId=<id>
export async function DELETE(request: Request) {
  const user = await getAuthUser(request);
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Cascade delete: profile is deleted first due to onDelete: Cascade in schema
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "Staff account removed" });
  } catch (error) {
    console.error("[Admin Staff Delete Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
