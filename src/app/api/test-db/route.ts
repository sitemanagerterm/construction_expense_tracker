import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      success: true, 
      dbUrlExists: !!dbUrl, 
      urlStart: dbUrl ? dbUrl.substring(0, 15) : "undefined",
      userCount 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      dbUrlExists: !!dbUrl, 
      urlStart: dbUrl ? dbUrl.substring(0, 15) : "undefined",
      error: error.message 
    }, { status: 500 });
  }
}
