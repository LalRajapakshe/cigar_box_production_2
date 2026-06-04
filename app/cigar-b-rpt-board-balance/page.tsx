"use client";

import { useState } from "react";

import { boardBalanceReportService }
from "@/lib/services/boardBalanceReportService";

export default function BoardBalanceReportPage() {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [rows, setRows] =
    useState<any[]>([]);

  const loadReport = async () => {
    try {
      setLoading(true);

      const data =
        await boardBalanceReportService.getReport(
          fromDate,
          toDate
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

  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">
          <h1 className="page-title">
            Board Balance Report
          </h1>

          <p className="page-subtitle">
            Forecasted board usage and
            balance analysis
          </p>
        </section>

        <section className="section-card space-y-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={loadReport}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {loading
                  ? "Loading..."
                  : "Load Report"}
              </button>
            </div>

          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Board ID
                  </th>

                  <th className="px-4 py-3 text-left">
                    Board Name
                  </th>

                  <th className="px-4 py-3 text-right">
                    Forecast Qty
                  </th>

                  <th className="px-4 py-3 text-right">
                    Actual Balance
                  </th>

                  <th className="px-4 py-3 text-right">
                    Forecast Balance
                  </th>
                </tr>
              </thead>

              <tbody>

                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3">
                      {row.itemCode}
                    </td>

                    <td className="px-4 py-3">
                      {row.itemName}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.forecastQty}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.actualBalance}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {row.forecastBalance}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </div>
  );
}