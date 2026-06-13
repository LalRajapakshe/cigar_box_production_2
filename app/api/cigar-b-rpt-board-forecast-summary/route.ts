import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const fromDate =
      searchParams.get("fromDate");

    const toDate =
      searchParams.get("toDate");

    const result: any[] =
      await prisma.$queryRawUnsafe(`
        select
          h.[planningNo] as planningNo,

          o.[orderNo] as orderNo,

          o.[orderDate] as orderDate,

          o.[quantity] as remainQty,

          bd.name as itemName,

          bd.boardType as boardType,

          h.[totalBoardsRequired]
            as requiredBoardQty

        from [ProductionPlanning] h

        inner join [Orders] o
          on o.id = h.orderId

        inner join [BoxType] b
          on b.id = o.boxTypeId

        inner join [BoardDefinition] bd
          on bd.id = b.boardDefinitionId

        where
          h.status = 'PLANNING'

          and cast(o.[orderDate] as datetime)
            >= cast('${fromDate}' as datetime)

          and cast(o.[orderDate] as datetime)
            <= cast('${toDate}' as datetime)

        order by
          o.[orderDate]
      `);

    const mapped = result.map((item) => ({
      planningNo: item.planningNo,

      orderNo: item.orderNo,

      orderDate: item.orderDate,

      itemName: item.itemName,

      remainQty:
        Number(item.remainQty ?? 0),

      boardType:
        item.boardType,

      requiredBoardQty:
        Number(
          item.requiredBoardQty ?? 0
        ),

      slatTop: "",

      slatBottom: "",

      slatLong: "",

      slatSmall: "",
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load board forecast summary report",
      },
      {
        status: 500,
      }
    );
  }
}