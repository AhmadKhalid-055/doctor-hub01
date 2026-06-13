import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { paymentVerificationSchema } from "@/lib/validators";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// VERIFY payment
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paymentId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!["ASSISTANT", "ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = paymentVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const { status, rejectionReason } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason : null,
          verifiedBy: payload.userId as string,
          verifiedAt: new Date(),
        },
        include: { appointment: true },
      });

      const newAppointmentStatus = status === "COMPLETED" ? "CONFIRMED" : "PENDING";

      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: newAppointmentStatus },
      });

      return payment;
    });

    return NextResponse.json({
      message: status === "COMPLETED" ? "Payment approved. Appointment confirmed!" : "Payment rejected.",
      data: result,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET all payments pending verification (for assistant)
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!["ASSISTANT", "ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: { status: "SUBMITTED" },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
            clinic: { select: { name: true } },
          },
        },
        patient: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: payments });
  } catch (error) {
    console.error("Get Payments Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
