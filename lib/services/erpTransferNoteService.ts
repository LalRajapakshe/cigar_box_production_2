import { prisma } from "@/lib/prisma";

export async function createPcTransferNote(
  planningId: number
): Promise<number> {

  const perimeterRows : any[] =
  await prisma.$queryRawUnsafe(`
      select
          sheetKey,

          sum(
            (pieceWidth + pieceHeight)
            * 2
            * quantityPerBox
          ) as perimeter

      from ProductionPlanningPart

      where planningId = ${planningId}

      group by sheetKey
  `);
  let boxCost = 0;
  for (const row of perimeterRows) {

   const amountRows : any[]=
      await prisma.$queryRawUnsafe(`
         select Amount
         from perimeterCalculation
         where  ${row.perimeter} >= fromlenght
         and
         ${row.perimeter} <= toLength
      `);

   boxCost += Number(
      amountRows[0]?.Amount ?? 0
   );
}
//console.log(perimeterRows);
//console.log(boxCost);
const headerRows: any[] =
  await prisma.$queryRawUnsafe(`
    select
      B.erpItemRefId as itemId,
      I.IT_MST_DEFAULT_MES_UNT as unitId,
      P.plannedQuantity as Qty, p.createdAt as date, p.planningNo as reference,  p.Id as fgnRef
    from ProductionPlanning P
    inner join Orders O
      on P.orderId = O.id
    inner join BoxType B
      on B.id = O.boxTypeId 
    inner join ITEM_MASTER I
      on I.IT_MST_CODE = B.erpItemRefId
    where P.id = ${planningId}
  `);

if (!headerRows.length) {
  throw new Error(
    `Planning ${planningId} not found`
  );
}
const itemId =  Number(headerRows[0].itemId);
const unitId =  Number(headerRows[0].unitId);
const qty =  Number(headerRows[0].Qty);
//const date =  new Date(headerRows[0].date);
const reference = 'PC-' + headerRows[0].reference;
const fgnRef =  headerRows[0].fgnRef;
const formattedDate =  new Date(headerRows[0].date).toLocaleDateString("en-US");

const resultRows: any[] =  await prisma.$queryRawUnsafe(`
    declare @p22 dbo.STK_Common_DetailUdt

    insert into @p22 values(
      1,  0,  ${itemId},  ${unitId},  ${qty},  N'N/A',   0,
      ${boxCost},  0,  NULL,  0,  N'Default',  N'REQU',  0,
      NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0 )

  declare @p23 int
set @p23=22501
exec SAVE_STOCK_COMMON_W_A_GENERATE_BASE_SP @STK_DOC_DIAMENTION_ID=210,@STK_HDR_HDR_ID=0,
@STK_HDR_HDR_DOC_SERIES=N'TBZN',@STK_HDR_HDR_DOC_NO_INT_ID=N'0',@STK_HDR_HDR_DOC_DATE=N'${formattedDate}',
@STK_HDR_DOC_TYPE=N'TRAN',@STK_HDR_TXN_TYPE=N'R65',@STK_HDR_HDR_NARRATION=N'N/A',@STK_HDR_HDR_FROM_LOC_ID=135,
@STK_HDR_HDR_TO_LOC_ID=18,@STK_HDR_BRD_COLL_GRN_NO=N'',@STK_DOC_HDR_IS_EDITABLE=1,@STK_DOC_REF_CODE=N'${reference}',
@STK_DOC_FGN_REF_CODE=N'${fgnRef}',@STK_DOC_CONTACT_ID=0,@STK_HDR_DET_ACTION_ID=9,@STK_HDR_INF_LH_1=${planningId},@STK_HDR_INF_LH_2=0,
@STK_HDR_INF_LH_3=0,@STK_HDR_INF_LH_4=0,@USER_ID=43,@STK_Common_DetailUdt=@p22,@Next_Available_No=@p23 output    
select ERP_RESULT = @p23
  `);

const result =
  Number(
    resultRows[0]?.ERP_RESULT ?? 0
  );

//console.log(
//  "PC TRANSFER RESULT =",  result
//);

  return result;
}

