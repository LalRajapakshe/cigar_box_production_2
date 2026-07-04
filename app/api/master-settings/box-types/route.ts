import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getBoxTypeSheetPayload,
  toClientBoxType,
} from "@/lib/server/boxTypeMapper";
import type { BoxTypeInput } from "@/lib/types/master-data";
import { createERPItem } from "@/lib/server/erpItemService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
const erpResult = await createERPItem({
  description: body.name.trim(),

  groupCode: 14,

  controlTableCode: 36,
  defaultUnitId: 3,
});

const sheetsWithERP = [];

for (const sheet of sheets) {
  const sheetERPResult = await createERPItem({
    description: `${body.name.trim()}-${sheet.sheetKey}- Wgt`,
    groupCode: 22,
    controlTableCode: 37,
    defaultUnitId: 1,
  });
    const sheetERPResultPcs = await createERPItem({
    description: `${body.name.trim()}-${sheet.sheetKey}- Pcs`,
    groupCode: 26,
    controlTableCode: 37,
    defaultUnitId: 3,
  });

  sheetsWithERP.push({
    sheetKey: sheet.sheetKey,
    width: sheet.width,
    height: sheet.height,
    quantity: sheet.quantity,
    productionTimeMinutes: sheet.productionTimeMinutes,
    polyBagWidthMm: sheet.polyBagWidthMm,
    polyBagHeightMm: sheet.polyBagHeightMm,
    polyethyleneWeightPer1000:
      sheet.polyethyleneWeightPer1000,
    surfaces: [...sheet.surfaces],
    erpItemRefId: sheetERPResult.erpItemRefId,
    erpItemRefIdPcs: sheetERPResultPcs.erpItemRefId,
  });
}

    const created = await prisma.boxType.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        boardDefinitionId: body.boardDefinitionId,
        erpItemRefId: erpResult.erpItemRefId,
        sheets: {
          create: sheetsWithERP.map((sheet) => ({
            sheetKey: sheet.sheetKey,
            width: sheet.width,
            height: sheet.height,
            quantity: sheet.quantity,
            productionTimeMinutes: sheet.productionTimeMinutes,
            polyBagWidthMm: sheet.polyBagWidthMm ?? 0,
            polyBagHeightMm: sheet.polyBagHeightMm ?? 0,
            polyethyleneWeightPer1000:
            sheet.polyethyleneWeightPer1000 ?? 0,
            erpItemRefId: sheet.erpItemRefId,
            erpItemRefIdPcs: sheet.erpItemRefIdPcs,
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