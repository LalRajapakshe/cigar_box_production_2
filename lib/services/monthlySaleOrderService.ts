import { prisma } from "@/lib/prisma";

export async function getMonthlySaleOrderReport(
  fromDate: string,
  toDate: string
) {

  console.log("FROM =", fromDate);
  console.log("TO =", toDate);

  try {

    const rows: any[] =
      await prisma.$queryRawUnsafe(`
        select
          s.PO_SO_DOC_NO as soNo,
          o.orderNo as jobNo,
          S.PO_SO_DESCRIPTION as customerPo,
          CONVERT(VARCHAR(11), cast(o.orderDate as datetime), 106) as [date],
          d.PO_SO_ITEM_NAME as itemCode,
          O.quantity as remainingQty,
          o.lkrRatePerBox * O.quantity as amountLkr,
          o.usdRatePerBox * O.quantity as amountUsd,
          o.usdToLkrRate as exRate
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
        order by s.PO_SO_DOC_NO
      `);

    console.log("ROWS =", rows.length);

    return rows;

  } catch (error) {

    console.error(
      "MONTHLY SALE ORDER SERVICE ERROR",
      error
    );

    throw error;
  }
}