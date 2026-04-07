import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeMaterial(material: {
  id: string;
  name: string;
  description: string | null;
  cost: number | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...material,
    description: material.description ?? undefined,
    cost: material.cost ?? undefined,
    createdAt: material.createdAt.toISOString(),
    updatedAt: material.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const materials = await prisma.materialDefinition.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(materials.map(serializeMaterial));
  } catch (error) {
    console.error("GET /api/master-settings/materials failed:", error);

    return NextResponse.json(
      {
        message: "Failed to load materials.",
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
        { message: "Material name is required." },
        { status: 400 }
      );
    }

    const material = await prisma.materialDefinition.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        cost:
          body.cost === undefined || body.cost === null || body.cost === ""
            ? null
            : Number(body.cost),
      },
    });

    return NextResponse.json(serializeMaterial(material), { status: 201 });
  } catch (error) {
    console.error("POST /api/master-settings/materials failed:", error);

    return NextResponse.json(
      {
        message: "Failed to create material.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}