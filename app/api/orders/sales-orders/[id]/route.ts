import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const rows: any[] =
      await prisma.$queryRawUnsafe(`
        select
            d.PO_SO_ITEM_ID,
            d.PO_SO_ITEM_CODE,
            d.PO_SO_ITEM_NAME,
            d.PO_SO_QTY,
            d.PO_SO_REM_QTY,
            d.PO_SO_PRICE
        from PO_SO_DOC_DETAIL_W_A d
        where d.PO_SO_DET_ID = ${params.id}
      `);

    if (!rows.length) {
      return NextResponse.json(
        { error: "Sales order not found" },
        { status: 404 }
      );
    }

    const salesOrder = rows[0];

    const boxType =
      await prisma.boxType.findFirst({
        where: {
          erpItemRefId:
            Number(salesOrder.PO_SO_ITEM_ID),
        },
      });

    if (!boxType) {
      return NextResponse.json(
        {
          error:
            "Box type not found for ERP item",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      salesOrderDetailId:
        Number(params.id),

      boxTypeId:
        boxType.id,

      boardTypeId:
        boxType.boardDefinitionId,

      quantity:
        Number(
          salesOrder.PO_SO_REM_QTY
        ),

      usdRatePerBox:
        Number(
          salesOrder.PO_SO_PRICE
        ),

      itemName:
        salesOrder.PO_SO_ITEM_NAME,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load sales order details",
      },
      {
        status: 500,
      }
    );
  }
}