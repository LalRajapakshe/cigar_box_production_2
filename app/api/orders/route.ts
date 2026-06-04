import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        boxType: true,
        boardType: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

      export async function POST(req: Request) {
        try {
          const body = await req.json();

     const latestOrder = await prisma.order.findFirst({
        orderBy: {
          id: "desc",
        },
      });

     const nextOrderNumber = latestOrder
        ? latestOrder.id + 1
        : 1;

     const orderNo = `ORD-${String(nextOrderNumber).padStart(6, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNo,
        boxTypeId: body.boxTypeId,
        boardTypeId: body.boardTypeId,

        salesOrderDetailId:
         body.salesOrderDetailId
        ? Number(body.salesOrderDetailId)
        : null,

        quantity: Number(body.quantity),
   
        orderDate: new Date(body.orderDate),
        deliveryDate: new Date(body.deliveryDate),

        usdRatePerBox: Number(body.usdRatePerBox || 0),
        usdToLkrRate: Number(body.usdToLkrRate || 0),
        lkrRatePerBox: Number(body.lkrRatePerBox || 0),

        status: body.status || "PENDING",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}