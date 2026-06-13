import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prescriptionSchema } from "@/lib/validators";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// GET: Fetch prescriptions
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Patient views their own prescriptions
    if (payload.role === "PATIENT") {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: payload.userId as string },
      });
      if (!patientProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      const prescriptions = await prisma.prescription.findMany({
        where: { patientId: patientProfile.id },
        include: {
          items: true,
          doctor: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          appointment: { select: { dateTime: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: prescriptions });
    }

    // Doctor views prescriptions they wrote
    if (payload.role === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: payload.userId as string },
      });
      if (!doctorProfile) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

      const prescriptions = await prisma.prescription.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          items: true,
          patient: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          appointment: { select: { dateTime: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: prescriptions });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Prescriptions GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a new prescription (Doctors only, immutable once created)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Only doctors can create prescriptions" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = prescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const { appointmentId, patientId, diagnosis, notes, items } = parsed.data;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: payload.userId as string },
    });
    if (!doctorProfile) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    // Check if prescription already exists for this appointment (immutability)
    const existing = await prisma.prescription.findUnique({
      where: { appointmentId },
    });
    if (existing) {
      return NextResponse.json({ error: "A prescription already exists for this appointment and cannot be modified" }, { status: 409 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId,
        doctorId: doctorProfile.id,
        diagnosis,
        notes,
        items: {
          create: items.map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ message: "Prescription created successfully", data: prescription }, { status: 201 });
  } catch (error) {
    console.error("Prescriptions POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
