import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: { id: string };
};

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

export async function GET(_: Request, { params }: RouteContext) {
  const material = await prisma.materialDefinition.findUnique({
    where: { id: params.id },
  });

  if (!material) {
      return NextResponse.json({
        message: "Material not found.",
        status: 404,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
  }

  return NextResponse.json(serializeMaterial(material), {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
}

export async function PUT(request: Request, { params }: RouteContext) {
  const body = await request.json();

  const material = await prisma.materialDefinition.update({
    where: { id: params.id },
    data: {
      name: body.name?.trim(),
      description: body.description?.trim() || null,
      cost:
        body.cost === undefined || body.cost === null || body.cost === ""
          ? null
          : Number(body.cost),
    },
  });

  return NextResponse.json(serializeMaterial(material), {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
}

export async function DELETE(_: Request, { params }: RouteContext) {
  await prisma.materialDefinition.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true }, {
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  },
});
}