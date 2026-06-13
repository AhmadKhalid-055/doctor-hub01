import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json({ message: "appointmentId is required" }, { status: 400 });
    }

    const session = await PaymentService.createCheckoutSession(appointmentId);
    return NextResponse.json(session);
  } catch (error) {
    console.error("Payment Checkout API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
