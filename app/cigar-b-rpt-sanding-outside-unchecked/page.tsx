"use client";

export default function SandingOutsideUncheckedPage() {

  const emptyRows = Array.from(
    { length: 15 },
    (_, index) => index
  );

  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">
          <h1 className="page-title">
            Sanding Outside Unchecked
          </h1>

          <p className="page-subtitle">
            As at pending unchecked sanding jobs
          </p>
        </section>

        <section className="section-card space-y-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                As At Date
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

            <table className="min-w-[1400px] text-sm">

              <thead className="bg-yellow-100 text-slate-800">

                <tr>

                  <th className="border px-3 py-2 text-left">
                    SO No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Job No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Issue No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Iss. Date
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Item Code
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Part
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Bag No
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Issued Kg
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Issued Pcs
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Rec.Date
                  </th>

                  <th className="border px-3 py-2 text-right">
                    Rec.Kg
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Rec. By
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

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2"></td>

                  </tr>
                ))}

              </tbody>

              <tfoot className="bg-slate-50 font-semibold">

                <tr>

                  <td
                    colSpan={7}
                    className="border px-3 py-2 text-right"
                  >
                    Total
                  </td>

                  <td
                    colSpan={5}
                    className="border px-3 py-2"
                  ></td>

                </tr>

                <tr>

                  <td
                    colSpan={7}
                    className="border px-3 py-2 text-right"
                  >
                    Grand Total
                  </td>

                  <td
                    colSpan={5}
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