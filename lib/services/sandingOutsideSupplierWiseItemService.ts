// lib/services/sandingOutsideJobWiseItemService.ts

import { prisma } from "@/lib/prisma";

export async function getSandingOutsideJobWiseItem(
  asAtDate: string
) {
  return await prisma.$queryRawUnsafe(`

SELECT

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

    ISNULL(L2.tp,0) as tp,
    ISNULL(L2.bottomSheet,0) as bottom,
    ISNULL(L2.longSheet,0) as long,
    ISNULL(L2.smallSheet,0) as small,
    ISNULL(L2.middleSheet,0) as middle,

    p.STK_PST_DOC_QTY as quantity,

    Em.empName as sandingSupplier

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

INNER JOIN STOCK_LEDGER_HEADER_W_A_INF I2
  ON I2.STK_HDR_DOC_LH_ID =
     P.STK_DET_HEADER_ID     
left outer join EmployeeMaster Em     
  ON Em.empId = I2.STK_HDR_INF_LH_1

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

LEFT OUTER JOIN
(
    SELECT

        planningId,

        SUM(
          CASE
            WHEN sheetKey='topSheet'
            THEN totalPiecesRequired
            ELSE 0
          END
        ) as tp,

        SUM(
          CASE
            WHEN sheetKey='bottomSheet'
            THEN totalPiecesRequired
            ELSE 0
          END
        ) as bottomSheet,

        SUM(
          CASE
            WHEN sheetKey='longSheet'
            THEN totalPiecesRequired
            ELSE 0
          END
        ) as longSheet,

        SUM(
          CASE
            WHEN sheetKey='smallSheet'
            THEN totalPiecesRequired
            ELSE 0
          END
        ) as smallSheet,

        SUM(
          CASE
            WHEN sheetKey='middleSheet'
            THEN totalPiecesRequired
            ELSE 0
          END
        ) as middleSheet

    FROM ProductionPlanningPart

    GROUP BY planningId

) L2
ON R.id = L2.planningId

WHERE

    H.STK_HDR_DOC_TYPE='TRAN'

    AND

    H.STK_HDR_TXN_TYPE='R46'

    AND

    P.STK_PST_HOQ > 0

    AND CAST(
      H.STK_HDR_DOC_DATE
      AS DATETIME
    )
    <= CAST(
      '${asAtDate}'
      AS DATETIME
    )

ORDER BY

    O.orderNo,

    H.STK_HDR_DOC_DATE

  `);
}