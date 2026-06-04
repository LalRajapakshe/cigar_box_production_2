"use strict";(()=>{var e={};e.id=435,e.ids=[435],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},10940:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>R,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>E,staticGenerationAsyncStorage:()=>m});var s={};t.r(s),t.d(s,{GET:()=>_,POST:()=>T});var o=t(49303),a=t(88716),i=t(60670),n=t(87070),u=t(64824),p=t(19707);function d(e){return{...e,materialId:e.materialId??void 0,createdAt:e.createdAt.toISOString(),updatedAt:e.updatedAt.toISOString()}}async function _(){try{let e=await u._.boardDefinition.findMany({orderBy:{createdAt:"desc"}});return n.NextResponse.json(e.map(d))}catch(e){return console.error("GET /api/master-settings/boards failed:",e),n.NextResponse.json({message:"Failed to load boards.",error:e instanceof Error?e.message:String(e)},{status:500})}}async function T(e){try{let r=await e.json();if(!r.name?.trim())return n.NextResponse.json({message:"Board name is required."},{status:400});let t=await (0,p.T)({description:r.name.trim(),groupCode:13,controlTableCode:35,defaultUnitId:3}),s=await u._.boardDefinition.create({data:{name:r.name.trim(),width:Number(r.width),height:Number(r.height),materialId:r.materialId||null,erpItemRefId:t.erpItemRefId}});return n.NextResponse.json(d(s),{status:201})}catch(e){return console.error("POST /api/master-settings/boards failed:",e),n.NextResponse.json({message:"Failed to create board.",error:e instanceof Error?e.message:String(e)},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/master-settings/boards/route",pathname:"/api/master-settings/boards",filename:"route",bundlePath:"app/api/master-settings/boards/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\master-settings\\boards\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:m,serverHooks:E}=c,x="/api/master-settings/boards/route";function R(){return(0,i.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:m})}},19707:(e,r,t)=>{t.d(r,{T:()=>a});var s=t(64824);let o={[-2]:"Item Name already exists",[-3]:"Item Group not found",[-4]:"Unit not found",[-5]:"Sales Account not found",[-6]:"Purchase Account not found",[-7]:"Item Alias already exists"};async function a(e){let r=await s._.$queryRawUnsafe(`
      select CTRL_TBL_DESCRIPTION,
             CTRL_TBL_NUMBER
      from CONTROL_TABLE
      where CTRL_TBL_CODE = ${e.controlTableCode}
    `);if(!r.length)throw Error("Control table setup not found.");let t=r[0],a=`${t.CTRL_TBL_DESCRIPTION}-`+String(t.CTRL_TBL_NUMBER).padStart(5,"0");await s._.$queryRawUnsafe(`
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
      @ALIAS=N'${a}',
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
  `);let i=await s._.$queryRawUnsafe(`
    SELECT TOP 1 IT_MST_CODE
    FROM ITEM_MASTER
    WHERE IT_MST_ALIAS = '${a}'
    ORDER BY IT_MST_CODE DESC
  `),n=Number(i[0]?.IT_MST_CODE??0);if(n<=0)throw Error(o[n]??`ERP response is ${n}. Save not success`);return await s._.$executeRawUnsafe(`
    update CONTROL_TABLE
    set CTRL_TBL_NUMBER = CTRL_TBL_NUMBER + 1
    where CTRL_TBL_CODE = ${e.controlTableCode}
  `),{erpItemRefId:n,alias:a}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[276,918,616],()=>t(10940));module.exports=s})();