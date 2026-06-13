import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!["ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Use raw SQL to group by month for last 12 months
    const appointmentsPerMonth = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "dateTime"), 'Mon YYYY') AS month,
        COUNT(*) AS count
      FROM appointments
      WHERE "dateTime" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "dateTime")
      ORDER BY DATE_TRUNC('month', "dateTime") ASC
    `;

    const revenuePerMonth = await prisma.$queryRaw<{ month: string; revenue: string }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
        COALESCE(SUM(amount), 0)::TEXT AS revenue
      FROM payments
      WHERE status = 'COMPLETED'
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `;

    // Serialize BigInt to number for JSON
    const formattedAppointments = appointmentsPerMonth.map((r) => ({
      month: r.month,
      count: Number(r.count),
    }));

    const formattedRevenue = revenuePerMonth.map((r) => ({
      month: r.month,
      revenue: parseFloat(r.revenue),
    }));

    return NextResponse.json({
      data: {
        appointmentsPerMonth: formattedAppointments,
        revenuePerMonth: formattedRevenue,
      },
    });
  } catch (error) {
    console.error("Analytics Monthly Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
