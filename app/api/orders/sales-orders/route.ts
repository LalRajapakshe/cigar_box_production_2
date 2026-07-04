import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows: any[] =
      await prisma.$queryRawUnsafe(`
        select
            d.PO_SO_DET_ID as value,
            h.PO_SO_DOC_NO + ' - ' + d.PO_SO_ITEM_NAME as text
        from PO_SO_DOC_HEADER_W_A h
        inner join PO_SO_DOC_DETAIL_W_A d
            on h.PO_SO_HDR_ID = d.PO_SO_DET_HEADER_ID
        where d.PO_SO_REM_QTY > 0 and d.PO_SO_DET_ID not in 
		(select salesOrderDetailId from [Orders] )
        order by h.PO_SO_DOC_NO desc `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load sales orders" },
      { status: 500 }
    );
  }
}