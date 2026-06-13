import { NextRequest, NextResponse } from "next/server";
import { PrescriptionService } from "@/services/prescription.service";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const prescription = await PrescriptionService.getPrescriptionForExport(id);
    if (!prescription) {
      return NextResponse.json({ message: "Prescription not found" }, { status: 404 });
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("GET Prescription API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
