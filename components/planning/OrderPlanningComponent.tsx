"use client";

import type { OrderPlanningResult } from "@/lib/types/planning";
import PlanningPrintReport from "./PlanningPrintReport";

interface Props {
  result: OrderPlanningResult;
}

function SectionCard({ part }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="text-lg font-semibold text-slate-800">
          {part.partLabel}
        </div>

        <div className="flex gap-2 text-xs">
          <span className="rounded bg-slate-200 px-2 py-1">
            Orientation: {part.orientation}
          </span>
          <span className="rounded bg-slate-200 px-2 py-1">
            Qty/Box: {part.quantityPerBox}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5 text-sm md:grid-cols-4">
        <Info label="Piece Size">
          {part.pieceWidth} × {part.pieceHeight} mm
        </Info>

        <Info label="Cut Size">
          {part.cuttingWidth} × {part.cuttingHeight} mm
        </Info>

        <Info label="Pieces / Slat">
          <span className="font-semibold text-slate-800">
            {part.piecesPerSlat}
          </span>
        </Info>

        <Info label="Slats / Board">
          <span className="font-semibold text-slate-800">
            {part.slatsPerBoard}
          </span>
        </Info>

        <Info label="Pieces / Board">
          <span className="text-lg font-bold text-green-600">
            {part.piecesPerBoard}
          </span>
        </Info>

        <Info label="Total Pieces">
          <span className="font-semibold text-slate-800">
            {part.totalPiecesRequired}
          </span>
        </Info>

        <Info label="Total Slats">
          <span className="text-lg font-bold text-purple-600">
            {part.totalSlatsRequired}
          </span>
        </Info>

        <Info label="Total Boards">
          <span
            className={`text-lg font-bold ${
              part.totalBoardsRequired > 50 ? "text-red-600" : "text-blue-600"
            }`}
          >
            {part.totalBoardsRequired}
          </span>
        </Info>

        <Info label="Remain Width">
          <span className="font-semibold text-orange-600">
            {part.remainingBoardWidth} mm
          </span>
        </Info>

        <Info label="Remain Height">
          <span className="font-semibold text-orange-600">
            {part.remainingBoardHeight} mm
          </span>
        </Info>

        <Info label="Prod Time / Piece">
          <span className="text-indigo-600">
            {part.productionTimeMinutesPerPiece} min
          </span>
        </Info>

        <Info label="Total Prod Time">
          <span className="font-semibold text-indigo-700">
            {part.totalProductionTimeMinutes} min
          </span>
        </Info>

        <Info label="Poly Bag Size">
          {part.polyBagWidthMm} × {part.polyBagHeightMm} mm
        </Info>

        <Info label="Poly Weight / 1000">
              <span className="font-semibold text-slate-800">
              {part.polyethyleneWeightPer1000} Kg
               </span>
        </Info>

        <Info label="Poly Requirement">
              <span className="text-lg font-bold text-emerald-600">
               {part.totalPolyethyleneRequirementKg.toFixed(2)} Kg
              </span>
         </Info>                
        
      </div>
    </div>
  );
}

function Info({ label, children }: any) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">
        {children}
      </div>
    </div>
  );
}

function SummaryCard({ result }: { result: OrderPlanningResult }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-900 p-5 text-white">
      <div className="mb-4 text-lg font-semibold">Production Summary</div>

      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <InfoDark label="Order Qty">{result.originalOrderQuantity}</InfoDark>

        <InfoDark label="Planned Qty (+1%)">
          {result.plannedProductionQuantity}
        </InfoDark>

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
          {(result.summary.totalProductionTimeMinutes / 60).toFixed(2)} hrs
        </InfoDark>
      </div>
    </div>
  );
}

function InfoDark({ label, children }: any) {
  return (
    <div className="rounded-xl border border-white/20 p-4 text-center">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-2 text-2xl font-bold">{children}</div>
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
      <div className="border-b border-slate-300 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Cigar Box Production System</div>
            <div className="text-sm text-slate-500">
              Production Planning Report
            </div>
          </div>

          <div className="text-right text-sm text-slate-600 print:hidden">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Order ID: {result.orderId}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Production Planner
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {result.boxTypeName} · Board: {result.boardDefinitionName}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
              Order Qty: {result.originalOrderQuantity}
            </span>
            <span className="rounded bg-amber-100 px-2 py-1 font-medium text-amber-800">
              Planned Qty (+1%): {result.plannedProductionQuantity}
            </span>
          </div>
        </div>

<div className="grid gap-2 text-sm text-slate-600">
   <div>
    <span className="font-semibold">Order No:</span>{" "}
    {result.orderNo}
  </div>
    <div>
    <span className="font-semibold">Planning No:</span>{" "}
    {result.planningNo}
  </div>
</div>

        <button
          onClick={() => window.print()}
          className="print:hidden rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          Print Report
        </button>
      </div>

      <SummaryCard result={result} />

      <div className="space-y-4">
        {result.parts.map((part) => (
          <SectionCard key={part.sheetKey} part={part} />
        ))}
      </div>

      {result.warnings.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 print:hidden">
          <div className="mb-2 font-semibold">Warnings</div>
          <ul className="ml-5 list-disc space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}

      <PlanningPrintReport result={result} />
    </div>
  );
}