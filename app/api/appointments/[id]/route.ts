import { NextRequest, NextResponse } from "next/server";
import { AppointmentService } from "@/services/appointment.service";
import { verifyAccessToken } from "@/lib/jwt";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { status, notes } = body;

    const appointment = await AppointmentService.updateStatus(id, status, notes);

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("PATCH Appointment API Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
