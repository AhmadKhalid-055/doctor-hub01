import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// GET: Doctor's own availability schedule
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "DOCTOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: payload.userId as string },
    });
    if (!doctorProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const availability = await prisma.availability.findMany({
      where: { doctorId: doctorProfile.id },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ data: availability });
  } catch (error) {
    console.error("Availability GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Set/overwrite availability for a given day (Doctors only)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "DOCTOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: payload.userId as string },
    });
    if (!doctorProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await request.json();
    const { dayOfWeek, startTime, endTime, slotDuration } = body;

    if (dayOfWeek === undefined || !startTime || !endTime || !slotDuration) {
      return NextResponse.json({ error: "dayOfWeek, startTime, endTime, slotDuration are required" }, { status: 400 });
    }

    // Upsert: if availability for this day already exists, update it
    const availability = await prisma.availability.upsert({
      where: {
        id: (await prisma.availability.findFirst({
          where: { doctorId: doctorProfile.id, dayOfWeek },
        }))?.id ?? "none",
      },
      update: { startTime, endTime, slotDuration },
      create: {
        doctorId: doctorProfile.id,
        dayOfWeek,
        startTime,
        endTime,
        slotDuration,
      },
    });

    return NextResponse.json({ message: "Availability saved", data: availability }, { status: 201 });
  } catch (error) {
    console.error("Availability POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove availability for a specific day
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "DOCTOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Availability id is required" }, { status: 400 });

    await prisma.availability.delete({ where: { id } });

    return NextResponse.json({ message: "Availability removed" });
  } catch (error) {
    console.error("Availability DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
