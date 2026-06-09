"use client";

import { useState } from "react";

import {
  productionPendingOrdersReportService,
} from "@/lib/services/productionPendingOrdersReportService";

export default function ProductionPendingOrdersPage() {

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadReport = async () => {

    try {

      setLoading(true);

      const data =
        await productionPendingOrdersReportService.getReport();

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
            Production Pending Orders
          </h1>

          <p className="page-subtitle">
            Production orders waiting to be completed
          </p>

        </section>

        <section className="section-card space-y-6">

          <div className="flex justify-end">

            <button
              onClick={loadReport}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
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
          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-100">

                <tr>

                  <th>SO No</th>

                  <th>Job No</th>

                  <th>Customer PO</th>

                  <th>Date</th>

                  <th>Item Code</th>

                  <th>Amount</th>

                  <th>Remaining Qty</th>

                  <th>A-Board</th>

                  <th>B-Board</th>

                  <th>C-Board</th>

                  <th>Delivery Date</th>

                  <th>Cost Entered</th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (row, index) => (

                    <tr
                      key={index}
                      className="border-t border-slate-200"
                    >

                      <td>{row.soNo}</td>

                      <td>{row.jobNo}</td>

                      <td>{row.customerPo}</td>

                      <td>
                        {new Date(
                          row.orderDate
                        ).toLocaleDateString()}
                      </td>

                      <td>{row.itemCode}</td>

                      <td>{row.amount}</td>

                      <td>{row.remainingQty}</td>

                      <td>{row.aBoard}</td>

                      <td>{row.bBoard}</td>

                      <td>{row.cBoard}</td>

                      <td>
                        {new Date(
                          row.deliveryDate
                        ).toLocaleDateString()}
                      </td>

                      <td>{row.costEntered}</td>

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