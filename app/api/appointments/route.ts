import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bookAppointmentSchema } from "@/lib/validators";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

export async function POST(request: Request) {
  try {
    // 1. Authenticate patient
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "PATIENT") {
      return NextResponse.json({ error: "Only patients can book appointments" }, { status: 403 });
    }

    const userId = payload.userId as string;

    // Get patient profile ID
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patientProfile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    // 2. Validate request body
    const body = await request.json();
    const parsed = bookAppointmentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { doctorId, clinicId, dateTime, reason, notes } = parsed.data;

    // 3. Verify slot is still available
    const requestedTime = new Date(dateTime);
    
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        dateTime: requestedTime,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    // 4. Create appointment and pending payment record in a transaction
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      select: { consultationFee: true }
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          patientId: patientProfile.id,
          doctorId,
          clinicId,
          dateTime: requestedTime,
          status: "PENDING",
          reason,
          notes,
        },
      });

      const payment = await tx.payment.create({
        data: {
          appointmentId: appointment.id,
          patientId: patientProfile.id,
          amount: doctor.consultationFee,
          status: "PENDING",
        },
      });

      return { appointment, payment };
    });

    return NextResponse.json(
      { message: "Appointment booked successfully", data: result },
      { status: 201 }
    );

  } catch (error) {
    console.error("Book Appointment Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
