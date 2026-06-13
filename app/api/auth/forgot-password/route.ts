import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development"
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." }, { status: 200 });
    }

    // Generate a short-lived token for password reset (15 minutes)
    const resetToken = await new SignJWT({ userId: user.id, purpose: "PASSWORD_RESET" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(JWT_SECRET);

    // TODO: Integrate actual email service (Resend, SendGrid, etc.) here.
    // For now, we are simulating an email being sent by logging it and returning it in the response for dev testing.
    console.log(`[EMAIL SIMULATION] Send to: ${email}`);
    console.log(`[EMAIL SIMULATION] Reset Link: http://localhost:3000/reset-password?token=${resetToken}`);

    return NextResponse.json({
      message: "If an account with that email exists, we sent a password reset link.",
      // IMPORTANT: Remove this resetLink from response in production!
      _dev_resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
    }, { status: 200 });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
