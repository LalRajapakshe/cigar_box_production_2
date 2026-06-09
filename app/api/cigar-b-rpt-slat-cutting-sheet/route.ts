import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
) {
  try {
const planningNo =
  request.nextUrl.searchParams.get(
    "planningNo"
  );
const planningRows: any[] =
  await prisma.$queryRawUnsafe(`
    select id
    from ProductionPlanning
    where planningNo = '${planningNo}'
  `);

const planningId =
  planningRows[0]?.id;
  
    // HEADER
    const header: any[] =
      await prisma.$queryRawUnsafe(`
select
s.PO_SO_DOC_NO as salesOrderNo,
s.PO_SO_DESCRIPTION as customerPO,
'Sandamali' as userAccount,
o.deliveryDate as deliveryBy,
r.planningNo as jobNo,
b.name as item,
o.quantity as qty,
b.description as boxType,
o.orderDate as orderDate,
bd.name as board,
cast(bd.height as varchar)
+ ' X ' +
cast(bd.width as varchar) as size
from ProductionPlanning r
inner join Orders o
on o.id = r.orderId
inner join BoxType b
on b.id = o.boxTypeId
inner join BoardDefinition bd
on bd.id = b.boardDefinitionId
left outer join PO_SO_DOC_DETAIL_W_A d
on d.PO_SO_DET_ID = o.salesOrderDetailId
left outer join PO_SO_DOC_HEADER_W_A s
on s.PO_SO_HDR_ID =
d.PO_SO_DET_HEADER_ID
where r.id = ${planningId}
`);

    // STOCK STATUS
    const stockStatus: any[] =
      await prisma.$queryRawUnsafe(`
select
t.sheetKey,
s.requiresPrinting
from BoxType b
inner join BoxTypeSheet t
on b.id = t.boxTypeId
inner join Orders o
on o.boxTypeId = b.id
inner join ProductionPlanning r
on r.orderId = o.id
inner join SurfaceSpec s
on s.boxTypeSheetId = t.id
where r.id = ${planningId}
`);

    // SLAT DETAILS
    const slatDetails: any[] =
      await prisma.$queryRawUnsafe(`
select
p.sheetKey,
bs.width,
bs.height,
p.slatsPerBoard,
p.piecesPerSlat,
p.totalBoardsRequired,
p.totalSlatsRequired,
p.remainingBoardHeight,
p.remainingBoardWidth,
p.totalProductionTimeMinutes
from ProductionPlanning r
inner join ProductionPlanningPart p
on r.id = p.planningId
inner join Orders o
on o.id = r.orderId
inner join BoxTypeSheet bs
on bs.boxTypeId = o.boxTypeId
and bs.sheetKey = p.sheetKey
where r.id = ${planningId}
`);

    // POLY
    const polyDetails: any[] =
      await prisma.$queryRawUnsafe(`
select
p.sheetKey,
p.polyBagWidthMm,
p.polyBagHeightMm,
p.totalPolyethyleneRequirementKg
from ProductionPlanning r
inner join ProductionPlanningPart p
on r.id = p.planningId
where r.id = ${planningId}
`);

    const forecastBoards =
      slatDetails.reduce(
        (sum, row) =>
          sum +
          Number(
            row.totalBoardsRequired ?? 0
          ),
        0
      );

    return NextResponse.json({
      header: header[0],
      stockStatus,
      slatDetails,
      polyDetails,
      forecastBoards,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load report",
      },
      {
        status: 500,
      }
    );
  }
}