"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import { API_BASE } from "@/lib/apiBase";

export default function Page() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  async function loadReport() {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-sanding-outside-payment-history?fromDate=${fromDate}&toDate=${toDate}`
    );

    const data = await response.json();

    setRows(Array.isArray(data) ? data : []);
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
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">
        Sanding Outside Payment History
      </h1>

      <div className="flex gap-3">
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
          className="px-4 py-2 border rounded"
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
            <th>Sales Order No</th>
            <th>Job No</th>
            <th>Issue No</th>
            <th>Issue Date</th>
            <th>Item Name</th>
            <th>Bag No</th>
            <th>Issued Kg</th>
            <th>Issued Pcs</th>
            <th>Rec. Date</th>
            <th>Received</th>
            <th>Good Pcs</th>
            <th>Rejected</th>
            <th>Rec. By</th>
            <th>Payment No</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.salesOrderNo}</td>
              <td>{row.jobNo}</td>
              <td>{row.issueNo}</td>
              <td>{row.issueDate}</td>
              <td>{row.itemName}</td>
              <td>{row.bagNo}</td>

              <td className="text-right">
                {Number(
                  row.issuedKg
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="text-right">
                {Number(
                  row.issuedPcs
                ).toLocaleString()}
              </td>

              <td>{row.receivedDate}</td>

              <td className="text-right">
                {Number(
                  row.received
                ).toLocaleString()}
              </td>
              <td className="text-right">
                {Number(row.goodPcs
                ).toLocaleString()}
              </td>
         
              <td className="text-right">
                {Number(
                  row.rejected
                ).toLocaleString()}
              </td>

              <td>{row.receivedBy}</td>

              <td>{row.paymentNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}