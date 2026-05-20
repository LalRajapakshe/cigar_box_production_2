import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const planningId =
      request.nextUrl.searchParams.get("planningId");

    if (!planningId) {
      return NextResponse.json([]);
    }

    const rows =
      await prisma.productionEmployeeUtilization.findMany({
        where: {
          planningId: Number(planningId),
        },

        include: {
          employee: true,
        },

        orderBy: {
          id: "asc",
        },
      });

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load utilization",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await prisma.productionEmployeeUtilization.deleteMany({
      where: {
        planningId: Number(body.planningId),
      },
    });

    const created =
      await prisma.productionEmployeeUtilization.createMany({
        data: body.rows.map((row: any) => ({
          planningId: Number(body.planningId),

          employeeId: Number(row.employeeId),

          workingHours: Number(row.workingHours),
        })),
      });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to save utilization",
      },
      {
        status: 500,
      }
    );
  }
}