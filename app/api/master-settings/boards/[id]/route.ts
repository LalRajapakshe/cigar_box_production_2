import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
}) {
  return {
    ...board,
    materialId: board.materialId ?? undefined,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
  };
}

export async function GET() {
  const boards = await prisma.boardDefinition.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(boards.map(serializeBoard), {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json(
      { message: "Board name is required." },
      { status: 400 ,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },}
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

  return NextResponse.json(serializeBoard(board), {
    status: 201,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}