export async function createWgTransferNote(
  planningId: number
) : Promise<number> {

  console.log(
    "createWgTransferNote",
    planningId
  );
 const headerRows: any[]  =
 await prisma.$queryRawUnsafe(`
declare @table_2 table(date  datetime, reference nvarchar(255), fgnRef int)
insert into @table_2
select 
H.createdAt as date, H.planningNo as reference,  H.Id as fgnRef
from  [ProductionPlanning] H 
where h.id =${planningId}
select * from @table_2
`);
if (!headerRows.length) {
  throw new Error(
    `WG transfer data not found for planning ${planningId}`
  );
}

console.log("WG HDR DATA =", headerRows);
const reference = 'WG-' + headerRows[0].reference;
const fgnRef =  headerRows[0].fgnRef;
const formattedDate =  new Date(headerRows[0].date).toLocaleDateString("en-US");

{/*} insert into @p22 values(
      1,  0,  ${itemId},  ${unitId},  ${qty},  N'N/A',   0,
      ${cost},  0,  NULL,  0,  N'Default',  N'REQU',  0,
      NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0 ) */}

const resultRows: any[] =  await prisma.$queryRawUnsafe(`
    declare @p22 dbo.STK_Common_DetailUdt

 declare @Cost_P decimal(18,2); 
set @Cost_P = isnull((select I.IT_MST_COST_PRICE from ITEM_MASTER I where i.IT_MST_CODE = 897),0);

insert into @p22 
select ROW_NUMBER() OVER (ORDER BY H.Id) AS RowNo, 0,
 i.IT_MST_CODE, i.IT_MST_DEFAULT_MES_UNT, p.totalPolyethyleneRequirementKg ,  N'N/A', 0, @Cost_P,
0,  NULL,  0,  N'Default',  N'REQU',  0,
NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0
from  [ProductionPlanning] H inner join
ProductionPlanningPart P on H.[id] = p.[planningId]
inner join Orders O
on h.orderId = O.id
inner join BoxType B
on B.id = O.boxTypeId 
inner join BoxTypeSheet SH on SH.boxTypeId = B.id and SH.sheetKey = p.sheetKey
inner join ITEM_MASTER I on i.IT_MST_CODE = SH.erpItemRefId 
where h.id =${planningId}
    

  declare @p23 int
set @p23=0
exec SAVE_STOCK_COMMON_W_A_GENERATE_BASE_SP @STK_DOC_DIAMENTION_ID=211,@STK_HDR_HDR_ID=0,
@STK_HDR_HDR_DOC_SERIES=N'TBZN',@STK_HDR_HDR_DOC_NO_INT_ID=N'0',@STK_HDR_HDR_DOC_DATE=N'${formattedDate}',
@STK_HDR_DOC_TYPE=N'TRAN',@STK_HDR_TXN_TYPE=N'R65',@STK_HDR_HDR_NARRATION=N'N/A',@STK_HDR_HDR_FROM_LOC_ID=138,
@STK_HDR_HDR_TO_LOC_ID=19,@STK_HDR_BRD_COLL_GRN_NO=N'',@STK_DOC_HDR_IS_EDITABLE=1,@STK_DOC_REF_CODE=N'${reference}',
@STK_DOC_FGN_REF_CODE=N'${fgnRef}',@STK_DOC_CONTACT_ID=0,@STK_HDR_DET_ACTION_ID=9,@STK_HDR_INF_LH_1=${planningId},@STK_HDR_INF_LH_2=0,
@STK_HDR_INF_LH_3=0,@STK_HDR_INF_LH_4=0,@USER_ID=43,@STK_Common_DetailUdt=@p22,@Next_Available_No=@p23 output    
select ERP_RESULT = @p23
  `);

const result =
  Number(
    resultRows[0]?.ERP_RESULT ?? 0
  );

console.log(
  "WG TRANSFER RESULT =",  result
);

  return result;

}

