"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import { API_BASE } from "@/lib/apiBase";

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
        `${API_BASE}/cigar-b-rpt-sanding-outside-ready-for-payments?fromDate=${fromDate}&toDate=${toDate}`
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
        Sanding Outside Ready For Payments
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

      <table className="w-full border">

        <thead>

          <tr>

            <th className="border px-4 py-2 text-left">Sales Order No</th>
            <th className="border px-4 py-2 text-left">Job No</th>
            <th className="border px-4 py-2 text-left">Issue No</th>
            <th className="border px-4 py-2 text-left">Issue Date</th>
            <th className="border px-4 py-2 text-left">Item Name</th>
            <th className="border px-4 py-2 text-left">Bag No</th>
            <th className="border px-4 py-2 text-right">Issued Kg</th>
            <th className="border px-4 py-2 text-right">Issued Pcs</th>
            <th className="border px-4 py-2 text-left">Rec. Date</th>
            <th className="border px-4 py-2 text-right">Received</th>
            <th className="border px-4 py-2 text-right">Rejected</th>
            <th className="border px-4 py-2 text-left">Rec. By</th>
            <th className="border px-4 py-2 text-right">Good Pcs</th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr key={index}>

                <td className="border px-4 py-2 text-left">{row.salesOrderNo}</td>
                <td className="border px-4 py-2 text-left">{row.jobNo}</td>
                <td className="border px-4 py-2 text-left">{row.issueNo}</td>
                <td className="border px-4 py-2 text-left">{row.issueDate}</td>
                <td className="border px-4 py-2 text-left">{row.itemName}</td>
                <td className="border px-4 py-2 text-left">{row.bagNo}</td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.issuedKg
                  ).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.issuedPcs
                  ).toLocaleString()
                }</td>

                <td className="border px-4 py-2 text-left">
                  {row.receivedDate}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.received
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.rejected
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 text-left">
                  {row.receivedBy}
                </td>

                <td className="border px-4 py-2 text-right">
                  {Number(
                    row.goodPcs
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