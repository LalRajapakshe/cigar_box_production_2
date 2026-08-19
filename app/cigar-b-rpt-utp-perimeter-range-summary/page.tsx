"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import { API_BASE } from "@/lib/apiBase";

export default function Page() {

  const [rows, setRows] =
    useState<any[]>([]);

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  async function loadReport() {

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-utp-perimeter-range-summary?fromDate=${fromDate}&toDate=${toDate}`
      );

    const data =
      await response.json();

    setRows(data);
  }

  const totalPieces =
    rows.reduce(
      (sum, row) =>
        sum + Number(row.pieces || 0),
      0
    );

  const totalAmount =
    rows.reduce(
      (sum, row) =>
        sum + Number(row.amount || 0),
      0
    );

const handlePrint = () => {
  window.print();
};
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

  return (
    <div className="p-4">

      <h1 className="mb-4 text-xl font-bold">
        UTP Perimeter Range Summary
      </h1>

      <div className="mb-4 flex gap-2">

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
        />

        <button
          onClick={loadReport}
          className="rounded border px-4 py-2"
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

      <table className="w-full border border-collapse">

        <thead>

          <tr>

            <th className="border px-4 py-2">
              Size
            </th>

            <th className="border px-4 py-2">
              Rate
            </th>

            <th className="border px-4 py-2">
              Perimeter Range
            </th>

            <th className="border px-4 py-2 text-right">
              No Of Pieces
            </th>

            <th className="border px-4 py-2 text-right">
              Amount
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (
              <tr key={index}>

            <td className="border px-4 py-2 text-right">
                  {row.size}
                </td>

                <td className="border px-4 py-2 text-right">
                  {row.rate.toFixed(2)}
                </td>

                <td className="border px-4 py-2">
                  {row.perimeterRange}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.pieces
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.amount
                  ).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>

              </tr>
            )
          )}

        </tbody>

        <tfoot>

          <tr className="font-bold">

            <td
              colSpan={3}
              className="border px-4 py-2"
            >
              TOTAL
            </td>

            <td className="border px-4 py-2 text-right">
              {totalPieces.toLocaleString()}
            </td>

            <td className="border px-4 py-2 text-right">
              {totalAmount.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </td>

          </tr>

        </tfoot>

      </table>

    </div>
  );
}