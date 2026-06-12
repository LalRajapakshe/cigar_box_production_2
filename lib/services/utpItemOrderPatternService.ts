import { prisma } from "@/lib/prisma";

export async function getUtpItemOrderPatternReport(
  fromDate: string,
  toDate: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select

      case

          when d.PO_SO_DEF_UNT_QTY
               between 0 and 5000
          then '0-5000'

          when d.PO_SO_DEF_UNT_QTY
               between 5001 and 10000
          then '5001-10000'

          when d.PO_SO_DEF_UNT_QTY
               between 10001 and 15000
          then '10001-15000'

          when d.PO_SO_DEF_UNT_QTY
               between 15001 and 20000
          then '15001-20000'

          when d.PO_SO_DEF_UNT_QTY
               between 20001 and 25000
          then '20001-25000'

          when d.PO_SO_DEF_UNT_QTY
               between 25001 and 30000
          then '25001-30000'

          when d.PO_SO_DEF_UNT_QTY
               between 30001 and 35000
          then '30001-35000'

          else '35001-40000'

      end as bucket,

      count(*) as totalOrders

      from orders O

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

      case

          when d.PO_SO_DEF_UNT_QTY
               between 0 and 5000
          then '0-5000'

          when d.PO_SO_DEF_UNT_QTY
               between 5001 and 10000
          then '5001-10000'

          when d.PO_SO_DEF_UNT_QTY
               between 10001 and 15000
          then '10001-15000'

          when d.PO_SO_DEF_UNT_QTY
               between 15001 and 20000
          then '15001-20000'

          when d.PO_SO_DEF_UNT_QTY
               between 20001 and 25000
          then '20001-25000'

          when d.PO_SO_DEF_UNT_QTY
               between 25001 and 30000
          then '25001-30000'

          when d.PO_SO_DEF_UNT_QTY
               between 30001 and 35000
          then '30001-35000'

          else '35001-40000'

      end
    `);

  return rows;
}