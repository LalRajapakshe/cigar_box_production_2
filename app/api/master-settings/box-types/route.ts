import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getBoxTypeSheetPayload,
  toClientBoxType,
} from "@/lib/server/boxTypeMapper";
import type { BoxTypeInput } from "@/lib/types/master-data";

async function fetchBoxTypeById(id: string) {
  return prisma.boxType.findUnique({
    where: { id },
    include: {
      sheets: {
        include: {
          surfaces: true,
        },
      },
    },
  });
}

export async function GET() {
  try {
    const boxTypes = await prisma.boxType.findMany({
      include: {
        sheets: {
          include: {
            surfaces: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(boxTypes.map(toClientBoxType));
  } catch (error) {
    console.error("GET /api/master-settings/box-types failed:", error);

    return NextResponse.json(
      {
        message: "Failed to load box types.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BoxTypeInput;
    const sheets = getBoxTypeSheetPayload(body);

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Box type name is required." },
        { status: 400 }
      );
    }

    if (!body.boardDefinitionId) {
      return NextResponse.json(
        { message: "Board definition is required." },
        { status: 400 }
      );
    }

    const created = await prisma.boxType.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        boardDefinitionId: body.boardDefinitionId,
        sheets: {
          create: sheets.map((sheet) => ({
            sheetKey: sheet.sheetKey,
            width: sheet.width,
            height: sheet.height,
            quantity: sheet.quantity,
            productionTimeMinutes: sheet.productionTimeMinutes,
            polyBagWidthMm: sheet.polyBagWidthMm ?? 0,
            polyBagHeightMm: sheet.polyBagHeightMm ?? 0,
            polyethyleneWeightPer1000:
            sheet.polyethyleneWeightPer1000 ?? 0,
            surfaces: {
              create: sheet.surfaces,
            },
          })),
        },
      },
    });

    const fullRecord = await fetchBoxTypeById(created.id);

    if (!fullRecord) {
      return NextResponse.json(
        { message: "Failed to load created box type." },
        { status: 500 }
      );
    }

    return NextResponse.json(toClientBoxType(fullRecord), { status: 201 });
  } catch (error) {
    console.error("POST /api/master-settings/box-types failed:", error);

    return NextResponse.json(
      {
        message: "Failed to create box type.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}