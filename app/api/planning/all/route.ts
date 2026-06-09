import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const planning =
      await prisma.productionPlanning.findMany({
        include: {
          order: true,
          parts: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(planning);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load planning records",
      },
      {
        status: 500,
      }
    );
  }
}