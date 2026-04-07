"use client";

import OrderInputForm from "@/components/orders/OrderInputForm";

export default function OrdersPage() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="page-hero">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="status-badge status-info mb-4">
                Order Preparation
              </div>
              <h1 className="page-title">Orders</h1>
              <p className="page-subtitle">
                Create polished production tickets, review their current status,
                and prepare the next job for planning and material calculation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Workflow
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Create
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Workflow
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Review
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Workflow
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Prepare for Planning
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card">
          <OrderInputForm />
        </section>
      </div>
    </div>
  );
}
