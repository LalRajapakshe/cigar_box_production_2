"use client";

export default function SandingOutsidePendingJobStatusPage() {

  const emptyRows = Array.from(
    { length: 15 },
    (_, index) => index
  );

  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">
          <h1 className="page-title">
            Sanding Outside - Pending Job Status
          </h1>

          <p className="page-subtitle">
            Pending sanding job monitoring report
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
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                To Date
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
              >
                Load Report
              </button>
            </div>

          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200">

            <table className="min-w-[1600px] text-sm">

              <thead className="bg-yellow-100 text-slate-800">

                <tr>

                  <th className="border px-3 py-2 text-left">
                    Job No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Item Name
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Issue No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Issued Date
                  </th>

                  <th className="border px-3 py-2 text-left">
                    SO No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Bag No
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Top/Bot
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Bottom
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Long
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Small
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Middle
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Order Qty
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Received Date
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Good Pcs
                  </th>

                </tr>

              </thead>

              <tbody>

                {emptyRows.map((row) => (
                  <tr
                    key={row}
                    className="h-10 border-t border-slate-200"
                  >

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                  </tr>
                ))}

              </tbody>

              <tfoot className="bg-slate-50 font-semibold">

                <tr>
                  <td
                    colSpan={10}
                    className="border px-3 py-2 text-right"
                  >
                    Total Issued Qty
                  </td>

                  <td
                    colSpan={4}
                    className="border px-3 py-2"
                  ></td>
                </tr>

                <tr>
                  <td
                    colSpan={10}
                    className="border px-3 py-2 text-right"
                  >
                    Required Qty
                  </td>

                  <td
                    colSpan={4}
                    className="border px-3 py-2"
                  ></td>
                </tr>

                <tr>
                  <td
                    colSpan={10}
                    className="border px-3 py-2 text-right"
                  >
                    Shortage Qty
                  </td>

                  <td
                    colSpan={4}
                    className="border px-3 py-2"
                  ></td>
                </tr>

              </tfoot>

            </table>

          </div>

        </section>

      </div>
    </div>
  );
}