// lib/services/utpPerimeterRangeSummaryService.ts

import { prisma } from "@/lib/prisma";

export async function getUTPPerimeterRangeSummary(
  fromDate: string,
  toDate: string
) {

  const ranges: any[] =
    await prisma.$queryRawUnsafe(`
      select
        p.Size,
        p.fromlenght,
        p.toLength,
        p.Amount
      from perimeterCalculation p
      order by p.fromlenght
    `);

  const sheets: any[] =
    await prisma.$queryRawUnsafe(`
      select
        R1.sheetKey,
        ((R1.pieceHeight + R1.pieceWidth) * 2 *
         R1.quantityPerBox) as perimeterPerBox,
        sum(R1.quantityPerBox) as totalPieces

      FROM STOCK_LEDGER_HEADER_W_A H

      INNER JOIN STOCK_LEDGER_POSTING_W_A P
        ON H.STK_HDR_DOC_ID = P.STK_DET_HEADER_ID

      INNER JOIN STOCK_LEDGER_HEADER_W_A_INF I
        ON I.STK_HDR_DOC_LH_ID = H.STK_HDR_DOC_ID

      INNER JOIN ProductionPlanning R
        ON I.STK_HDR_INF_LH_1 = R.id

      INNER JOIN ProductionPlanningPart R1
        ON R.id = R1.planningId

      INNER JOIN Orders O
        ON O.id = R.orderId

      WHERE
        H.STK_HDR_DOC_TYPE = 'TRAN'
        AND H.STK_HDR_TXN_TYPE = 'R65'

        AND CAST(H.STK_HDR_DOC_DATE AS DATETIME)
            >= CAST('${fromDate}' AS DATETIME)

        AND CAST(H.STK_HDR_DOC_DATE AS DATETIME)
            <= CAST('${toDate}' AS DATETIME)

      GROUP BY
        R1.sheetKey,
        R1.pieceHeight,
        R1.pieceWidth,
        R1.quantityPerBox
    `);

  const result = ranges.map((range) => ({
     size: range.Size,
    rate: Number(range.Amount),
    perimeterRange:
      range.toLength >= 999999
        ? `>${range.fromlenght}`
        : `${range.fromlenght}-${range.toLength}`,
    pieces: 0,
    amount: 0,
  }));

  sheets.forEach((sheet) => {

    const perimeter =
      Number(sheet.perimeterPerBox);

    const pieces =
      Number(sheet.totalPieces);

    const bucket =
      ranges.find(
        (r) =>
          perimeter >= Number(r.fromlenght) &&
          perimeter <= Number(r.toLength)
      );

    if (!bucket) return;

    const target =
      result.find(
        (r) => r.rate === Number(bucket.Amount)
      );

    if (!target) return;

    target.pieces += pieces;

    target.amount +=
      pieces * Number(bucket.Amount);
  });

  return result;
}