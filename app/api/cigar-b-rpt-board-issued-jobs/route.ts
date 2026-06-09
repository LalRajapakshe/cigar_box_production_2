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
    s.PO_SO_DOC_NO as salesOrderNo,

    o.orderDate as orderDate,

    o.orderNo as jobNo,

    im.IT_MST_DESCRIPTION as boardName,

    o.quantity as quantity

FROM STOCK_LEDGER_HEADER_W_A H

INNER JOIN STOCK_LEDGER_POSTING_W_A P
    ON H.STK_HDR_DOC_ID = P.STK_DET_HEADER_ID

INNER JOIN ITEM_MASTER IM
    ON IM.IT_MST_CODE = P.STK_PST_ITEM_ID

INNER JOIN STOCK_LEDGER_HEADER_W_A_INF I
    ON I.STK_HDR_DOC_LH_ID = H.STK_HDR_DOC_ID

INNER JOIN ProductionPlanning R
    ON I.STK_HDR_INF_LH_1 = R.id

INNER JOIN Orders O
    ON O.id = R.orderId

LEFT JOIN PO_SO_DOC_DETAIL_W_A D
    ON D.PO_SO_DET_ID = O.salesOrderDetailId

LEFT JOIN PO_SO_DOC_HEADER_W_A S
    ON S.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID

WHERE
    H.STK_HDR_DOC_TYPE = 'TRAN'
    AND H.STK_HDR_TXN_TYPE = 'D87'
    AND IM.IT_MST_GRP_CODE = 13

    AND CAST(H.STK_HDR_DOC_DATE AS DATETIME)
        >= CAST('${fromDate}' AS DATETIME)

    AND CAST(H.STK_HDR_DOC_DATE AS DATETIME)
        <= CAST('${toDate}' AS DATETIME)

ORDER BY
    H.STK_HDR_DOC_DATE DESC
      `);

const mapped = result.map((row: any) => ({
  salesOrderNo: row.salesOrderNo,
  orderDate: row.orderDate,
  jobNo: row.jobNo,
  boardName: row.boardName,
  quantity: Number(row.quantity ?? 0),
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