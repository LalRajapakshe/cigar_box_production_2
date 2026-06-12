"use client";
import * as XLSX from "xlsx";
import { useState } from "react";

import {
  boxTypeMasterReportService,
} from "@/lib/services/boxTypeMasterReportService";

export default function BoxTypeMasterReportPage() {

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadReport = async () => {

    try {

      setLoading(true);

      const data =
        await boxTypeMasterReportService.getReport();

      setRows(data);

    } catch (error) {

      console.error(error);

      alert("Failed to load report");

    } finally {

      setLoading(false);

    }
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
  const formatAmount = (value: any) =>
  Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-shell">

      <div className="page-container">

        <section className="page-hero">

          <h1 className="page-title">
            Box Type Master Report
          </h1>

          <p className="page-subtitle">
            Box Type Master Details
          </p>

        </section>

        <section className="section-card">

          <div className="mb-4 flex gap-3">

            <button
              onClick={loadReport}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white"
            >
              {loading
                ? "Loading..."
                : "Load Report"}
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

          <div className="overflow-auto">

            <table className="min-w-full text-sm">

              <thead>

                <tr>

                  <th className="text-left">Name</th>

                  <th className="text-left">Description</th>

                  <th className="text-right">Top Width</th>

                  <th className="text-right">Top Height</th>

                  <th className="text-right">Long Width</th>

                  <th className="text-right">Long Height</th>

                  <th className="text-right">Short Width</th>

                  <th className="text-right">Short Height</th>

                  <th className="text-right">Print Available</th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (row, index) => (

                    <tr key={index}>

                      <td className="text-left">{row.name}</td>

                      <td className="text-left">{row.description}</td>

                      <td className="text-right">{formatAmount(row.top_width)}</td>

                      <td className="text-right">{formatAmount(row.top_height)}</td>

                      <td className="text-right">{formatAmount(row.long_width)}</td>

                      <td className="text-right">{formatAmount(row.long_height)}</td>

                      <td className="text-right">{formatAmount(row.short_width)}</td>

                      <td className="text-right">{formatAmount(row.short_height)}</td>

                      <td className="text-left">{row.print_available}</td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </div>
  );
}