import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Order } from "@/lib/types/order";

//const prisma = new PrismaClient();


export async function GET() {
  try {
const orders: any[] =
  await prisma.$queryRawUnsafe(`
    select

      o.id,
      o.orderNo,

  o.boxTypeId,
  o.boardTypeId,

      h.PO_SO_DOC_NO as salesOrder,

      h.PO_SO_DESCRIPTION as cigar,

      b.description as product,

      b.name as boxType,

      cast(
      (
          select count(S.surfaceName)
          from SurfaceSpec S
          inner join BoxTypeSheet T
            on T.id = S.boxTypeSheetId
          where T.boxTypeId = B.id and s.requiresPrinting = 'True'
      )
      as varchar(10))
      + ' Colors'
      as printInfo,

      o.quantity,

      o.usdRatePerBox,

      (o.usdRatePerBox * o.usdToLkrRate)
        as lkrRate,

      (o.quantity * o.usdRatePerBox)
        as usdAmount,

      (
        o.quantity
        * o.usdRatePerBox
        * o.usdToLkrRate
      ) as lkrAmount,

      convert(varchar(10), o.orderDate, 105)
        as orderDate,

      convert(varchar(10), o.deliveryDate, 105)
        as deliveryDate,

      o.status

    from Orders o

    left join PO_SO_DOC_DETAIL_W_A d
      on d.PO_SO_DET_ID =
         o.salesOrderDetailId

    left join PO_SO_DOC_HEADER_W_A h
      on h.PO_SO_HDR_ID =
         d.PO_SO_DET_HEADER_ID

    left join BoxType b
      on b.id = o.boxTypeId

    order by o.id desc
  `)

return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

{/*}
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

*/}
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

