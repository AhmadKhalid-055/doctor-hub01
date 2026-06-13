import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

async function requireAdmin(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  if (!["ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
    throw new Error("Forbidden");
  }
  return payload;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await requireAdmin(token);

    // Run all aggregate queries in parallel
    const [
      totalPatients,
      totalDoctors,
      totalClinics,
      totalRevenue,
      appointmentsByStatus,
      paymentsByStatus,
    ] = await Promise.all([
      prisma.patientProfile.count(),
      prisma.doctorProfile.count(),
      prisma.clinic.count(),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.payment.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        totalPatients,
        totalDoctors,
        totalClinics,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        appointmentsByStatus,
        paymentsByStatus,
      },
    });
  } catch (error: any) {
    if (error.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("Analytics Overview Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
