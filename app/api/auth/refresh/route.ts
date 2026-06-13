import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token is missing" }, { status: 401 });
    }

    const result = await AuthService.rotateTokens(refreshToken);

    if (!result) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    
    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh Token API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
