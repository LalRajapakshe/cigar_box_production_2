"use strict";(()=>{var e={};e.id=805,e.ids=[805],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},4690:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>_,requestAsyncStorage:()=>g,routeModule:()=>c,serverHooks:()=>f,staticGenerationAsyncStorage:()=>y});var s={};r.r(s),r.d(s,{GET:()=>h,POST:()=>m});var i=r(49303),o=r(88716),n=r(60670),a=r(87070),p=r(64824),u=r(78241),d=r(19707);async function l(e){return p._.boxType.findUnique({where:{id:e},include:{sheets:{include:{surfaces:!0}}}})}async function h(){try{let e=await p._.boxType.findMany({include:{sheets:{include:{surfaces:!0}}},orderBy:{createdAt:"desc"}});return a.NextResponse.json(e.map(u.I))}catch(e){return console.error("GET /api/master-settings/box-types failed:",e),a.NextResponse.json({message:"Failed to load box types.",error:e instanceof Error?e.message:String(e)},{status:500})}}async function m(e){try{let t=await e.json(),r=(0,u.F)(t);if(!t.name?.trim())return a.NextResponse.json({message:"Box type name is required."},{status:400});if(!t.boardDefinitionId)return a.NextResponse.json({message:"Board definition is required."},{status:400});let s=await (0,d.T)({description:t.name.trim(),groupCode:14,controlTableCode:36,defaultUnitId:3}),i=[];for(let e of r){let r=await (0,d.T)({description:`${t.name.trim()}-${e.sheetKey}- Wgt`,groupCode:22,controlTableCode:37,defaultUnitId:1}),s=await (0,d.T)({description:`${t.name.trim()}-${e.sheetKey}- Pcs`,groupCode:26,controlTableCode:37,defaultUnitId:3});i.push({sheetKey:e.sheetKey,width:e.width,height:e.height,quantity:e.quantity,productionTimeMinutes:e.productionTimeMinutes,polyBagWidthMm:e.polyBagWidthMm,polyBagHeightMm:e.polyBagHeightMm,polyethyleneWeightPer1000:e.polyethyleneWeightPer1000,surfaces:[...e.surfaces],erpItemRefId:r.erpItemRefId,erpItemRefIdPcs:s.erpItemRefId})}let o=await p._.boxType.create({data:{name:t.name.trim(),description:t.description?.trim()||null,boardDefinitionId:t.boardDefinitionId,erpItemRefId:s.erpItemRefId,sheets:{create:i.map(e=>({sheetKey:e.sheetKey,width:e.width,height:e.height,quantity:e.quantity,productionTimeMinutes:e.productionTimeMinutes,polyBagWidthMm:e.polyBagWidthMm??0,polyBagHeightMm:e.polyBagHeightMm??0,polyethyleneWeightPer1000:e.polyethyleneWeightPer1000??0,erpItemRefId:e.erpItemRefId,erpItemRefIdPcs:e.erpItemRefIdPcs,surfaces:{create:e.surfaces}}))}}}),n=await l(o.id);if(!n)return a.NextResponse.json({message:"Failed to load created box type."},{status:500});return a.NextResponse.json((0,u.I)(n),{status:201})}catch(e){return console.error("POST /api/master-settings/box-types failed:",e),a.NextResponse.json({message:"Failed to create box type.",error:e instanceof Error?e.message:String(e)},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/master-settings/box-types/route",pathname:"/api/master-settings/box-types",filename:"route",bundlePath:"app/api/master-settings/box-types/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\master-settings\\box-types\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:g,staticGenerationAsyncStorage:y,serverHooks:f}=c,T="/api/master-settings/box-types/route";function _(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:y})}},78241:(e,t,r)=>{r.d(t,{F:()=>p,I:()=>a});let s=["topSheet","longSheet","smallSheet"];function i(e){return{surfaceId:e.id,surfaceName:e.surfaceName,requiresPrinting:e.requiresPrinting,imageUrl:e.imageUrl??void 0,imageColor:e.imageColor}}function o(e){if(e)return{width:e.width,height:e.height,quantity:e.quantity,productionTimeMinutes:e.productionTimeMinutes??0,polyBagWidthMm:e.polyBagWidthMm??0,polyBagHeightMm:e.polyBagHeightMm??0,polyethyleneWeightPer1000:e.polyethyleneWeightPer1000??0,surfaces:e.surfaces.map(i)}}function n(e,t){let r=o(e.get(t));if(!r)throw Error(`Missing required sheet: ${t}`);return r}function a(e){let t=new Map(e.sheets.map(e=>[e.sheetKey,e]));for(let r of s)if(!t.has(r))throw Error(`Box type "${e.name}" is missing required sheet "${r}"`);return{id:e.id,name:e.name,description:e.description??void 0,boardDefinitionId:e.boardDefinitionId,createdAt:e.createdAt.toISOString(),updatedAt:e.updatedAt.toISOString(),topSheet:n(t,"topSheet"),longSheet:n(t,"longSheet"),smallSheet:n(t,"smallSheet"),bottomSheet:o(t.get("bottomSheet")),middleSheet:o(t.get("middleSheet"))}}function p(e){return[{sheetKey:"topSheet",sheet:e.topSheet},{sheetKey:"longSheet",sheet:e.longSheet},{sheetKey:"smallSheet",sheet:e.smallSheet},{sheetKey:"bottomSheet",sheet:e.bottomSheet},{sheetKey:"middleSheet",sheet:e.middleSheet}].filter(e=>!!e.sheet).map(e=>({sheetKey:e.sheetKey,width:e.sheet.width,height:e.sheet.height,quantity:e.sheet.quantity,productionTimeMinutes:e.sheet.productionTimeMinutes,polyBagWidthMm:e.sheet.polyBagWidthMm,polyBagHeightMm:e.sheet.polyBagHeightMm,polyethyleneWeightPer1000:e.sheet.polyethyleneWeightPer1000,surfaces:e.sheet.surfaces.map(e=>({surfaceName:e.surfaceName,requiresPrinting:e.requiresPrinting,imageUrl:e.imageUrl??null,imageColor:e.imageColor??null}))}))}},19707:(e,t,r)=>{r.d(t,{T:()=>o});var s=r(64824);let i={[-2]:"Item Name already exists",[-3]:"Item Group not found",[-4]:"Unit not found",[-5]:"Sales Account not found",[-6]:"Purchase Account not found",[-7]:"Item Alias already exists"};async function o(e){let t=await s._.$queryRawUnsafe(`
      select CTRL_TBL_DESCRIPTION,
             CTRL_TBL_NUMBER
      from CONTROL_TABLE
      where CTRL_TBL_CODE = ${e.controlTableCode}
    `);if(!t.length)throw Error("Control table setup not found.");let r=t[0],o=`${r.CTRL_TBL_DESCRIPTION}-`+String(r.CTRL_TBL_NUMBER).padStart(5,"0");await s._.$queryRawUnsafe(`
    declare @p30 dbo.ItemMasterWarehouseUdt
    declare @p31 dbo.ItemMasBonusUdt
    declare @p32 int

    set @p32 = 0

    exec SAVE_ITEM_MASTER
      @IT_CODE=0,
      @GRP_CODE=${e.groupCode},
      @CAT_A=55,
      @CAT_B=NULL,
      @CAT_C=NULL,
      @CAT_D=NULL,
      @CAT_E=NULL,
      @CAT_CODE=1,
      @CLASS_CODE=1,
      @DESCRIPTION=N'${e.description}',
      @ALIAS=N'${o}',
      @SALE_ACC=29,
      @PUR_ACC=15,
      @SL_DEFAULT=NULL,
      @PUR_DEFAULT=NULL,
      @MAX_ORD_QTY=0,
      @REORDER_LEVEL=0,
      @ORDER_QTY=0,
      @COST_METHOD=1,
      @DEF_UNT_CODE=${e.defaultUnitId},
      @DEACTIVATE=N'N',
      @BIN_NO=NULL,
      @SPECIFICATION=0,
      @ECONOMIC_INDEX=0,
      @UNIT_OF_DURATION=0,
      @DURATION=0,
      @COST_PRICE=0,
      @TRANS_PRICE=0,
      @RETAIL_PRICE=0,
      @ItemMasWarehouseUdt=@p30,
      @ItemMasBonusUdt=@p31,
      @RES=@p32 output;
  `);let n=await s._.$queryRawUnsafe(`
    SELECT TOP 1 IT_MST_CODE
    FROM ITEM_MASTER
    WHERE IT_MST_ALIAS = '${o}'
    ORDER BY IT_MST_CODE DESC
  `),a=Number(n[0]?.IT_MST_CODE??0);if(a<=0)throw Error(i[a]??`ERP response is ${a}. Save not success`);return await s._.$executeRawUnsafe(`
    update CONTROL_TABLE
    set CTRL_TBL_NUMBER = CTRL_TBL_NUMBER + 1
    where CTRL_TBL_CODE = ${e.controlTableCode}
  `),{erpItemRefId:a,alias:o}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,918,616],()=>r(4690));module.exports=s})();