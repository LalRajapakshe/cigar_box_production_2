"use client";

import { useState } from "react";

import {
  utpItemOrderYearReportService,
} from "@/lib/services/utpItemOrderYearReportService";

export default function UtpItemOrderYearPage() {

  const currentYear =
    new Date().getFullYear();

  const [year, setYear] =
    useState(
      currentYear.toString()
    );

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadReport = async () => {

    try {

      setLoading(true);

      const data =
        await utpItemOrderYearReportService.getReport(
          year
        );

      setRows(data);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to load report"
      );

    } finally {

      setLoading(false);

    }
  };
  const handlePrint = () => {
  window.print();
};
  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">

          <h1 className="page-title">
            UTP Item Order Of The Year
          </h1>

          <p className="page-subtitle">
            Monthly board order analysis
          </p>

        </section>

        <section className="section-card space-y-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Year
              </label>

              <select
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              >

                {[2023,2024,2025,2026,2027]
                  .map((y) => (
                    <option
                      key={y}
                      value={y}
                    >
                      {y}
                    </option>
                ))}

              </select>

            </div>

            <div className="flex items-end">

              <button
                onClick={loadReport}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
              >
                {loading
                  ? "Loading..."
                  : "Load Report"}
              </button>

            </div>
   <button
  onClick={handlePrint}
  className="rounded-xl bg-green-700 px-4 py-2 text-white"
>
  Print
</button> 
          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-4 py-3">
                    ID
                  </th>

                  <th className="px-4 py-3">
                    Item Name
                  </th>

                  <th className="px-4 py-3">Jan</th>
                  <th className="px-4 py-3">Feb</th>
                  <th className="px-4 py-3">Mar</th>
                  <th className="px-4 py-3">Apr</th>
                  <th className="px-4 py-3">May</th>
                  <th className="px-4 py-3">Jun</th>

                  <th className="px-4 py-3">Jul</th>
                  <th className="px-4 py-3">Aug</th>
                  <th className="px-4 py-3">Sep</th>
                  <th className="px-4 py-3">Oct</th>
                  <th className="px-4 py-3">Nov</th>
                  <th className="px-4 py-3">Dec</th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (row, index) => (

                    <tr
                      key={index}
                      className="border-t border-slate-200"
                    >

                      <td className="px-4 py-3">
                        {row.boardId}
                      </td>

                      <td className="px-4 py-3">
                        {row['Item Name']}
                      </td>

                      <td>{row.Jan}</td>
                      <td>{row.Feb}</td>
                      <td>{row.Mar}</td>
                      <td>{row.Apr}</td>
                      <td>{row.May}</td>
                      <td>{row.Jun}</td>

                      <td>{row.Jul}</td>
                      <td>{row.Aug}</td>
                      <td>{row.Sep}</td>
                      <td>{row.Oct}</td>
                      <td>{row.Nov}</td>
                      <td>{row.Dec}</td>

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