import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/validators";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role } = parsed.data;
    const assignedRole = (role as Role) || Role.PATIENT;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Run transaction to create User and Profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: assignedRole,
        },
      });

      // Based on role, create appropriate profile
      if (assignedRole === Role.PATIENT) {
        await tx.patientProfile.create({
          data: { userId: user.id },
        });
      } else if (assignedRole === Role.DOCTOR) {
        // Need to provide dummy data for required fields for doctor profile
        // In real app, this might be handled via a multi-step form or admin assignment
      } else if (assignedRole === Role.ASSISTANT) {
        // ...
      }

      return user;
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
