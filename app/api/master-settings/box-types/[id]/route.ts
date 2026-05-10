import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBoxTypeSheetPayload, toClientBoxType } from "@/lib/server/boxTypeMapper";
import type { BoxTypeInput } from "@/lib/types/master-data";

type RouteContext = {
  params: { id: string };
};

async function fetchBoxTypeById(id: string) {
  return prisma.boxType.findUnique({
    where: { id },
    include: {
      sheets: {

    select: {
      id: true,
      createdAt: true,
      updatedAt: true,

      sheetKey: true,
      width: true,
      height: true,
      quantity: true,
      productionTimeMinutes: true,

      polyBagWidthMm: true,
      polyBagHeightMm: true,
      polyethyleneWeightPer1000: true,

      surfaces: true,
    },
      },
    },
  });
}

export async function GET(_: Request, { params }: RouteContext) {
  const boxType = await fetchBoxTypeById(params.id);

  if (!boxType) {
    return NextResponse.json(
      { message: "Box type not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(toClientBoxType(boxType));
}

export async function PUT(request: Request, { params }: RouteContext) {
  const body = (await request.json()) as BoxTypeInput;
  const sheets = getBoxTypeSheetPayload(body);

  await prisma.$transaction(async (tx) => {
    await tx.boxType.update({
      where: { id: params.id },
      data: {
        name: body.name?.trim(),
        description: body.description?.trim() || null,
        boardDefinitionId: body.boardDefinitionId,
      },
    });

    await tx.boxTypeSheet.deleteMany({
      where: { boxTypeId: params.id },
    });

    for (const sheet of sheets) {
      await tx.boxTypeSheet.create({
        data: {
          boxTypeId: params.id,
          sheetKey: sheet.sheetKey,
          width: sheet.width,
          height: sheet.height,
          quantity: sheet.quantity,
          productionTimeMinutes: sheet.productionTimeMinutes,
          polyBagWidthMm: sheet.polyBagWidthMm, 
          polyBagHeightMm: sheet.polyBagHeightMm,
          polyethyleneWeightPer1000: sheet.polyethyleneWeightPer1000,
          surfaces: {
            create: sheet.surfaces,
          },
        },
      });
    }
  });

  const updated = await fetchBoxTypeById(params.id);

  if (!updated) {
    return NextResponse.json(
      { message: "Box type not found after update." },
      { status: 404 }
    );
  }

  return NextResponse.json(toClientBoxType(updated));
}

export async function DELETE(_: Request, { params }: RouteContext) {
  await prisma.boxType.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}