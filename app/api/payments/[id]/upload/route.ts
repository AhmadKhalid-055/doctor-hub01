import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paymentId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "PATIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { screenshotUrl } = body;

    if (!screenshotUrl) {
      return NextResponse.json({ error: "screenshotUrl is required" }, { status: 400 });
    }

    // Update payment and appointment status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          screenshotUrl,
          status: "SUBMITTED",
        },
        include: { appointment: true },
      });

      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: "PAYMENT_SUBMITTED" },
      });

      return payment;
    });

    return NextResponse.json({ message: "Payment screenshot uploaded successfully", data: result });
  } catch (error) {
    console.error("Payment Upload Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
