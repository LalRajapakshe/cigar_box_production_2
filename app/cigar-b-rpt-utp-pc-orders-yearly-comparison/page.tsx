"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import { API_BASE } from "@/lib/apiBase";

export default function Page() {

  const [year, setYear] =
    useState(
      new Date()
        .getFullYear()
        .toString()
    );

  const [rows, setRows] =
    useState<any[]>([]);

  async function loadReport() {

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-utp-pc-orders-yearly-comparison?year=${year}`
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

    <div className="space-y-4">

      <h1 className="text-xl font-bold">
        UTP PC Orders Yearly Comparison
      </h1>

      <div className="flex gap-3">

        <input
          type="number"
          value={year}
          onChange={(e) =>
            setYear(
              e.target.value
            )
          }
          placeholder="Year"
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

      <table className="w-full border">

        <thead>

          <tr>

            <th className="text-left">Month</th>

            <th className="text-right">
              formatAmount(row.totalQty)
            </th>

            <th className="text-right">
              formatAmount(row.amount)
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td>
                  {row.monthName}
                </td>

                <td className="text-right">

                  {Number(
                    row.totalQty
                  ).toLocaleString()}

                </td>

                <td className="text-right">

                  {Number(
                    row.amount
                  ).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}