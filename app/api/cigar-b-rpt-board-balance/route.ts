import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {

    const result: any[] =
      await prisma.$queryRawUnsafe(`
        WITH ForecastData AS
(
    SELECT
        b.erpItemRefId,
        SUM(o.quantity) AS forecastQty
    FROM BoardDefinition b
    INNER JOIN BoxType x
        ON b.id = x.boardDefinitionId
    INNER JOIN Orders o
        ON x.id = o.boxTypeId
    WHERE o.id NOT IN
    (
        SELECT orderId
        FROM ProductionPlanning
    )
    GROUP BY b.erpItemRefId
)

SELECT
    IM.IT_MST_CODE            AS itemCode,
    IM.IT_MST_ALIAS           AS itemAlias,
    IM.IT_MST_DESCRIPTION     AS itemDescription,

    SUM(SLP.STK_PST_HOQ)      AS actualBalance,

    ISNULL(F.forecastQty,0)   AS forecastQty,

    SUM(SLP.STK_PST_HOQ)
      - ISNULL(F.forecastQty,0)
      AS forecastBalance

FROM STOCK_LEDGER_HEADER_W_A SLH

INNER JOIN STOCK_LEDGER_POSTING_W_A SLP
    ON SLH.STK_HDR_DOC_ID = SLP.STK_DET_HEADER_ID

INNER JOIN ITEM_MASTER IM
    ON IM.IT_MST_CODE = SLP.STK_PST_ITEM_ID

INNER JOIN ITEM_GROUP IG
    ON IG.IT_GRP_CODE = IM.IT_MST_GRP_CODE

LEFT JOIN ForecastData F
    ON F.erpItemRefId = IM.IT_MST_CODE

WHERE
    SLH.STK_HDR_TO_LOC_ID IN
    (
        20,89,90,91,92,93,94,
        95,96,145,16,17,146
    )
    AND SLP.STK_PST_HOQ > 0
    AND IG.IT_GRP_CODE = 13

GROUP BY
    IM.IT_MST_CODE,
    IM.IT_MST_ALIAS,
    IM.IT_MST_DESCRIPTION,
    F.forecastQty

ORDER BY
    IM.IT_MST_ALIAS
      `);

const mapped = result.map((row: any) => ({
  itemCode: row.itemCode,
  itemAlias: row.itemAlias,
  itemDescription: row.itemDescription,
  actualBalance: Number(row.actualBalance ?? 0),
  forecastQty: Number(row.forecastQty ?? 0),
  forecastBalance: Number(row.forecastBalance ?? 0),
}));

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