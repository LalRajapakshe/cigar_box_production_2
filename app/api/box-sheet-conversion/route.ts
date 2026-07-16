import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createBoxSheetTransferNote,
} from "@/lib/services/erpTransferNoteService";

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    const boxTypeId =
      url.searchParams.get(
        "boxTypeId"
      );

    if (boxTypeId) {
      const sheets =
        await prisma.$queryRawUnsafe(`
select
  I.IT_MST_CODE as itemId,
  I.IT_MST_DESCRIPTION as itemName,
  I.IT_MST_DEFAULT_MES_UNT as unitId,
  X.sheetType,
  X.quantityPerBox
from BoxTypeSheet S
inner join ITEM_MASTER I
  on I.IT_MST_CODE =
     S.erpItemRefIdPcs
inner join BoxSheetMapping X
  on X.boxTypeId =
     S.boxTypeId
 and X.sheetType =
     S.sheetKey
where S.boxTypeId =
      '${boxTypeId}'
`);

      return NextResponse.json(
        sheets
      );
    }

    const stocks =
      await prisma.$queryRawUnsafe(`
select
  P.STK_DET_ID as fromStockRefId,
  P.STK_PST_ITEM_ID as boxItemId,
  P.STK_PST_ITEM_NAME as boxItemName,
  P.Sec_Unit_Id as boxUnitId,
  P.STK_PST_HOQ as boxQuantity,
  P.STK_PST_IT_COST as boxUnitCost,
  B.id as boxMasterId
from STOCK_LEDGER_HEADER_W_A H
inner join STOCK_LEDGER_POSTING_W_A P
  on H.STK_HDR_DOC_ID =
     P.STK_DET_HEADER_ID
inner join STOCK_LEDGER_HEADER_W_A_INF I
  on I.STK_HDR_DOC_LH_ID =
     H.STK_HDR_DOC_ID
inner join ProductionPlanning R
  on R.id =
     I.STK_HDR_INF_LH_1
inner join Orders O
  on O.id =
     R.orderId
inner join BoxType B
  on B.id =
     O.boxTypeId
where H.STK_HDR_TXN_TYPE =
      'R65'
and H.STK_HDR_DOC_TYPE =
      'TRAN'
and H.STK_DOC_DIAMENTION_ID =
      210
and P.STK_PST_HOQ > 0
and H.STK_HDR_TO_LOC_ID =
      18
`);

    const locations =
      await prisma.$queryRawUnsafe(`
select
  L.LOC_LOC_CODE as value,
  L.LOC_LOC_NAME as text
from LOCATION L
where L.LOC_LOC_GRP_CODE = 23
`);

    return NextResponse.json({
      stocks,
      locations,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load data",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const conversionNo =
      `BSC-${Date.now()}`;

    const header =
      await prisma.boxSheetConversion.create({
        data: {
          conversionNo,

          fromStockRefId:
            Number(
              body.fromStockRefId
            ),

          toLocationId:
            Number(
              body.toLocationId
            ),

          conversionDate:
            new Date(
              body.conversionDate
            ),

          boxTypeId:
            body.boxTypeId,

          conversionQty:
            Number(
              body.conversionQty
            ),

          remarks:
            body.remarks,

          transferNoteId:
            null,
        },
      });

    const sheets =
      await prisma.$queryRawUnsafe<any[]>(`
select
  X.sheetType,
  X.quantityPerBox
from BoxSheetMapping X
where X.boxTypeId =
      '${body.boxTypeId}'
`);

    await prisma.boxSheetConversionDetail.createMany(
      {
        data:
          sheets.map(
            (s) => ({
              conversionId:
                header.id,

              sheetType:
                s.sheetType,

              quantityPerBox:
                Number(
                  s.quantityPerBox
                ),

              convertedQty:
                Number(
                  s.quantityPerBox
                ) *
                Number(
                  body.conversionQty
                ),
            })
          ),
      }
    );

    const transferId =
      await createBoxSheetTransferNote(
        header.id
      );

    await prisma.boxSheetConversion.update(
      {
        where: {
          id:
            header.id,
        },

        data: {
          transferNoteId:
            transferId,
        },
      });
      // TEMPORARY - Reduce original box stock
     const affected =
  await prisma.$executeRawUnsafe(
    `
    UPDATE STOCK_LEDGER_POSTING_W_A
    SET STK_PST_HOQ = STK_PST_HOQ - @P1
    WHERE STK_DET_ID = @P2
      AND STK_PST_HOQ >= @P1
    `,
    Number(body.conversionQty),
    Number(body.fromStockRefId)
    );
if (affected === 0) {
  throw new Error(
    "Failed to reduce box stock."
  );
}

    return NextResponse.json({
      id:
        header.id,

      conversionNo,

      transferNoteId:
        transferId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to save conversion",
      },
      {
        status: 500,
      }
    );
  }
}