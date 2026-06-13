import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let data;
    switch (payload.role) {
      case "SUPER_ADMIN":
        data = await AnalyticsService.getPlatformSummary();
        break;
      case "ADMIN":
        // Retrieve clinic ID (mock database lookup placeholder)
        data = await AnalyticsService.getClinicSummary("mock-clinic-id");
        break;
      case "DOCTOR":
        data = await AnalyticsService.getDoctorSummary(payload.userId);
        break;
      default:
        return NextResponse.json({ message: "Forbidden: No analytics available" }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
