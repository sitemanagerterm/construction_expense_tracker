import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.tenantRole.findMany({
      where: { name: 'Basic Control' }
    });

    const targetPermissions = JSON.stringify([
      "projects.view",
      "expenses.view",
      "expenses.add",
      "expenses.edit"
    ]);

    let count = 0;
    for (const role of roles) {
      await prisma.tenantRole.update({
        where: { id: role.id },
        data: { permissions: targetPermissions }
      });
      count++;
    }

    return NextResponse.json({ success: true, count, message: `Successfully updated ${count} Basic Control roles.` });
  } catch (error: any) {
    console.error("Failed to update roles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
