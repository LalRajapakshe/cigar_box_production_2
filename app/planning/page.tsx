"use client";

import OrderPlanningComponent from "@/components/planning/OrderPlanningComponent";

export default function PlanningPage() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="page-hero">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="status-badge status-info mb-4">
                Planning Analysis
              </div>
              <h1 className="page-title">Planning</h1>
              <p className="page-subtitle">
                Review board usage, pieces, slats, and printable surface
                requirements for the selected order.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Output
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Board Requirement
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Output
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Slats & Pieces
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Output
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Surface Printing
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card">
          <OrderPlanningComponent />
        </section>
      </div>
    </div>
  );
}