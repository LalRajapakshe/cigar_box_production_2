"use client";

import { useRef } from "react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SlatCuttingPrintReport
from "@/components/planning/SlatCuttingPrintReport";


export default function SlatCuttingPageContent() {
const printedRef = useRef(false);
  const searchParams =
    useSearchParams();

  const planningNo =
    searchParams.get("planningNo");

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    async function loadData() {

      const basePath =
  window.location.pathname.startsWith("/cb")
    ? "/cb"
    : "";

const response =
  await fetch(
    `${basePath}/api/cigar-b-rpt-slat-cutting-sheet?planningNo=${planningNo}`
  );
    //  const response =
    //    await fetch(
    //      `/api/cigar-b-rpt-slat-cutting-sheet?planningNo=${planningNo}`
    //    );

      const result =
        await response.json();

      console.log(
        "REPORT DATA",
        result
      );

      setData(result);

if (!printedRef.current) {

  printedRef.current = true;

  setTimeout(() => {
    window.print();
  }, 500);

}
    }

    if (planningNo) {
      loadData();
    }

  }, [planningNo]);

if (!data) {
  return <div>Loading...</div>;
}
  return (
    <div>
   <SlatCuttingPrintReport
  report={data}
/>
    </div>
  );
}