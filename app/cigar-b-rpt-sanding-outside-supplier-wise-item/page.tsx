
"use client";
import * as XLSX from "xlsx";
import { useMemo, useState } from "react";
import { API_BASE } from "@/lib/apiBase";

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [asAtDate, setAsAtDate] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/cigar-b-rpt-sanding-outside-supplier-wise-item?asAtDate=${asAtDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to load report");
      }

      const data = await response.json();

      setRows(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const groupedRows = useMemo(() => {
    return rows.reduce((acc: Record<string, any[]>, row) => {
      if (!acc[row.sandingSupplier]) {
        acc[row.sandingSupplier] = [];
      }

      acc[row.sandingSupplier].push(row);

      return acc;
    }, {});
  }, [rows]);

  const grandTotalQty = rows.reduce(
    (sum, row) => sum + Number(row.quantity || 0),
    0
  );
const handlePrint = () => {
  window.print();
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
  return (
    <div className="p-4">

      <h1 className="mb-4 text-2xl font-bold">
        Sanding Outside Job Wise Item
      </h1>

      <div className="mb-4 flex items-center gap-2">

        <label>As At Date :</label>

        <input
          type="date"
          value={asAtDate}
          onChange={(e) => setAsAtDate(e.target.value)}
          className="rounded border px-2 py-1"
        />

        <button
          onClick={loadReport}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? "Loading..." : "Load Report"}
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

      {Object.entries(groupedRows).map(
        ([sandingSupplier, jobRows]) => {

          const totalTp =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.tp || 0),
              0
            );

          const totalBottom =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.bottom || 0),
              0
            );

          const totalLong =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.long || 0),
              0
            );

          const totalSmall =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.small || 0),
              0
            );

          const totalMiddle =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.middle || 0),
              0
            );

          const totalQty =
            (jobRows as any[]).reduce(
              (sum, row) =>
                sum + Number(row.quantity || 0),
              0
            );

          return (
            <div
              key={sandingSupplier}
              className="mb-8"
            >
              <h3 className="mb-2 text-lg font-bold">
                Sanding Supplier : {sandingSupplier}
              </h3>

              <table className="w-full border-collapse border text-sm">

                <thead>

                  <tr className="bg-slate-100">

                    <th className="border px-2 py-1">
                      Issue No
                    </th>

                    <th className="border px-2 py-1">
                      Issue Date
                    </th>

                    <th className="border px-2 py-1">
                      Sales Order No
                    </th>

                    <th className="border px-2 py-1">
                      Item Name
                    </th>

                    <th className="border px-2 py-1">
                      Sanding Supplier
                    </th>

                    <th className="border px-2 py-1">
                      Bag No
                    </th>

                    <th className="border px-2 py-1 text-right">
                      T/P
                    </th>

                    <th className="border px-2 py-1 text-right">
                      Bottom
                    </th>

                    <th className="border px-2 py-1 text-right">
                      Long
                    </th>

                    <th className="border px-2 py-1 text-right">
                      Small
                    </th>

                    <th className="border px-2 py-1 text-right">
                      Middle
                    </th>

                    <th className="border px-2 py-1 text-right">
                      Quantity
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {(jobRows as any[]).map(
                    (row, index) => (
                      <tr key={index}>

                        <td className="border px-2 py-1">
                          {row.issueNo}
                        </td>

                        <td className="border px-2 py-1">
                          {row.issueDate}
                        </td>

                        <td className="border px-2 py-1">
                          {row.salesOrderNo}
                        </td>

                        <td className="border px-2 py-1">
                          {row.itemName}
                        </td>

                        <td className="border px-2 py-1">
                          {row.sandingSupplier}
                        </td>

                        <td className="border px-2 py-1">
                          {row.bagNo}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.tp || 0
                          ).toLocaleString()}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.bottom || 0
                          ).toLocaleString()}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.long || 0
                          ).toLocaleString()}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.small || 0
                          ).toLocaleString()}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.middle || 0
                          ).toLocaleString()}
                        </td>

                        <td className="border px-2 py-1 text-right">
                          {Number(
                            row.quantity || 0
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )}

                  <tr className="bg-slate-100 font-bold">

                    <td
                      colSpan={5}
                      className="border px-2 py-1"
                    >
                      Job Total
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalTp.toLocaleString()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalBottom.toLocaleString()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalLong.toLocaleString()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalSmall.toLocaleString()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalMiddle.toLocaleString()}
                    </td>

                    <td className="border px-2 py-1 text-right">
                      {totalQty.toLocaleString()}
                    </td>

                  </tr>

                </tbody>

              </table>
            </div>
          );
        }
      )}

      <div className="mt-6 text-right text-lg font-bold">
        Grand Total Quantity :{" "}
        {grandTotalQty.toLocaleString()}
      </div>

    </div>
  );
}
