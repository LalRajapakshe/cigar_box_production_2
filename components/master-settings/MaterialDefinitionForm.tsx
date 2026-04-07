"use client";

import { useEffect, useState } from "react";
import { materialService } from "@/lib/services/materialService";
import type {
  MaterialDefinition,
  MaterialDefinitionInput,
} from "@/lib/types/master-data";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const initialForm: MaterialDefinitionInput = {
  name: "",
  description: "",
  cost: 0,
};

export default function MaterialDefinitionForm() {
  const [materials, setMaterials] = useState<MaterialDefinition[]>([]);
  const [form, setForm] = useState<MaterialDefinitionInput>(initialForm);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    setLoading(true);
    const data = await materialService.getAll();
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadMaterials();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      return;
    }

    await materialService.create({
      ...form,
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
    });

    setForm(initialForm);
    await loadMaterials();
  };

  const handleDelete = async (id: string) => {
    await materialService.remove(id);
    await loadMaterials();
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="status-badge status-info mb-3">
                Material Setup
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Material Definitions
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Define the material options that can be linked to boards or used
                as order-level overrides during the demonstration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Existing Materials
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {materials.length}
                </div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Current Cost
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {form.cost ?? 0}
                </div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Draft Name
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {form.name.trim() || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Material Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the material name, optional description, and reference
                  cost for display purposes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Material Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={inputClassName}
                    placeholder="e.g. Premium Coated Board"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Display name used in board links and order overrides.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={inputClassName}
                    placeholder="Optional description"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Brief explanation or client-friendly material notes.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={form.cost ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        cost: parseNumber(e.target.value),
                      }))
                    }
                    className={inputClassName}
                    placeholder="0"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Optional reference cost for reporting or demo visibility.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreate}
                className="primary-btn"
              >
                Save Material
              </button>

              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="secondary-btn"
              >
                Reset Form
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Live Summary
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Quick overview of the material currently being configured.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Material Name
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.name.trim() || "Not set"}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Description
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.description?.trim() || "Not provided"}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Cost
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.cost ?? 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Demonstration Guidance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Use material names familiar to the client.</li>
                <li>• Add short descriptions to make the demo clearer.</li>
                <li>• Use cost only if it supports the presentation story.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Existing Materials
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review the material options available for board association and
              order-level overrides.
            </p>
          </div>

          <div className="status-badge status-neutral">
            Total Materials: {materials.length}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading materials...</p>
        ) : materials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-sm font-medium text-slate-700">
              No materials created yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a material above to enrich board and order configuration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {materials.map((material) => (
              <div
                key={material.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {material.name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {material.description || "No description"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(material.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Description
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      {material.description || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Cost
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      {material.cost ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
