"use client";
import { API_BASE }
from "@/lib/apiBase";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";

export default function Page() {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [rows, setRows] =
    useState<any[]>([]);

  async function loadReport() {

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-monthly-sale-order?fromDate=${fromDate}&toDate=${toDate}`
      );

    const data =
      await response.json();

    setRows(data);
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
        Monthly Sale Order Report
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
            <th className="border px-4 py-2 text-left">SO No</th>
            <th className="border px-4 py-2 text-left">Job No</th>
            <th className="border px-4 py-2 text-left">Customer PO</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Item Code</th>
            <th className="border px-4 py-2 text-right">Remaining Qty</th>
            <th className="border px-4 py-2 text-right">Amount LKR</th>
            <th className="border px-4 py-2 text-right">Rate USD</th>
            <th className="border px-4 py-2 text-right">Amount USD</th>
            <th className="border px-4 py-2 text-right">Ex Rate</th>
          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td className="border px-4 py-2 text-left">{row.soNo}</td>
                <td className="border px-4 py-2 text-left">{row.jobNo}</td>
                <td className="border px-4 py-2 text-left">{row.customerPo}</td>
                <td className="border px-4 py-2 text-left">{row.date}</td>
                <td className="border px-4 py-2 text-left">{row.itemCode}</td>
                <td className="border px-4 py-2 text-right">{formatAmount(row.remainingQty)}</td>
                <td className="border px-4 py-2 text-right">{formatAmount(row.amountLkr)}</td>
                <td className="border px-4 py-2 text-right">{formatAmount(row.rateUsd)}</td>
                <td className="border px-4 py-2 text-right">{formatAmount(row.amountUsd)}</td>
                <td className="border px-4 py-2 text-right">{formatAmount(row.exRate)}</td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );

}