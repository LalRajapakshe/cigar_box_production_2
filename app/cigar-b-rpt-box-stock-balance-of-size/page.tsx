"use client";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/apiBase";

export default function Page() {

  const [rows, setRows] =
    useState<any[]>([]);

  async function loadReport() {

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-box-stock-balance-of-size`
      );

    const data =
      await response.json();

    setRows(
      Array.isArray(data)
        ? data
        : []
    );
  }

  useEffect(() => {
    loadReport();
  }, []);

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

    <div className="space-y-4 p-4">

      <h1 className="text-xl font-bold">
        Box Stock Balance Of Size
      </h1>
      <div className="flex gap-3">

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

            <th className="text-left">Item ID</th>
            <th className="text-left">Type</th>
            <th className="text-left">Part</th>

            <th className="text-right">
              Printed
            </th>

            <th className="text-right">
              UnPrinted
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td className="text-left">{row.itemId}</td>

                <td className="text-left">{row.type}</td>

                <td className="text-left">{row.part}</td>

                <td className="text-right">

                  {Number(
                    row.printed
                  ).toLocaleString()}

                </td>

                <td className="text-right">

                  {Number(
                    row.unPrinted
                  ).toLocaleString()}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}