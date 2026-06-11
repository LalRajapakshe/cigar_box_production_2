import { prisma } from "@/lib/prisma";

export async function getSandingOutsidePendingJobStatusReport(
  fromDate: string,
  toDate: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select

        o.orderNo as jobNo,

        h.STK_HDR_DOC_NO as issueNo,

        CONVERT(
          VARCHAR(11),
          H.STK_HDR_DOC_DATE,
          106
        ) as issueDate,

        s.PO_SO_DOC_NO as salesOrderNo,

        p.STK_PST_ITEM_NAME as itemName,

        '' as bagNo,

        CASE
          WHEN p.STK_PST_ITEM_NAME
               LIKE '%topSheet%'
          THEN p.STK_PST_DOC_QTY
          ELSE 0
        END as [tp],

        CASE
          WHEN p.STK_PST_ITEM_NAME
               LIKE '%bottomSheet%'
          THEN p.STK_PST_DOC_QTY
          ELSE 0
        END as [bottom],

        CASE
          WHEN p.STK_PST_ITEM_NAME
               LIKE '%longSheet%'
          THEN p.STK_PST_DOC_QTY
          ELSE 0
        END as [long],

        CASE
          WHEN p.STK_PST_ITEM_NAME
               LIKE '%smallSheet%'
          THEN p.STK_PST_DOC_QTY
          ELSE 0
        END as [small],

        CASE
          WHEN p.STK_PST_ITEM_NAME
               LIKE '%middleSheet%'
          THEN p.STK_PST_DOC_QTY
          ELSE 0
        END as [middle]

      FROM STOCK_LEDGER_HEADER_W_A H

      INNER JOIN STOCK_LEDGER_POSTING_W_A P
        ON H.STK_HDR_DOC_ID =
           P.STK_DET_HEADER_ID

      INNER JOIN STOCK_LEDGER_POSTING_W_A PP
        ON P.STK_PST_FROM_REF_DET_ID =
           PP.STK_DET_ID

      INNER JOIN STOCK_LEDGER_HEADER_W_A_INF I
        ON I.STK_HDR_DOC_LH_ID =
           PP.STK_DET_HEADER_ID

      INNER JOIN ProductionPlanning R
        ON I.STK_HDR_INF_LH_1 = R.id

      INNER JOIN Orders O
        ON O.id = R.orderId

      LEFT OUTER JOIN PO_SO_DOC_DETAIL_W_A D
        ON D.PO_SO_DET_ID =
           O.salesOrderDetailId

      LEFT OUTER JOIN PO_SO_DOC_HEADER_W_A S
        ON S.PO_SO_HDR_ID =
           D.PO_SO_DET_HEADER_ID

      WHERE
        H.STK_HDR_DOC_TYPE = 'TRAN'
        AND
        H.STK_HDR_TXN_TYPE = 'R46'

        AND CAST(
          H.STK_HDR_DOC_DATE
          AS DATETIME
        ) >= CAST(
          '${fromDate}'
          AS DATETIME
        )

        AND CAST(
          H.STK_HDR_DOC_DATE
          AS DATETIME
        ) <= CAST(
          '${toDate}'
          AS DATETIME
        )

      ORDER BY
        H.STK_HDR_DOC_DATE,
        O.orderNo
    `);

  return rows;
}