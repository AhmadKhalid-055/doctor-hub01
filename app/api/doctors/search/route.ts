import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { doctorSearchSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params into an object
    const params = {
      query: searchParams.get("query") || undefined,
      treatmentType: searchParams.get("treatmentType") || undefined,
      specialty: searchParams.get("specialty") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10,
    };

    // Validate params
    const parsed = doctorSearchSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, treatmentType, specialty, sortBy, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Build Prisma `where` clause
    const where: any = {};

    if (treatmentType) {
      where.treatmentType = treatmentType;
    }

    if (specialty) {
      where.specialty = {
        contains: specialty,
        mode: "insensitive",
      };
    }

    if (query) {
      where.OR = [
        {
          user: {
            OR: [
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
            ],
          },
        },
        {
          diseasesTreated: {
            hasSome: [query], // PostgreSQL array search. Note: Prisma `hasSome` requires exact match or we can just let frontend handle exact keyword tags.
          },
        },
      ];
    }

    // Build Prisma `orderBy` clause
    let orderBy: any = { rating: "desc" }; // default
    if (sortBy === "rating_desc") orderBy = { rating: "desc" };
    if (sortBy === "fee_asc") orderBy = { consultationFee: "asc" };
    if (sortBy === "fee_desc") orderBy = { consultationFee: "desc" };
    if (sortBy === "experience_desc") orderBy = { experienceYears: "desc" };

    // Fetch total count for pagination
    const totalCount = await prisma.doctorProfile.count({ where });

    // Fetch doctors
    const doctors = await prisma.doctorProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        clinics: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: doctors,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Doctor Search API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
