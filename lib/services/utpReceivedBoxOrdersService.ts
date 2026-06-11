import { prisma } from "@/lib/prisma";

export async function getUtpReceivedBoxOrdersReport(
  fromDate: string,
  toDate: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select
        d.PO_SO_ITEM_NAME as itemCode,
        sum(O.quantity) as totalQty
      from orders O
      left outer join PO_SO_DOC_DETAIL_W_A D
        on d.PO_SO_DET_ID = O.salesOrderDetailId
      left outer join PO_SO_DOC_HEADER_W_A S
        on s.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID
      where
        o.status = 'draft'
        and cast(s.PO_SO_DATE as datetime)
            >= cast('${fromDate}' as datetime)
        and cast(s.PO_SO_DATE as datetime)
            <= cast('${toDate}' as datetime)
      group by
        d.PO_SO_ITEM_NAME
      order by
        d.PO_SO_ITEM_NAME
    `);

  return rows;
}