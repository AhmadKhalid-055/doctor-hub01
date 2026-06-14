import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    return NextResponse.json({ success: true, info: result });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      meta: error.meta
    }, { status: 500 });
  }
}
