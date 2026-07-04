import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createERPItem } from "@/lib/server/erpItemService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function serializeBoard(board: {
  id: string;
  name: string;
  width: number;
  height: number;
  materialId: string | null;
  createdAt: Date;
  updatedAt: Date;
  boardType?: string | null;
} ) {
  return {
    ...board, 
    materialId: board.materialId ?? undefined,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    boardType: board.boardType ?? undefined,
  };
}

export async function GET() {
  try {
    const boards = await prisma.boardDefinition.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(boards.map(serializeBoard), {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
  } catch (error) {
    console.error("GET /api/master-settings/boards failed:", error);

    return NextResponse.json(
      {
        message: "Failed to load boards.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    }, }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Board name is required." },
        { status: 400,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    }, }
      );
    }

   const erpResult = await createERPItem({
  description: body.name.trim(),

  groupCode: 13,

  controlTableCode: 35,
  defaultUnitId: 3,
});

const board = await prisma.boardDefinition.create({
  data: {
    name: body.name.trim(),

    width: Number(body.width),

    height: Number(body.height),

    materialId: body.materialId || null,

    boardType: body.boardType || undefined,

    erpItemRefId: erpResult.erpItemRefId,
  },
});
    return NextResponse.json(serializeBoard(board), {
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("POST /api/master-settings/boards failed:", error);

    return NextResponse.json(
      {
        message: "Failed to create board.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 ,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },}
    );
  }
}