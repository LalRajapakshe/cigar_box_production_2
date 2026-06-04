"use client";

export default function SandingOutsideReadyPaymentsPage() {

  const groups = [
    "Aruni",
    "Gamini",
    "Nilanthi",
  ];

  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">
          <h1 className="page-title">
            Sanding Outside Ready for Payments
          </h1>

          <p className="page-subtitle">
            As at payment-ready sanding jobs
          </p>
        </section>

        <section className="section-card space-y-8">

          {groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="overflow-auto rounded-2xl border border-slate-200"
            >

              <div className="bg-rose-100 px-4 py-3 text-lg font-semibold text-slate-800">
                Group Name : {group}
              </div>

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
                      Part
                    </th>

                    <th className="border px-3 py-2 text-left">
                      Bag No
                    </th>

                    <th className="border px-3 py-2 text-right">
                      Issued Pcs
                    </th>

                    <th className="border px-3 py-2 text-left">
                      Rec.Date
                    </th>

                    <th className="border px-3 py-2 text-right">
                      Received
                    </th>

                    <th className="border px-3 py-2 text-right">
                      Rejected
                    </th>

                    <th className="border px-3 py-2 text-left">
                      Rec. By
                    </th>

                    <th className="border px-3 py-2 text-right">
                      Good Pcs
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="h-10 border-t border-slate-200">

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2 text-right"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2 text-right"></td>

                  </tr>

                  <tr className="bg-slate-50 font-semibold">

                    <td
                      colSpan={6}
                      className="border px-3 py-2 text-right"
                    >
                      Category Total
                    </td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                  </tr>

                  <tr className="bg-slate-100 font-bold">

                    <td
                      colSpan={6}
                      className="border px-3 py-2 text-right"
                    >
                      Total
                    </td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                    <td className="border px-3 py-2"></td>

                  </tr>

                </tbody>

              </table>

            </div>
          ))}

        </section>

      </div>
    </div>
  );
}