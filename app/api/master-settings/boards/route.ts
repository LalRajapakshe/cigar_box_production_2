import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBoard(board: {
  id: string;
  name: string;
  width: number;
  height: number;
  materialId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...board,
    materialId: board.materialId ?? undefined,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const boards = await prisma.boardDefinition.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(boards.map(serializeBoard));
  } catch (error) {
    console.error("GET /api/master-settings/boards failed:", error);

    return NextResponse.json(
      {
        message: "Failed to load boards.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Board name is required." },
        { status: 400 }
      );
    }

    const board = await prisma.boardDefinition.create({
      data: {
        name: body.name.trim(),
        width: Number(body.width),
        height: Number(body.height),
        materialId: body.materialId || null,
      },
    });

    return NextResponse.json(serializeBoard(board), { status: 201 });
  } catch (error) {
    console.error("POST /api/master-settings/boards failed:", error);

    return NextResponse.json(
      {
        message: "Failed to create board.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}