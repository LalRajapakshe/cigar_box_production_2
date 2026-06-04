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

          b.name as itemName

        from [Orders] o

        inner join [ProductionPlanning] h
          on o.[id] = h.[orderId]

        inner join [BoxType] b
          on b.id = o.boxTypeId

        where
          cast(o.[orderDate] as datetime)
            >= cast('${fromDate}' as datetime)

          and cast(o.[orderDate] as datetime)
            <= cast('${toDate}' as datetime)

        order by
          o.[orderDate] desc
      `);

    const mapped = result.map((item) => ({
      orderNo: item.orderNo,

      orderDate: item.orderDate,

      itemName: item.itemName,

      planningNo: item.planningNo,

      issuedQty:
        Math.floor(Math.random() * 500) + 1,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load board issued jobs report",
      },
      {
        status: 500,
      }
    );
  }
}