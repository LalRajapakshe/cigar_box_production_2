"use strict";(()=>{var e={};e.id=692,e.ids=[692],e.modules={49262:e=>{e.exports=require("@prisma/client/runtime/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},9714:e=>{e.exports=require("constants")},84770:e=>{e.exports=require("crypto")},18139:e=>{e.exports=require("dgram")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},95346:e=>{e.exports=require("timers")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},9907:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.mjs")},89900:e=>{e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.sqlserver.wasm-base64.mjs")},72254:e=>{e.exports=require("node:buffer")},17718:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},93977:e=>{e.exports=require("node:fs/promises")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},70612:e=>{e.exports=require("node:os")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},51193:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>l,requestAsyncStorage:()=>x,routeModule:()=>d,serverHooks:()=>q,staticGenerationAsyncStorage:()=>c});var o={};t.r(o),t.d(o,{GET:()=>u});var s=t(49303),i=t(88716),a=t(60670),p=t(87070),n=t(64824);async function u(e){try{let{searchParams:r}=new URL(e.url),t=r.get("fromDate"),o=r.get("toDate"),s=(await n._.$queryRawUnsafe(`
        select
          h.[planningNo] as planningNo,

          o.[orderNo] as orderNo,

          o.[orderDate] as orderDate,

          b.name as itemName

        from [Orders] o

        inner join [ProductionPlanning] h
          on o.[id] = h.[orderId]

        inner join [BoxType] b
          on b.id = o.boxTypeId

        where
          cast(o.[orderDate] as datetime)
            >= cast('${t}' as datetime)

          and cast(o.[orderDate] as datetime)
            <= cast('${o}' as datetime)

        order by
          o.[orderDate] desc
      `)).map(e=>({orderNo:e.orderNo,orderDate:e.orderDate,itemName:e.itemName,planningNo:e.planningNo,issuedQty:Math.floor(500*Math.random())+1}));return p.NextResponse.json(s)}catch(e){return console.error(e),p.NextResponse.json({message:"Failed to load board issued jobs report"},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/cigar-b-rpt-board-issued-jobs/route",pathname:"/api/cigar-b-rpt-board-issued-jobs",filename:"route",bundlePath:"app/api/cigar-b-rpt-board-issued-jobs/route"},resolvedPagePath:"D:\\Projects\\cigar_box_production_2\\app\\api\\cigar-b-rpt-board-issued-jobs\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:c,serverHooks:q}=d,m="/api/cigar-b-rpt-board-issued-jobs/route";function l(){return(0,a.patchFetch)({serverHooks:q,staticGenerationAsyncStorage:c})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[276,918,616],()=>t(51193));module.exports=o})();