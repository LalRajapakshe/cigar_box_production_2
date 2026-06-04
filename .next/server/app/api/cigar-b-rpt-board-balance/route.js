"use strict";(()=>{var e={};e.id=304,e.ids=[304],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},9347:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>q,requestAsyncStorage:()=>d,routeModule:()=>_,serverHooks:()=>x,staticGenerationAsyncStorage:()=>c});var o={};t.r(o),t.d(o,{GET:()=>u});var s=t(49303),a=t(88716),i=t(60670),p=t(87070),n=t(64824);async function u(e){try{let{searchParams:r}=new URL(e.url),t=r.get("fromDate"),o=r.get("toDate"),s=(await n._.$queryRawUnsafe(`
        select
          p.STK_PST_ITEM_CODE as itemCode,
          p.STK_PST_ITEM_NAME as itemName,
          sum(p.STK_PST_DOC_QTY) as forecastQty

        from STOCK_LEDGER_HEADER_W_A h

        inner join STOCK_LEDGER_POSTING_W_A p
          on h.STK_HDR_DOC_ID = p.STK_DET_HEADER_ID

        inner join ITEM_MASTER i
          on i.IT_MST_CODE = p.STK_PST_ITEM_ID

        where
          i.IT_MST_GRP_CODE = 14
          and h.STK_HDR_TO_LOC_ID = 89

          and cast(h.STK_HDR_DOC_DATE as datetime)
            >= cast('${t}' as datetime)

          and cast(h.STK_HDR_DOC_DATE as datetime)
            <= cast('${o}' as datetime)

        group by
          p.STK_PST_ITEM_CODE,
          p.STK_PST_ITEM_NAME

        order by
          p.STK_PST_ITEM_NAME
      `)).map(e=>({itemCode:e.itemCode,itemName:e.itemName,forecastQty:Number(e.forecastQty??0),actualBalance:1e3,forecastBalance:1e3-Number(e.forecastQty??0)}));return p.NextResponse.json(s)}catch(e){return console.error(e),p.NextResponse.json({message:"Failed to load board balance report"},{status:500})}}let _=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/cigar-b-rpt-board-balance/route",pathname:"/api/cigar-b-rpt-board-balance",filename:"route",bundlePath:"app/api/cigar-b-rpt-board-balance/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\cigar-b-rpt-board-balance\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:c,serverHooks:x}=_,m="/api/cigar-b-rpt-board-balance/route";function q(){return(0,i.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:c})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[276,918,616],()=>t(9347));module.exports=o})();