"use client";

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

          </div>

          <div className="overflow-auto">

            <table className="min-w-full text-sm">

              <thead>

                <tr>

                  <th>Name</th>

                  <th>Description</th>

                  <th>Top Width</th>

                  <th>Top Height</th>

                  <th>Long Width</th>

                  <th>Long Height</th>

                  <th>Short Width</th>

                  <th>Short Height</th>

                  <th>Print Available</th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (row, index) => (

                    <tr key={index}>

                      <td>{row.name}</td>

                      <td>{row.description}</td>

                      <td>{row.top_width}</td>

                      <td>{row.top_height}</td>

                      <td>{row.long_width}</td>

                      <td>{row.long_height}</td>

                      <td>{row.short_width}</td>

                      <td>{row.short_height}</td>

                      <td>{row.print_available}</td>

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