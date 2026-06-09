"use client";

interface Props {
  report: any;
}

export default function SlatCuttingPrintReport({
  report,
}: Props) {
  if (!report) return null;

  return (
    <div
      id="printArea"
      className="mx-auto bg-white p-6 text-sm"
      style={{
        width: "210mm",
        minHeight: "297mm",
      }}
    >
      {/* Header */}
      <div className="mb-4 border-b pb-3 text-center">
        <div className="text-xl font-bold">
          CIGAR BOX PRODUCTION SYSTEM
        </div>

        <div className="text-sm">
          SLAT CUTTING REPORT
        </div>
      </div>

      {/* Header Details */}
      <div className="mb-4 grid grid-cols-2 gap-2 border p-3">
        <div>
          <strong>Sales Order :</strong>{" "}
          {report.header?.salesOrderNo}
        </div>

        <div>
          <strong>Job No :</strong>{" "}
          {report.header?.jobNo}
        </div>

        <div>
          <strong>Customer PO :</strong>{" "}
          {report.header?.customerPO}
        </div>

        <div>
          <strong>Item :</strong>{" "}
          {report.header?.item}
        </div>

        <div>
          <strong>Board :</strong>{" "}
          {report.header?.board}
        </div>

        <div>
          <strong>Size :</strong>{" "}
          {report.header?.size}
        </div>

        <div>
          <strong>Qty :</strong>{" "}
          {report.header?.qty}
        </div>

        <div>
          <strong>Delivery :</strong>{" "}
          {report.header?.deliveryBy}
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-4 border p-3">
        <div className="mb-2 font-bold">
          STOCK STATUS
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-1">
                Part
              </th>

              <th className="border p-1">
                Printing Required
              </th>
            </tr>
          </thead>

          <tbody>
            {report.stockStatus?.map(
              (row: any, index: number) => (
                <tr key={index}>
                  <td className="border p-1">
                    {row.sheetKey}
                  </td>

                  <td className="border p-1">
                    {row.requiresPrinting
                      ? "Printed"
                      : "Unprinted"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Shape Row */}
      <div className="mb-4 flex justify-between gap-3">
        {report.slatDetails?.map(
          (part: any) => (
            <div
              key={part.sheetKey}
              className="flex-1"
            >
              <div
                className="mx-auto flex items-center justify-center border text-center"
                style={{
                  height: "80px",
                }}
              >
                <div>
                  <div className="font-bold">
                    {part.sheetKey}
                  </div>

                  <div>
                    {part.height} x {part.width}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Details Matrix */}
      <div className="mb-4">
        <table className="w-full border">
          <tbody>
            <tr>
              <td className="border p-2 font-bold">
                Slats / Board
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.slatsPerBoard}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-2 font-bold">
                Pcs / Slat
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.piecesPerSlat}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-2 font-bold">
                Boards
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.totalBoardsRequired}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-2 font-bold">
                Slats
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.totalSlatsRequired}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-2 font-bold">
                Extra Size
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.remainingBoardHeight}
                    x
                    {part.remainingBoardWidth}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-2 font-bold">
                Duration
              </td>

              {report.slatDetails?.map(
                (part: any) => (
                  <td
                    key={part.sheetKey}
                    className="border text-center"
                  >
                    {part.totalProductionTimeMinutes}
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Board Summary */}
      <div className="mb-4 border p-3">
        <div>
          <strong>Forecast Boards :</strong>{" "}
          {report.forecastBoards}
        </div>

        <div>
          <strong>Actual Boards :</strong>
        </div>

        <div>
          <strong>Total Boards :</strong>
        </div>
      </div>

      {/* Poly Requirement */}
      <div className="border p-3">
        <div className="mb-2 font-bold">
          POLYTHENE REQUIREMENT
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-1">
                Part
              </th>

              <th className="border p-1">
                Bag Size
              </th>

              <th className="border p-1">
                Qty (Kg)
              </th>
            </tr>
          </thead>

          <tbody>
            {report.polyDetails?.map(
              (row: any, index: number) => (
                <tr key={index}>
                  <td className="border p-1">
                    {row.sheetKey}
                  </td>

                  <td className="border p-1">
                    {row.polyBagWidthMm} x{" "}
                    {row.polyBagHeightMm}
                  </td>

                  <td className="border p-1">
                    {row.totalPolyethyleneRequirementKg}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}