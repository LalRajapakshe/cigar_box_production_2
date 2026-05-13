import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          message: "orderId is required",
        },
        {
          status: 400,
        }
      );
    }

    const planning = await prisma.productionPlanning.findUnique({
      where: {
        orderId: Number(orderId),
      },
      include: {
        parts: true,
        order: true,
      },
    });

    return NextResponse.json(planning);
  } catch (error) {
    console.error("GET /api/planning failed", error);

    return NextResponse.json(
      {
        message: "Failed to load planning",
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

    const existing = await prisma.productionPlanning.findUnique({
      where: {
        orderId: Number(body.orderId),
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }
//console.log(body.parts[0]);
    const planning = await prisma.productionPlanning.create({
      data: {
        orderId: Number(body.orderId),

        plannedQuantity: body.plannedProductionQuantity,

        totalParts: body.summary.totalParts,
        totalPiecesRequired: body.summary.totalPiecesRequired,
        totalSlatsRequired: body.summary.totalSlatsRequired,
        totalBoardsRequired: body.summary.totalBoardsRequired,
        totalProductionTimeMinutes:
          body.summary.totalProductionTimeMinutes,

        status: "PLANNING",

        parts: {
          create: body.parts.map((part: any) => ({
            sheetKey: part.sheetKey,
            sheetLabel: part.sheetLabel,

            pieceWidth: part.pieceWidth,
            pieceHeight: part.pieceHeight,

            quantityPerBox: part.quantityPerBox,
            totalPiecesRequired: part.totalPiecesRequired,

            boardWidth: part.boardWidth,
            boardHeight: part.boardHeight,

            cuttingWidth: part.cuttingWidth,
            cuttingHeight: part.cuttingHeight,

            orientation: part.orientation,

            piecesPerSlat: part.piecesPerSlat,
            slatsPerBoard: part.slatsPerBoard,
            piecesPerBoard: part.piecesPerBoard,

            totalSlatsRequired: part.totalSlatsRequired,
            totalBoardsRequired: part.totalBoardsRequired,

            remainingBoardWidth: part.remainingBoardWidth,
            remainingBoardHeight: part.remainingBoardHeight,

            productionTimeMinutesPerPiece:
              part.productionTimeMinutesPerPiece,

            totalProductionTimeMinutes:
              part.totalProductionTimeMinutes,

            polyBagWidthMm: part.polyBagWidthMm,
            polyBagHeightMm: part.polyBagHeightMm,

            polyethyleneWeightPer1000:
              part.polyethyleneWeightPer1000,

            totalPolyethyleneRequirementKg:
              part.totalPolyethyleneRequirementKg,
          })),
        },
      },
      include: {
        parts: true,
        order: true,
      },
    });

    await prisma.order.update({
      where: {
        id: Number(body.orderId),
      },
      data: {
        status: "planned",
      },
    });

    await prisma.productionPlanningLog.create({
      data: {
        planningId: planning.id,
        orderId: Number(body.orderId),

        userId: 0,

        status: "PLANNING",
      },
    });

    return NextResponse.json(planning);
  } catch (error) {
    console.error("POST /api/planning failed", error);

    return NextResponse.json(
      {
        message: "Failed to save planning",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const updated = await prisma.productionPlanning.update({
      where: {
        id: Number(body.id),
      },
      data: {
        status: body.status,
      },
    });

    let orderStatus = "planned";

    if (body.status === "IN_PRODUCTION") {
      orderStatus = "inProduction";
    }

    if (body.status === "COMPLETE") {
      orderStatus = "completed";
    }

    await prisma.order.update({
      where: {
        id: Number(body.orderId),
      },
      data: {
        status: orderStatus,
      },
    });

  await prisma.productionPlanningLog.create({
  data: {
    planningId: updated.id,
    orderId: Number(body.orderId),

    userId: 0,

    status: body.status,
  },
});  

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/planning failed", error);

    return NextResponse.json(
      {
        message: "Failed to update planning status",
      },
      {
        status: 500,
      }
    );
  }
}