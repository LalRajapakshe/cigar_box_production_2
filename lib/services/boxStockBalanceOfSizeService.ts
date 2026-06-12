import { prisma } from "@/lib/prisma";

export async function getBoxStockBalanceOfSizeReport() {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select

        p.STK_PST_ITEM_CODE as itemId,

        p.STK_PST_ITEM_NAME as type,

        R1.sheetKey as part,

        0 as printed,

        R1.totalPiecesRequired as unPrinted

      FROM STOCK_LEDGER_HEADER_W_A H

      INNER JOIN STOCK_LEDGER_POSTING_W_A P
        ON H.STK_HDR_DOC_ID =
           P.STK_DET_HEADER_ID

      INNER JOIN STOCK_LEDGER_HEADER_W_A_INF I
        ON I.STK_HDR_DOC_LH_ID =
           H.STK_HDR_DOC_ID

      INNER JOIN ProductionPlanning R
        ON I.STK_HDR_INF_LH_1 = R.id

      INNER JOIN ProductionPlanningPart R1
        ON R.id = R1.planningId

      WHERE
        H.STK_HDR_TO_LOC_ID = 18
        AND
        P.STK_PST_HOQ > 0

      ORDER BY
        P.STK_PST_ITEM_CODE,
        R1.sheetKey
    `);

  return rows;
}