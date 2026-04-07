"use client";

import Link from "next/link";
import OrderInputForm from "@/components/orders/OrderInputForm";

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="page-hero">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="status-badge status-info mb-4">
                Client Demonstration Build
              </div>
              <h1 className="page-title">Cigar Box Production Dashboard</h1>
              <p className="page-subtitle">
                Configure master recipes, prepare orders, and review planning
                calculations for board usage, slats, pieces, and printable
                surfaces.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/master-settings" className="primary-btn">
                Open Master Settings
              </Link>
              <Link href="/orders" className="secondary-btn">
                View Orders
              </Link>
              <Link href="/planning" className="secondary-btn">
                Open Planning
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="kpi-card">
            <div className="text-sm text-slate-500">Module</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              Master Settings
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Define boards, materials, and box type recipes with inline sheets
              and surfaces.
            </p>
          </div>

          <div className="kpi-card">
            <div className="text-sm text-slate-500">Module</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              Orders
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create production orders by selecting a predefined box type and
              required quantity.
            </p>
          </div>

          <div className="kpi-card">
            <div className="text-sm text-slate-500">Module</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              Planning
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Calculate boards, pieces, slats, and printable surfaces for the
              selected order.
            </p>
          </div>
        </section>

        <section className="section-card">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Quick Order Entry
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Use this section to demonstrate how a production order is created
                from an existing box recipe.
              </p>
            </div>
            <div className="status-badge status-neutral">
              Demo Workflow Entry Point
            </div>
          </div>

          <OrderInputForm />
        </section>
      </div>
    </div>
  );
}