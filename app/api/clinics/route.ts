import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

// GET: Fetch clinics (all, or doctor's own clinics)
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { searchParams } = new URL(request.url);

    // Doctors see their own clinics
    if (payload.role === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: payload.userId as string },
        include: {
          clinics: {
            include: { _count: { select: { appointments: true } } },
          },
        },
      });
      return NextResponse.json({ data: doctorProfile?.clinics || [] });
    }

    // Admins and Super Admins see all clinics
    if (["ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      const clinics = await prisma.clinic.findMany({
        include: {
          _count: { select: { appointments: true, doctors: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: clinics });
    }

    // Patients can see all clinics (for booking)
    const clinics = await prisma.clinic.findMany({
      select: { id: true, name: true, address: true, city: true, phone: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: clinics });

  } catch (error) {
    console.error("Clinics GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a new clinic (Doctors, Admins, Super Admins)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!["DOCTOR", "ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, city, phone, email, logoUrl } = body;

    if (!name || !address || !city) {
      return NextResponse.json({ error: "name, address, and city are required" }, { status: 400 });
    }

    const clinic = await prisma.clinic.create({
      data: { name, address, city, phone, email, logoUrl },
    });

    // If a Doctor is creating a clinic, auto-link them to it
    if (payload.role === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: payload.userId as string },
      });
      if (doctorProfile) {
        await prisma.clinic.update({
          where: { id: clinic.id },
          data: {
            doctors: { connect: { id: doctorProfile.id } },
          },
        });
      }
    }

    return NextResponse.json({ message: "Clinic created successfully", data: clinic }, { status: 201 });
  } catch (error) {
    console.error("Clinics POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update clinic details
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!["DOCTOR", "ADMIN", "SUPER_ADMIN"].includes(payload.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, address, city, phone, email, logoUrl } = body;

    if (!id) return NextResponse.json({ error: "Clinic id is required" }, { status: 400 });

    const clinic = await prisma.clinic.update({
      where: { id },
      data: { name, address, city, phone, email, logoUrl },
    });

    return NextResponse.json({ message: "Clinic updated successfully", data: clinic });
  } catch (error) {
    console.error("Clinics PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
