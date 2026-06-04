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
const reference = 'CPCP-' + headerRows[0].reference;
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

  //console.log(
  //  "createWgTransferNote",
 //   planningId
 // );
 const itemRows: any[]  =
 await prisma.$queryRawUnsafe(`
declare @table_2 table(itemId int, unitId int, quantity decimal(18,2), cost decimal(18,2),
date  datetime, reference nvarchar(255), fgnRef int)
insert into @table_2
select 897 as itemId, 1 as unitId, sum(D.totalPolyethyleneRequirementKg) as Qty, 0,
p.createdAt as date, p.planningNo as reference,  p.Id as fgnRef
from [ProductionPlanning] p  inner join  [ProductionPlanningPart] D on
P.id = D.planningId where p.id =${planningId}
group by p.createdAt, p.planningNo, p.Id
update T set T.cost = I.IT_MST_COST_PRICE
from @table_2 T inner join ITEM_MASTER I on T.itemId = i.IT_MST_CODE 
select * from @table_2
`);
if (!itemRows.length) {
  throw new Error(
    `WG transfer data not found for planning ${planningId}`
  );
}

//console.log("WG DATA =", itemRows);

const itemId =  Number(itemRows[0].itemId);
const unitId =  Number(itemRows[0].unitId);
const qty =  Number(itemRows[0].quantity);
const cost =  Number(itemRows[0].cost);
const reference = 'WG-' + itemRows[0].reference;
const fgnRef =  itemRows[0].fgnRef;
const formattedDate =  new Date(itemRows[0].date).toLocaleDateString("en-US");


const resultRows: any[] =  await prisma.$queryRawUnsafe(`
    declare @p22 dbo.STK_Common_DetailUdt

    insert into @p22 values(
      1,  0,  ${itemId},  ${unitId},  ${qty},  N'N/A',   0,
      ${cost},  0,  NULL,  0,  N'Default',  N'REQU',  0,
      NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0 )

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

//console.log(
//  "WG TRANSFER RESULT =",  result
//);

  return result;

}