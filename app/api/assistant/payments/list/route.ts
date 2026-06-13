import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// GET all payments pending verification (list endpoint for assistant UI)
export async function GET() {
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
    console.error("Get Payments List Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
