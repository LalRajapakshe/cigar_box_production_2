"use client";
import * as XLSX from "xlsx";
import { API_BASE }
from "@/lib/apiBase";

import { useState } from "react";

export default function Page() {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [rows, setRows] =
    useState<any[]>([]);

  async function loadReport() {

    if (!fromDate || !toDate) {

      alert(
        "Please select From Date and To Date"
      );

      return;
    }

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-monthly-orders-job-summary?fromDate=${fromDate}&toDate=${toDate}`
      );

    const data =
      await response.json();

    setRows(
      Array.isArray(data)
        ? data
        : []
    );
  }
  const exportExcel = () => {
  const worksheet =
    XLSX.utils.json_to_sheet(rows);
  const workbook =
    XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );
  XLSX.writeFile(
    workbook,
    "MonthlyOrdersAndJobSummary.xlsx"
  );
};
  const formatAmount = (value: any) =>
  Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
const handlePrint = () => {
  window.print();
};
  return (

    <div className="space-y-4">

      <h1 className="text-xl font-bold">
        Monthly Orders And Job Summary
      </h1>

      <div className="flex gap-3">

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(
              e.target.value
            )
          }
        />

        <button
          onClick={loadReport}
          className="primary-btn"
        >
          Load
        </button>

   <button
  onClick={handlePrint}
  className="rounded-xl bg-green-700 px-4 py-2 text-white"
>
  Print
</button> 

  <button
  onClick={exportExcel}
>
  Export Excel
</button>
      </div>

      <table className="w-full border">

        <thead>

          <tr>

            <th className="border px-4 py-2 text-left">Customer</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Sales Order No</th>
            <th className="border px-4 py-2 text-left">Job No</th>
            <th className="border px-4 py-2 text-left">Item Code</th>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Box Type</th>
            <th className="border px-4 py-2 text-left">Customer PO</th>
            <th className="border px-4 py-2 text-right">Remaining Qty</th>
            <th className="border px-4 py-2 text-right">Unit Rate (LKR)</th>
            <th className="border px-4 py-2 text-right">Unit Rate (USD)</th>
            <th className="border px-4 py-2 text-right">Amount LKR</th>
            <th className="border px-4 py-2 text-right">Amount USD</th>
            <th className="border px-4 py-2 text-right">Ex Rate</th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td>{row.customerName}</td>
                <td>{row.date}</td>
                <td>{row.salesOrderNo}</td>
                <td>{row.jobNo}</td>
                <td>{row.itemCode}</td>
                <td>{row.plankCutting}</td>
                <td>{row.boxType}</td>
                <td>{row.customerPo}</td>
                <td>{formatAmount(row.remainingQty)}</td>
                <td>{formatAmount(row.unitRate)}</td>
                <td>{formatAmount(row.unitRateUSD)}</td>
                <td>{formatAmount(row.amountLkr)}</td>
                <td>{formatAmount(row.amountUsd)}</td>
                <td>{row.exRate}</td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}