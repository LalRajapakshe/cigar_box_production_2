import { prisma } from "@/lib/prisma";

export async function getUtpPcOrdersYearlyComparisonReport(
  year: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select

        MONTH(
          cast(s.PO_SO_DATE as datetime)
        ) as monthNo,

        LEFT(
          DATENAME(
            MONTH,
            cast(s.PO_SO_DATE as datetime)
          ),
          3
        ) as monthName,

        SUM(
          d.PO_SO_DEF_UNT_QTY
        ) as totalQty,

        SUM(
          o.lkrRatePerBox * o.quantity
        ) as amount

      from orders O

      left outer join
      PO_SO_DOC_DETAIL_W_A D
        on d.PO_SO_DET_ID =
           O.salesOrderDetailId

      left outer join
      PO_SO_DOC_HEADER_W_A S
        on s.PO_SO_HDR_ID =
           D.PO_SO_DET_HEADER_ID

      where

      YEAR(
        cast(
          s.PO_SO_DATE
          as datetime
        )
      ) = ${year}

      group by

      MONTH(
        cast(
          s.PO_SO_DATE
          as datetime
        )
      ),

      DATENAME(
        MONTH,
        cast(
          s.PO_SO_DATE
          as datetime
        )
      )

      order by
      monthNo
    `);

  return rows;
}