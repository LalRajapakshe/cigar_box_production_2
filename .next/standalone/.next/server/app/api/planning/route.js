"use strict";(()=>{var e={};e.id=814,e.ids=[814],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},70912:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>D,patchFetch:()=>I,requestAsyncStorage:()=>R,routeModule:()=>N,serverHooks:()=>T,staticGenerationAsyncStorage:()=>m});var n={};r.r(n),r.d(n,{GET:()=>p,PATCH:()=>c,POST:()=>l});var a=r(49303),i=r(88716),o=r(60670),s=r(87070),_=r(64824);async function d(e){let t=await _._.$queryRawUnsafe(`
      select
          sheetKey,

          sum(
            (pieceWidth + pieceHeight)
            * 2
            * quantityPerBox
          ) as perimeter

      from ProductionPlanningPart

      where planningId = ${e}

      group by sheetKey
  `),r=0;for(let e of t){let t=await _._.$queryRawUnsafe(`
         select Amount
         from perimeterCalculation
         where  ${e.perimeter} >= fromlenght
         and
         ${e.perimeter} <= toLength
      `);r+=Number(t[0]?.Amount??0)}let n=await _._.$queryRawUnsafe(`
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
    where P.id = ${e}
  `);if(!n.length)throw Error(`Planning ${e} not found`);let a=Number(n[0].itemId),i=Number(n[0].unitId),o=Number(n[0].Qty),s="CPCP-"+n[0].reference,d=n[0].fgnRef,u=new Date(n[0].date).toLocaleDateString("en-US"),p=await _._.$queryRawUnsafe(`
    declare @p22 dbo.STK_Common_DetailUdt

    insert into @p22 values(
      1,  0,  ${a},  ${i},  ${o},  N'N/A',   0,
      ${r},  0,  NULL,  0,  N'Default',  N'REQU',  0,
      NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0 )

  declare @p23 int
set @p23=22501
exec SAVE_STOCK_COMMON_W_A_GENERATE_BASE_SP @STK_DOC_DIAMENTION_ID=210,@STK_HDR_HDR_ID=0,
@STK_HDR_HDR_DOC_SERIES=N'TBZN',@STK_HDR_HDR_DOC_NO_INT_ID=N'0',@STK_HDR_HDR_DOC_DATE=N'${u}',
@STK_HDR_DOC_TYPE=N'TRAN',@STK_HDR_TXN_TYPE=N'R65',@STK_HDR_HDR_NARRATION=N'N/A',@STK_HDR_HDR_FROM_LOC_ID=135,
@STK_HDR_HDR_TO_LOC_ID=18,@STK_HDR_BRD_COLL_GRN_NO=N'',@STK_DOC_HDR_IS_EDITABLE=1,@STK_DOC_REF_CODE=N'${s}',
@STK_DOC_FGN_REF_CODE=N'${d}',@STK_DOC_CONTACT_ID=0,@STK_HDR_DET_ACTION_ID=9,@STK_HDR_INF_LH_1=${e},@STK_HDR_INF_LH_2=0,
@STK_HDR_INF_LH_3=0,@STK_HDR_INF_LH_4=0,@USER_ID=43,@STK_Common_DetailUdt=@p22,@Next_Available_No=@p23 output    
select ERP_RESULT = @p23
  `);return Number(p[0]?.ERP_RESULT??0)}async function u(e){let t=await _._.$queryRawUnsafe(`
declare @table_2 table(itemId int, unitId int, quantity decimal(18,2), cost decimal(18,2),
date  datetime, reference nvarchar(255), fgnRef int)
insert into @table_2
select 897 as itemId, 1 as unitId, sum(D.totalPolyethyleneRequirementKg) as Qty, 0,
p.createdAt as date, p.planningNo as reference,  p.Id as fgnRef
from [ProductionPlanning] p  inner join  [ProductionPlanningPart] D on
P.id = D.planningId where p.id =${e}
group by p.createdAt, p.planningNo, p.Id
update T set T.cost = I.IT_MST_COST_PRICE
from @table_2 T inner join ITEM_MASTER I on T.itemId = i.IT_MST_CODE 
select * from @table_2
`);if(!t.length)throw Error(`WG transfer data not found for planning ${e}`);let r=Number(t[0].itemId),n=Number(t[0].unitId),a=Number(t[0].quantity),i=Number(t[0].cost),o="WG-"+t[0].reference,s=t[0].fgnRef,d=new Date(t[0].date).toLocaleDateString("en-US"),u=await _._.$queryRawUnsafe(`
    declare @p22 dbo.STK_Common_DetailUdt

    insert into @p22 values(
      1,  0,  ${r},  ${n},  ${a},  N'N/A',   0,
      ${i},  0,  NULL,  0,  N'Default',  N'REQU',  0,
      NULL,  0,  NULL,  NULL,  N'150', 0, N'-None-',  0 )

  declare @p23 int
set @p23=0
exec SAVE_STOCK_COMMON_W_A_GENERATE_BASE_SP @STK_DOC_DIAMENTION_ID=211,@STK_HDR_HDR_ID=0,
@STK_HDR_HDR_DOC_SERIES=N'TBZN',@STK_HDR_HDR_DOC_NO_INT_ID=N'0',@STK_HDR_HDR_DOC_DATE=N'${d}',
@STK_HDR_DOC_TYPE=N'TRAN',@STK_HDR_TXN_TYPE=N'R65',@STK_HDR_HDR_NARRATION=N'N/A',@STK_HDR_HDR_FROM_LOC_ID=138,
@STK_HDR_HDR_TO_LOC_ID=19,@STK_HDR_BRD_COLL_GRN_NO=N'',@STK_DOC_HDR_IS_EDITABLE=1,@STK_DOC_REF_CODE=N'${o}',
@STK_DOC_FGN_REF_CODE=N'${s}',@STK_DOC_CONTACT_ID=0,@STK_HDR_DET_ACTION_ID=9,@STK_HDR_INF_LH_1=${e},@STK_HDR_INF_LH_2=0,
@STK_HDR_INF_LH_3=0,@STK_HDR_INF_LH_4=0,@USER_ID=43,@STK_Common_DetailUdt=@p22,@Next_Available_No=@p23 output    
select ERP_RESULT = @p23
  `);return Number(u[0]?.ERP_RESULT??0)}async function p(e){try{let t=e.nextUrl.searchParams.get("orderId");if(!t)return s.NextResponse.json({message:"orderId is required"},{status:400});let r=await _._.productionPlanning.findMany({where:{orderId:Number(t)},include:{parts:!0,order:!0},orderBy:{id:"desc"}});return s.NextResponse.json(r)}catch(e){return console.error("GET /api/planning failed",e),s.NextResponse.json({message:"Failed to load planning"},{status:500})}}async function l(e){try{let t=await e.json(),r=await _._.productionPlanning.findFirst({orderBy:{id:"desc"}}),n=r?r.id+1:1,a=`PLAN-${String(n).padStart(6,"0")}`,i=await _._.productionPlanning.create({data:{planningNo:a,orderId:Number(t.orderId),plannedQuantity:t.plannedProductionQuantity,totalParts:t.summary.totalParts,totalPiecesRequired:t.summary.totalPiecesRequired,totalSlatsRequired:t.summary.totalSlatsRequired,totalBoardsRequired:t.summary.totalBoardsRequired,totalProductionTimeMinutes:t.summary.totalProductionTimeMinutes,status:"PLANNING",parts:{create:t.parts.map(e=>({sheetKey:e.sheetKey,sheetLabel:e.sheetLabel,pieceWidth:e.pieceWidth,pieceHeight:e.pieceHeight,quantityPerBox:e.quantityPerBox,totalPiecesRequired:e.totalPiecesRequired,boardWidth:e.boardWidth,boardHeight:e.boardHeight,cuttingWidth:e.cuttingWidth,cuttingHeight:e.cuttingHeight,orientation:e.orientation,piecesPerSlat:e.piecesPerSlat,slatsPerBoard:e.slatsPerBoard,piecesPerBoard:e.piecesPerBoard,totalSlatsRequired:e.totalSlatsRequired,totalBoardsRequired:e.totalBoardsRequired,remainingBoardWidth:e.remainingBoardWidth,remainingBoardHeight:e.remainingBoardHeight,productionTimeMinutesPerPiece:e.productionTimeMinutesPerPiece,totalProductionTimeMinutes:e.totalProductionTimeMinutes,polyBagWidthMm:e.polyBagWidthMm,polyBagHeightMm:e.polyBagHeightMm,polyethyleneWeightPer1000:e.polyethyleneWeightPer1000,totalPolyethyleneRequirementKg:e.totalPolyethyleneRequirementKg}))}},include:{parts:!0,order:!0}});return await _._.order.update({where:{id:Number(t.orderId)},data:{status:"planned"}}),await _._.productionPlanningLog.create({data:{planningId:i.id,orderId:Number(t.orderId),userId:0,status:"PLANNING"}}),s.NextResponse.json(i)}catch(e){return console.error("POST /api/planning failed",e),s.NextResponse.json({message:"Failed to save planning"},{status:500})}}async function c(e){try{let t=await e.json();if("COMPLETE"===t.status){let e=await d(Number(t.id));if(e<=0)return s.NextResponse.json({message:`Item transfer failed. ERP returned ${e}`},{status:400});let r=await u(Number(t.id));if(r<=0)return s.NextResponse.json({message:`Item transfer failed. ERP returned ${r}`},{status:400})}let r=await _._.productionPlanning.update({where:{id:Number(t.id)},data:{status:t.status}}),n="planned";return"IN_PRODUCTION"===t.status&&(n="inProduction"),"COMPLETE"===t.status&&(n="completed"),await _._.order.update({where:{id:Number(t.orderId)},data:{status:n}}),await _._.productionPlanningLog.create({data:{planningId:r.id,orderId:Number(t.orderId),userId:0,status:t.status}}),s.NextResponse.json(r)}catch(e){return console.error("PATCH /api/planning failed",e),s.NextResponse.json({message:"Failed to update planning status",error:String(e)},{status:500})}}let N=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/planning/route",pathname:"/api/planning",filename:"route",bundlePath:"app/api/planning/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\planning\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:R,staticGenerationAsyncStorage:m,serverHooks:T}=N,D="/api/planning/route";function I(){return(0,o.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[276,918,616],()=>r(70912));module.exports=n})();