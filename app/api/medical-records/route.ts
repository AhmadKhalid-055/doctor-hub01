import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// GET: Fetch medical records for a patient
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    // Patients can only view their own records
    if (payload.role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: payload.userId as string },
      });
      if (!patientProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      const records = await prisma.medicalRecord.findMany({
        where: { patientId: patientProfile.id },
        orderBy: { recordedAt: "desc" },
      });
      return NextResponse.json({ data: records });
    }

    // Doctors and Admins can view by patientId
    if (["DOCTOR", "ADMIN", "SUPER_ADMIN"].includes(payload.role as string) && patientId) {
      const records = await prisma.medicalRecord.findMany({
        where: { patientId },
        orderBy: { recordedAt: "desc" },
      });
      return NextResponse.json({ data: records });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Medical Records GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Append a new medical record (Doctors only)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Only doctors can add medical records" }, { status: 403 });
    }

    const body = await request.json();
    const { patientId, recordType, title, description, attachmentUrl } = body;

    if (!patientId || !recordType || !title || !description) {
      return NextResponse.json({ error: "patientId, recordType, title, and description are required" }, { status: 400 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: payload.userId as string },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    if (!doctorProfile) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    // Immutability: only POST (append) is allowed. No PUT/PATCH/DELETE endpoint exists.
    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        recordType,
        title,
        description,
        attachmentUrl,
        recordedBy: `Dr. ${doctorProfile.user.firstName} ${doctorProfile.user.lastName}`,
      },
    });

    return NextResponse.json({ message: "Medical record added successfully", data: record }, { status: 201 });
  } catch (error) {
    console.error("Medical Records POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
