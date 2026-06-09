"use client";

import { useState } from "react";

import {
  monthlyJobDataReportService,
} from "@/lib/services/monthlyJobDataReportService";

export default function MonthlyJobDataPage() {

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
        await monthlyJobDataReportService.getReport(
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
  const handlePrint = () => {
  window.print();
};
  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">

          <h1 className="page-title">
            Monthly Job Data
          </h1>

          <p className="page-subtitle">
            Monthly job profitability analysis
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
                  setFromDate(
                    e.target.value
                  )
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
                  setToDate(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />

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

                  <th className="px-4 py-3 text-left">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left">
                    Sales Order No
                  </th>

                  <th className="px-4 py-3 text-left">
                    Job No
                  </th>

                  <th className="px-4 py-3 text-left">
                    Item Code
                  </th>

                  <th className="px-4 py-3 text-right">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-right">
                    Cost
                  </th>

                  <th className="px-4 py-3 text-right">
                    Profit
                  </th>

                  <th className="px-4 py-3 text-right">
                    Pro %
                  </th>

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
                        {new Date(
                          row.jobDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        {row.salesOrderNo}
                      </td>

                      <td className="px-4 py-3">
                        {row.jobNo}
                      </td>

                      <td className="px-4 py-3">
                        {row.itemCode}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {row.quantity}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {row.amount}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {row.cost}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {row.profit}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {row.profitPercentage}
                      </td>

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