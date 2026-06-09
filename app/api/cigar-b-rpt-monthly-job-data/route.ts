import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const fromDate =
      searchParams.get("fromDate");

    const toDate =
      searchParams.get("toDate");

    if (!fromDate || !toDate) {
      return NextResponse.json(
        {
          message:
            "From Date and To Date are required",
        },
        {
          status: 400,
        }
      );
    }

    const result: any[] =
      await prisma.$queryRawUnsafe(`
	select CONVERT(VARCHAR(11), O.deliveryDate, 106)  as jobDate, s.PO_SO_DOC_NO as 'sales order no', 
	o.orderNo as jobNo, d.PO_SO_ITEM_NAME as 'item name',
	O.quantity as quantity, o.[lkrRatePerBox] * O.quantity as Amount , 
	0 as cost, o.[lkrRatePerBox] * O.quantity as profit
	from  orders O left outer join PO_SO_DOC_DETAIL_W_A  D on d.PO_SO_DET_ID = O.salesOrderDetailId
	left outer join PO_SO_DOC_HEADER_W_A S on s.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID
	AND CAST(CONVERT(VARCHAR(11), O.deliveryDate, 106) AS DATETIME)
        >= CAST('${fromDate}' AS DATETIME)
    AND CAST(CONVERT(VARCHAR(11), O.deliveryDate, 106) AS DATETIME)
        <= CAST('${toDate}' AS DATETIME)
      `);

    const mapped =
      result.map((row: any) => ({
        jobDate:
          row.jobDate,

        salesOrderNo:
          row.salesOrderNo,

        jobNo:
          row.jobNo,

        itemCode:
          row.itemCode,

        quantity:
          Number(row.quantity ?? 0),

        amount:
          Number(row.amount ?? 0),

        cost:
          Number(row.cost ?? 0),

        profit:
          Number(row.profit ?? 0),

        profitPercentage:
          Number(
            row.profitPercentage ?? 0
          ),
      }));

    return NextResponse.json(
      mapped
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load monthly job data report",
      },
      {
        status: 500,
      }
    );
  }
}