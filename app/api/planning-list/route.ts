import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    return NextResponse.json(rows, {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load planning list",
      },
      {
        status: 500,
        headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
      }
    );
  }
}