function setLeadingZeros(
  value: number,
  length: number
) {
  return String(
    value
  ).padStart(
    length,
    "0"
  );
}
export async function createBoxSheetTransferNote(
  conversionId: number
): Promise<number> {
  const conversionRows: any[] =
    await prisma.$queryRawUnsafe(`
      select
        C.*,
        P.STK_PST_IT_COST as boxUnitCost
      from BoxSheetConversion C
      inner join STOCK_LEDGER_POSTING_W_A P
        on P.STK_DET_ID =
           C.fromStockRefId
      where C.id =
            ${conversionId}
    `);

  if (!conversionRows.length) {
    throw new Error(
      "Conversion not found."
    );
  }

  const hdr =
    conversionRows[0];

  const sheets: any[] =
    await prisma.$queryRawUnsafe(`
      select
        I.IT_MST_CODE as itemId,
        I.IT_MST_DESCRIPTION as itemName,
        I.IT_MST_DEFAULT_MES_UNT as unitId,
        X.sheetType,
        X.quantityPerBox
      from BoxTypeSheet S
      inner join ITEM_MASTER I
        on I.IT_MST_CODE =
           S.erpItemRefIdPcs
      inner join BoxSheetMapping X
        on X.boxTypeId =
           S.boxTypeId
       and X.sheetType =
           S.sheetKey
      where S.boxTypeId =
            '${hdr.boxTypeId}'
    `);

  let inserts = "";

  let rowNo = 1;

  for (const row of sheets) {
    const qty =
      Number(
        row.quantityPerBox
      ) *
      Number(
        hdr.conversionQty
      );

    let ratio = 0;

    if (
      row.sheetType ===
        "topSheet" ||
      row.sheetType ===
        "bottomSheet"
    ) {
      ratio = 0.5;
    } else if (
      row.sheetType ===
      "longSheet"
    ) {
      ratio = 0.3;
    } else {
      ratio = 0.2;
    }

    const sheetCost =
      (
        Number(
          hdr.boxUnitCost
        ) * ratio
      ) /
      Number(
        row.quantityPerBox
      );

    inserts += `
      insert into @p22 values(
        ${rowNo},
        0,
        ${row.itemId},
        ${row.unitId},
        ${qty},
        N'N/A',
        0,
        ${sheetCost},
        0,
        NULL,
        0,
        N'Default',
        N'REQU',
        0,
        NULL,
        0,
        NULL,
        NULL,
        N'150',
        0,
        N'-None-',
        0
      )
    `;

    rowNo++;
  }

  const formattedDate =
    new Date(
      hdr.conversionDate
    )
      .toLocaleDateString(
        "en-US"
      );

  const resultRows: any[] =
    await prisma.$queryRawUnsafe(`
      declare @p22 dbo.STK_Common_DetailUdt

      ${inserts}

      declare @p23 int
      set @p23 = 22501

      exec SAVE_STOCK_COMMON_W_A_GENERATE_BASE_SP
           @STK_DOC_DIAMENTION_ID=3,
           @STK_HDR_HDR_ID=0,
           @STK_HDR_HDR_DOC_SERIES=N'MFRN',
           @STK_HDR_HDR_DOC_NO_INT_ID=N'0',
           @STK_HDR_HDR_DOC_DATE=N'${formattedDate}',
           @STK_HDR_DOC_TYPE=N'TRAN',
           @STK_HDR_TXN_TYPE=N'R67',
           @STK_HDR_HDR_NARRATION=N'N/A',
           @STK_HDR_HDR_FROM_LOC_ID=18,
           @STK_HDR_HDR_TO_LOC_ID=${hdr.toLocationId},
           @STK_HDR_BRD_COLL_GRN_NO=N'',
           @STK_DOC_HDR_IS_EDITABLE=1,
           @STK_DOC_REF_CODE=N'${hdr.conversionNo}',
           @STK_DOC_FGN_REF_CODE=N'',
           @STK_DOC_CONTACT_ID=0,
           @STK_HDR_DET_ACTION_ID=9,
           @STK_HDR_INF_LH_1=${conversionId},
           @STK_HDR_INF_LH_2=0,
           @STK_HDR_INF_LH_3=0,
           @STK_HDR_INF_LH_4=0,
           @USER_ID=43,
           @STK_Common_DetailUdt=@p22,
           @Next_Available_No=@p23 output

      select ERP_RESULT = @p23
    `);

  const erpResult =
    Number(
      resultRows[0]
        ?.ERP_RESULT ??
        0
    );

  const tranDocNo =
    "MFRN-" +
    setLeadingZeros(
      erpResult,
      10
    );

  const tranRows: any[] =
    await prisma.$queryRawUnsafe(`
      select
        STK_HDR_DOC_ID
          as tranId
      from
        STOCK_LEDGER_HEADER_W_A
      where
        STK_HDR_DOC_NO =
        '${tranDocNo}'
    `);

  return Number(
    tranRows[0]
      ?.tranId ??
      0
  );
}