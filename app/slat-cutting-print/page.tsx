"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SlatCuttingPrintReport
from "@/components/planning/SlatCuttingPrintReport";
export default function Page() {

  const searchParams =
    useSearchParams();

  const planningNo =
    searchParams.get("planningNo");

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    async function loadData() {

      const response =
        await fetch(
          `/api/cigar-b-rpt-slat-cutting-sheet?planningNo=${planningNo}`
        );

      const result =
        await response.json();

      console.log(
        "REPORT DATA",
        result
      );

      setData(result);
      setTimeout(() => {
  window.print();
}, 500);
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
      <h2>
        Slat Cutting Report
      </h2>

      <div>
        Planning No :
        {" "}
        {planningNo}
      </div>

 <SlatCuttingPrintReport
  report={data}
/>
    </div>
  );
}