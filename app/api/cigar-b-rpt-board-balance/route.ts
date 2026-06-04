import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const fromDate =
      searchParams.get("fromDate");

    const toDate =
      searchParams.get("toDate");

    const result: any[] =
      await prisma.$queryRawUnsafe(`
        select
          p.STK_PST_ITEM_CODE as itemCode,
          p.STK_PST_ITEM_NAME as itemName,
          sum(p.STK_PST_DOC_QTY) as forecastQty

        from STOCK_LEDGER_HEADER_W_A h

        inner join STOCK_LEDGER_POSTING_W_A p
          on h.STK_HDR_DOC_ID = p.STK_DET_HEADER_ID

        inner join ITEM_MASTER i
          on i.IT_MST_CODE = p.STK_PST_ITEM_ID

        where
          i.IT_MST_GRP_CODE = 14
          and h.STK_HDR_TO_LOC_ID = 89

          and cast(h.STK_HDR_DOC_DATE as datetime)
            >= cast('${fromDate}' as datetime)

          and cast(h.STK_HDR_DOC_DATE as datetime)
            <= cast('${toDate}' as datetime)

        group by
          p.STK_PST_ITEM_CODE,
          p.STK_PST_ITEM_NAME

        order by
          p.STK_PST_ITEM_NAME
      `);

    const mapped = result.map((item) => {
      const actualBalance = 1000;

      return {
        itemCode: item.itemCode,
        itemName: item.itemName,

        forecastQty:
          Number(item.forecastQty ?? 0),

        actualBalance,

        forecastBalance:
          actualBalance -
          Number(item.forecastQty ?? 0),
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load board balance report",
      },
      {
        status: 500,
      }
    );
  }
}