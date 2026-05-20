import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows =
      await prisma.productionPlanning.findMany({
        where: {
          status: "IN_PRODUCTION",
        },

        include: {
          order: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load planning list",
      },
      {
        status: 500,
      }
    );
  }
}