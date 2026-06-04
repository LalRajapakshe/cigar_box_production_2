"use client";

import { useState } from "react";

import {
  boardForecastSummaryReportService,
} from "@/lib/services/boardForecastSummaryReportService";

export default function BoardForecastSummaryPage() {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);

      const data =
        await boardForecastSummaryReportService.getReport(
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
            Board Forecast Summary
          </h1>

          <p className="page-subtitle">
            Pending job board forecast details
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
                    Job Number
                  </th>

                  <th className="px-4 py-3 text-left">
                    Order No
                  </th>

                  <th className="px-4 py-3 text-left">
                    Delivery Date
                  </th>

                  <th className="px-4 py-3 text-left">
                    Item Name
                  </th>

                  <th className="px-4 py-3 text-right">
                    Remain Qty
                  </th>

                  <th className="px-4 py-3 text-left">
                    Board Type
                  </th>

                  <th className="px-4 py-3 text-right">
                    Required Board Qty
                  </th>

                  <th className="px-4 py-3 text-right">
                    Slat(Top)
                  </th>

                  <th className="px-4 py-3 text-right">
                    Slat(Bottom)
                  </th>

                  <th className="px-4 py-3 text-right">
                    Slat(Long)
                  </th>

                  <th className="px-4 py-3 text-right">
                    Slat(Small)
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
                      {row.planningNo}
                    </td>

                    <td className="px-4 py-3">
                      {row.orderNo}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(
                        row.orderDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      {row.itemName}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.remainQty}
                    </td>

                    <td className="px-4 py-3">
                      {row.boardType}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.requiredBoardQty}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.slatTop}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.slatBottom}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.slatLong}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.slatSmall}
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