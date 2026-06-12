"use client";
import * as XLSX from "xlsx";
import { useState } from "react";

import { API_BASE }
from "@/lib/apiBase";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

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
        `${API_BASE}/cigar-b-rpt-utp-item-order-pattern?fromDate=${fromDate}&toDate=${toDate}`
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

const handlePrint = () => {
  window.print();
};
  return (

    <div className="space-y-4 p-4">

      <h1 className="text-xl font-bold">
        UTP Item Order Pattern
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

      <div
        className="border rounded p-4"
        style={{
          width: "100%",
          height: 500
        }}
      >

        <ResponsiveContainer>

          <BarChart data={rows}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="bucket"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="totalOrders"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}