"use client";

import type { OrderPlanningResult } from "@/lib/types/planning";

interface Props {
  result: OrderPlanningResult;
}

function SectionCard({ part }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold text-slate-800">
          {part.partLabel}
        </div>
<div className="flex items-center justify-between"></div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-200">
            Orientation: {part.orientation}
          </span>
          <span className="px-2 py-1 rounded bg-slate-200">
            Qty/Box: {part.quantityPerBox}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Info label="Piece Size">
          {part.pieceWidth} × {part.pieceHeight} mm
        </Info>

        <Info label="Cut Size">
          {part.cuttingWidth} × {part.cuttingHeight} mm
        </Info>

        <Info label="Pieces / Slat">{part.piecesPerSlat}</Info>
        <Info label="Slats / Board">{part.slatsPerBoard}</Info>

        <Info label="Pieces / Board">
            <span className="text-green-600 font-bold text-lg">
               {part.piecesPerBoard}
            </span>
        </Info>
        <Info label="Total Pieces">{part.totalPiecesRequired}</Info>
  
       <Info label="Total Slats">
           <span className="text-purple-600 font-bold text-lg">
               {part.totalSlatsRequired}
          </span>
        </Info>
        <Info label="Total Boards">
            <span className="text-blue-600 font-bold text-lg">
               {part.totalBoardsRequired}
            </span>
        </Info>

        <Info label="Remain Width">
          <span className="text-orange-600 font-semibold">
              {part.remainingBoardWidth} mm
          </span>
      </Info>
        <Info label="Remain Height">
  <span className="text-orange-600 font-semibold">
    {part.remainingBoardHeight} mm
  </span>
</Info>

    <Info label="Prod Time / Piece">
  <span className="text-indigo-600">
    {part.productionTimeMinutesPerPiece} min
  </span>
</Info>

        <Info label="Total Prod Time">
          {part.totalProductionTimeMinutes} min
        </Info>
      </div>
    </div>
  );
}

function Info({ label, children }: any) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-800 mt-1">
        {children}
      </div>
    </div>
  );
}

function SummaryCard({ result }: { result: OrderPlanningResult }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-900 text-white p-5">
      <div className="text-lg font-semibold mb-4">
        Production Summary
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <InfoDark label="Total Parts">
          {result.summary.totalParts}
        </InfoDark>

        <InfoDark label="Total Pieces">
          {result.summary.totalPiecesRequired}
        </InfoDark>

        <InfoDark label="Total Slats">
          {result.summary.totalSlatsRequired}
        </InfoDark>

        <InfoDark label="Total Boards">
          {result.summary.totalBoardsRequired}
        </InfoDark>

        <InfoDark label="Printable Surfaces">
          {result.summary.totalPrintableSurfaceCount}
        </InfoDark>

        <InfoDark label="Total Production Time">
          {result.summary.totalProductionTimeMinutes} min
        </InfoDark>
      </div>
    </div>
  );
}

function InfoDark({ label, children }: any) {
  return (
    <div className="rounded-xl border border-white/20 p-4 text-center">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-2xl font-bold mt-2">
        {children}
      </div>
    </div>
  );
}

export default function OrderPlanningComponent({ result }: Props) {
  if (!result) {
    return (
      <div className="text-sm text-slate-500">
        No planning data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-xl font-semibold text-slate-800">
      Production Planner
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      {result.boxTypeName} · Board: {result.boardDefinitionName}
    </p>
  </div>

  <button
    onClick={() => window.print()}
    className="print:hidden rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-700"
  >
    Print Report
  </button>
</div>

      {/* Summary */}
      <SummaryCard result={result} />

      {/* Parts */}
      <div className="space-y-4">
        {result.parts.map((part) => (
          <SectionCard key={part.sheetKey} part={part} />
        ))}
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-semibold mb-2">Warnings</div>
          <ul className="list-disc ml-5 space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}