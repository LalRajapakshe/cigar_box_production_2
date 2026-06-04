"use strict";(()=>{var e={};e.id=154,e.ids=[154],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},66569:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>q,patchFetch:()=>l,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>c,staticGenerationAsyncStorage:()=>x});var o={};t.r(o),t.d(o,{GET:()=>u});var s=t(49303),a=t(88716),i=t(60670),n=t(87070),p=t(64824);async function u(e){try{let{searchParams:r}=new URL(e.url),t=r.get("fromDate"),o=r.get("toDate"),s=(await p._.$queryRawUnsafe(`
        select
          h.[planningNo] as planningNo,

          o.[orderNo] as orderNo,

          o.[orderDate] as orderDate,

          o.[quantity] as remainQty,

          b.name as itemName,

          bd.name as boardType,

          h.[totalBoardsRequired]
            as requiredBoardQty

        from [ProductionPlanning] h

        inner join [Orders] o
          on o.id = h.orderId

        inner join [BoxType] b
          on b.id = o.boxTypeId

        inner join [BoardDefinition] bd
          on bd.id = o.boardDefinitionId

        where
          h.status <> 'COMPLETE'

          and cast(o.[orderDate] as datetime)
            >= cast('${t}' as datetime)

          and cast(o.[orderDate] as datetime)
            <= cast('${o}' as datetime)

        order by
          o.[orderDate]
      `)).map(e=>({planningNo:e.planningNo,orderNo:e.orderNo,orderDate:e.orderDate,itemName:e.itemName,remainQty:Number(e.remainQty??0),boardType:e.boardType,requiredBoardQty:Number(e.requiredBoardQty??0),slatTop:"",slatBottom:"",slatLong:"",slatSmall:""}));return n.NextResponse.json(s)}catch(e){return console.error(e),n.NextResponse.json({message:"Failed to load board forecast summary report"},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/cigar-b-rpt-board-forecast-summary/route",pathname:"/api/cigar-b-rpt-board-forecast-summary",filename:"route",bundlePath:"app/api/cigar-b-rpt-board-forecast-summary/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\cigar-b-rpt-board-forecast-summary\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:x,serverHooks:c}=d,q="/api/cigar-b-rpt-board-forecast-summary/route";function l(){return(0,i.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:x})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[276,918,616],()=>t(66569));module.exports=o})();