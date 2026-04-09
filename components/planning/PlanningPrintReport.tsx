"use client";

import type {
  OrderPlanningResult,
  PlanningPartResult,
} from "@/lib/types/planning";

interface Props {
  result: OrderPlanningResult;
}

function formatPartTitle(part: PlanningPartResult): string {
  switch (part.partLabel) {
    case "T/B":
      return "T/B";
    case "Long":
      return "Long";
    case "Small":
      return "Small";
    case "Bottom":
      return "Bottom";
    case "Middle":
      return "Middle";
    case "Top":
      return "Top";
    default:
      return part.partLabel;
  }
}

function RectangleDiagram({ part }: { part: PlanningPartResult }) {
  const maxW = 180;
  const maxH = 100;

  const ratio = Math.min(
    maxW / Math.max(part.pieceWidth, 1),
    maxH / Math.max(part.pieceHeight, 1)
  );

  const width = Math.max(48, Math.round(part.pieceWidth * ratio));
  const height = Math.max(34, Math.round(part.pieceHeight * ratio));

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-[11px] font-medium text-slate-700">
        {part.pieceHeight} mm
      </div>

      <div className="flex items-center gap-3">
        <div className="text-[11px] font-medium text-slate-700 [writing-mode:vertical-rl] rotate-180">
          H
        </div>

        <div
          className="relative border-2 border-slate-700 bg-white"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700">
            {formatPartTitle(part)}
          </div>
        </div>
      </div>

      <div className="text-[11px] font-medium text-slate-700">
        {part.pieceWidth} mm
      </div>

      <div className="mt-1 rounded border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700">
        {part.orientation === "rotated" ? "Rotated" : "Normal"}
      </div>
    </div>
  );
}

function ReportRow({ part }: { part: PlanningPartResult }) {
  return (
    <tr className="border-b border-slate-300">
      <td className="p-2 align-top text-center font-semibold">
        {formatPartTitle(part)}
      </td>
      <td className="p-2 align-top text-center">
        <RectangleDiagram part={part} />
      </td>
      <td className="p-2 align-top text-center">{part.slatsPerBoard}</td>
      <td className="p-2 align-top text-center">{part.piecesPerSlat}</td>
      <td className="p-2 align-top text-center">{part.totalSlatsRequired}</td>
      <td className="p-2 align-top text-center">{part.totalBoardsRequired}</td>
      <td className="p-2 align-top text-center">
        {part.remainingBoardWidth} × {part.remainingBoardHeight}
      </td>
      <td className="p-2 align-top text-center">
        {part.totalProductionTimeMinutes}
      </td>
    </tr>
  );
}

export default function PlanningPrintReport({ result }: Props) {
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="hidden print:block print:text-black">
      <div className="mx-auto w-full max-w-[1180px] bg-white text-[12px]">
        <div className="border-2 border-slate-800">
          <div className="border-b-2 border-slate-800 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[18px] font-bold uppercase tracking-wide">
                  Cigar Box Production System
                </div>
                <div className="text-[13px] font-semibold">
                  Production Planning Report
                </div>
              </div>

              <div className="text-right text-[12px]">
                <div>
                  <span className="font-semibold">Date:</span> {today}
                </div>
                <div>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {result.orderId}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b-2 border-slate-800">
            <div className="border-r border-slate-400 p-3">
              <div>
                <span className="font-semibold">Box Type:</span>{" "}
                {result.boxTypeName}
              </div>
              <div>
                <span className="font-semibold">Board:</span>{" "}
                {result.boardDefinitionName}
              </div>
            </div>

            <div className="p-3">
              <div>
                <span className="font-semibold">Total Boards:</span>{" "}
                {result.summary.totalBoardsRequired}
              </div>
              <div>
                <span className="font-semibold">Total Production Time:</span>{" "}
                {result.summary.totalProductionTimeMinutes} min
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 bg-slate-100 text-[11px] uppercase">
                <th className="border-r border-slate-300 p-2">Part</th>
                <th className="border-r border-slate-300 p-2">Shape</th>
                <th className="border-r border-slate-300 p-2">Slats / Board</th>
                <th className="border-r border-slate-300 p-2">Pcs / Slat</th>
                <th className="border-r border-slate-300 p-2">Total Slats</th>
                <th className="border-r border-slate-300 p-2">Boards</th>
                <th className="border-r border-slate-300 p-2">Remain W × H</th>
                <th className="p-2">Total Min</th>
              </tr>
            </thead>

            <tbody>
              {result.parts.map((part) => (
                <ReportRow key={part.sheetKey} part={part} />
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-4 border-t-2 border-slate-800">
            <div className="border-r border-slate-300 p-3">
              <div className="text-[11px] uppercase text-slate-600">
                Total Parts
              </div>
              <div className="text-[15px] font-bold">
                {result.summary.totalParts}
              </div>
            </div>

            <div className="border-r border-slate-300 p-3">
              <div className="text-[11px] uppercase text-slate-600">
                Total Pieces
              </div>
              <div className="text-[15px] font-bold">
                {result.summary.totalPiecesRequired}
              </div>
            </div>

            <div className="border-r border-slate-300 p-3">
              <div className="text-[11px] uppercase text-slate-600">
                Total Slats
              </div>
              <div className="text-[15px] font-bold">
                {result.summary.totalSlatsRequired}
              </div>
            </div>

            <div className="p-3">
              <div className="text-[11px] uppercase text-slate-600">
                Total Boards
              </div>
              <div className="text-[15px] font-bold">
                {result.summary.totalBoardsRequired}
              </div>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="border-t border-slate-300 p-3">
              <div className="mb-1 font-semibold">Warnings</div>
              <ul className="list-disc pl-5">
                {result.warnings.map((warning, index) => (
                  <li key={index}>{warning.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}