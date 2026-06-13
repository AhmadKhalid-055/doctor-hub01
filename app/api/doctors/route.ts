import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const city = searchParams.get("city");
    const rating = searchParams.get("rating");
    const minFee = searchParams.get("minFee");
    const maxFee = searchParams.get("maxFee");

    // Fetch filters execution setup
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        specialty: specialty || undefined,
        clinic: city ? { city: { contains: city, mode: "insensitive" } } : undefined,
        rating: rating ? { gte: parseFloat(rating) } : undefined,
        consultationFee: {
          gte: minFee ? parseFloat(minFee) : undefined,
          lte: maxFee ? parseFloat(maxFee) : undefined,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        clinic: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Fetch Doctors API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
