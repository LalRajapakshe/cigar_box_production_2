import { prisma } from "@/lib/prisma";

export async function getMonthlyOrdersJobSummaryReport(
  fromDate: string,
  toDate: string
) {

  const rows: any[] =
    await prisma.$queryRawUnsafe(`
      select
        s.PO_SO_CONTACT_NAME as customerName,
        CONVERT(VARCHAR(11), cast(s.PO_SO_DATE as datetime), 106) as [date],
        s.PO_SO_DOC_NO as salesOrderNo,
        o.orderNo as jobNo,
        b.name as itemCode,
        b.description as boxType,
        s.PO_SO_DESCRIPTION as customerPo,
        O.quantity as remainingQty,
        o.lkrRatePerBox as unitRate, O.usdRatePerBox as unitRateUSD,
        cast(o.lkrRatePerBox * O.quantity as decimal(18,2)) as amountLkr,
        cast(o.usdRatePerBox * O.quantity as decimal(18,2)) as amountUsd,
        o.usdToLkrRate as exRate, 
        'PlankCutting' + ' ' + isnull(cast(L2.Su as varchar(10)),'') as plankCutting
      from ProductionPlanning R
      inner join Orders O
        on O.id = R.orderId
        inner join boxtype B on O.boxTypeId = B.id
      left outer join PO_SO_DOC_DETAIL_W_A D
        on d.PO_SO_DET_ID = O.salesOrderDetailId
      left outer join PO_SO_DOC_HEADER_W_A S
        on s.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID

  left outer join 
	(select s.boxTypeId,  count(p.id) as Su from BoxTypeSheet S inner join SurfaceSpec P 
	on S.[id] = p.boxTypeSheetId
	 where p.requiresPrinting='true' group by s.boxTypeId) L2 on L2.boxTypeId = b.id

      where
        cast(s.PO_SO_DATE as datetime)
        >= cast('${fromDate}' as datetime)
        and
        cast(s.PO_SO_DATE as datetime)
        <= cast('${toDate}' as datetime)
      order by
        s.PO_SO_DATE,
        s.PO_SO_DOC_NO
    `);

  return rows;
}