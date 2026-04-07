"use client";

import { useState } from "react";
import BoardDefinitionForm from "@/components/master-settings/BoardDefinitionForm";
import MaterialDefinitionForm from "@/components/master-settings/MaterialDefinitionForm";
import BoxTypeForm from "@/components/master-settings/BoxTypeForm";
import type { MasterSettingsTab } from "@/lib/types/master-data";

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState<MasterSettingsTab>("boxTypes");

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="page-hero">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="status-badge status-info mb-4">
                Recipe Configuration
              </div>
              <h1 className="page-title">Master Settings</h1>
              <p className="page-subtitle">
                Maintain raw board definitions, material definitions, and box type
                recipes that drive order creation and planning.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Section
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Boards
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Section
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Materials
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Section
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Box Types
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("boards")}
              className={
                activeTab === "boards" ? "primary-btn" : "secondary-btn"
              }
            >
              Boards
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("materials")}
              className={
                activeTab === "materials" ? "primary-btn" : "secondary-btn"
              }
            >
              Materials
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("boxTypes")}
              className={
                activeTab === "boxTypes" ? "primary-btn" : "secondary-btn"
              }
            >
              Box Types
            </button>
          </div>

          <div>
            {activeTab === "boards" && <BoardDefinitionForm />}
            {activeTab === "materials" && <MaterialDefinitionForm />}
            {activeTab === "boxTypes" && <BoxTypeForm />}
          </div>
        </section>
      </div>
    </div>
  );
}