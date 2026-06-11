import { prisma } from "@/lib/prisma";

export async function getSalesOrderSummaryReport(
  fromDate: string,
  toDate: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select
        s.PO_SO_CONTACT_NAME as customerName,
        CONVERT(VARCHAR(11), s.PO_SO_DATE, 106) as [date],
        s.PO_SO_DOC_NO as salesOrderNo,
        s.PO_SO_DESCRIPTION as customerPo,
        sum(
          d.PO_SO_QTY * d.PO_SO_PRICE
        ) as amount
      from ProductionPlanning R
      inner join Orders O
        on O.id = R.orderId
      left outer join PO_SO_DOC_DETAIL_W_A D
        on d.PO_SO_DET_ID =
           O.salesOrderDetailId
      left outer join PO_SO_DOC_HEADER_W_A S
        on s.PO_SO_HDR_ID =
           D.PO_SO_DET_HEADER_ID
      where
        cast(s.PO_SO_DATE as datetime)
        >= cast('${fromDate}' as datetime)
        and
        cast(s.PO_SO_DATE as datetime)
        <= cast('${toDate}' as datetime)
      group by
        s.PO_SO_CONTACT_NAME,
        s.PO_SO_DATE,
        s.PO_SO_DOC_NO,
        s.PO_SO_DESCRIPTION
      order by
        s.PO_SO_DATE
    `);

  return rows;
}