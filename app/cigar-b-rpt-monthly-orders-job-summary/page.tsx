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

            <th>Customer</th>
            <th>Date</th>
            <th>Sales Order No</th>
            <th>Customer PO</th>
            <th>Remaining Qty</th>
            <th>Unit Rate</th>
            <th>Amount LKR</th>
            <th>Amount USD</th>
            <th>Ex Rate</th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td>{row.customerName}</td>
                <td>{row.date}</td>
                <td>{row.salesOrderNo}</td>
                <td>{row.customerPo}</td>
                <td>{formatAmount(row.remainingQty)}</td>
                <td>{formatAmount(row.unitRate)}</td>
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