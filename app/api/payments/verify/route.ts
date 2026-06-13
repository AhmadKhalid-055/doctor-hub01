import { NextRequest, NextResponse } from "next/server";
import { PaymentVerificationSchema } from "@/lib/validators";
import { PaymentService } from "@/services/payment.service";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload || (payload.role !== "ASSISTANT" && payload.role !== "ADMIN")) {
      return NextResponse.json({ message: "Forbidden: Only staff can verify payments" }, { status: 403 });
    }

    const body = await request.json();
    const result = PaymentVerificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.format() },
        { status: 400 }
      );
    }

    const payment = await PaymentService.verifyPayment(
      result.data.appointmentId,
      result.data.transactionId,
      result.data.receiptUrl
    );

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Payment Verification API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
