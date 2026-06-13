import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Find doctor's availability for this day of the week
    const availability = await prisma.availability.findFirst({
      where: {
        doctorId,
        dayOfWeek,
      },
    });

    if (!availability) {
      return NextResponse.json({ slots: [] }, { status: 200 });
    }

    // Generate all possible slots based on start/end time and duration
    const slots: string[] = [];
    const [startHour, startMinute] = availability.startTime.split(":").map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);
    
    let currentSlot = new Date(date);
    currentSlot.setHours(startHour, startMinute, 0, 0);

    const endSlot = new Date(date);
    endSlot.setHours(endHour, endMinute, 0, 0);

    while (currentSlot < endSlot) {
      slots.push(currentSlot.toISOString());
      currentSlot = new Date(currentSlot.getTime() + availability.slotDuration * 60000);
    }

    // Find already booked appointments for this doctor on this specific day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
      },
      select: {
        dateTime: true,
      },
    });

    const bookedTimes = bookedAppointments.map(a => a.dateTime.toISOString());

    // Filter out booked slots
    const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

    return NextResponse.json({ slots: availableSlots }, { status: 200 });
  } catch (error) {
    console.error("Availability API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
