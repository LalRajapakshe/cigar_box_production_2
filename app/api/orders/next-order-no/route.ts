import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const latestOrder =
    await prisma.order.findFirst({
      orderBy: {
        id: "desc",
      },
    });

  const nextOrderNumber =
    latestOrder
      ? latestOrder.id + 1
      : 1;

  return NextResponse.json({
    orderNo:
      `ORD-${String(nextOrderNumber)
        .padStart(6, "0")}`,
  });
}