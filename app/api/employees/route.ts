import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employeeMaster.findMany({
      orderBy: {
        empCode: "asc",
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load employees",
      },
      {
        status: 500,
      }
    );
  }
}