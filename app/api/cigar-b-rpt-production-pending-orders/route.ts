import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const result: any[] =
      await prisma.$queryRawUnsafe(`
	select s.PO_SO_DOC_NO as soNo, o.orderNo as jobNo, S.PO_SO_DESCRIPTION 'customerPo', 
	CONVERT(VARCHAR(11), O.orderDate, 106)  as Date, 
	 d.PO_SO_ITEM_NAME as itemCode
	, o.[lkrRatePerBox] * O.quantity as Amount , 
	O.quantity as remainingQty, ''as	aBoard,'' as	bBoard, '' as cBoard, 
	CONVERT(VARCHAR(11), O.orderDate, 106)  as 'Delivery Date', ''	costEntered
	from  orders O left outer join PO_SO_DOC_DETAIL_W_A  D on d.PO_SO_DET_ID = O.salesOrderDetailId
	left outer join PO_SO_DOC_HEADER_W_A S on s.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID
	where o.status = 'draft'
      `);

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load production pending orders report",
      },
      {
        status: 500,
      }
    );
  }
}