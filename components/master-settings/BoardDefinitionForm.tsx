"use client";

import { useEffect, useState } from "react";
import { boardService } from "@/lib/services/boardService";
import { materialService } from "@/lib/services/materialService";
import type {
  BoardDefinition,
  BoardDefinitionInput,
  MaterialDefinition,
} from "@/lib/types/master-data";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const initialForm: BoardDefinitionInput = {
  name: "",
  width: 0,
  height: 0,
  materialId: "",
  boardType: "",
};

export default function BoardDefinitionForm() {
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [materials, setMaterials] = useState<MaterialDefinition[]>([]);
  const [form, setForm] = useState<BoardDefinitionInput>(initialForm);
  const [loading, setLoading] = useState(true);
  const [savingBoard, setSavingBoard] = useState(false);  

  const [boardType, setBoardType] = useState("");

  const loadData = async () => {
    setLoading(true);

    const [boardData, materialData] = await Promise.all([
      boardService.getAll(),
      materialService.getAll(),
    ]);

    setBoards(boardData);
    setMaterials(materialData);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || form.width <= 0 || form.height <= 0) {
      return;
    }
try {
    setSavingBoard(true);
    await boardService.create({
      ...form,
      boardType: form.boardType?.trim(),
      materialId: form.materialId?.trim() || undefined,
    });
    setForm(initialForm);
    await loadData();
} finally {
    setSavingBoard(false);
  }
  };

  const handleDelete = async (id: string) => {
    await boardService.remove(id);
    await loadData();
  };

  const selectedMaterial = materials.find(
    (material) => material.id === form.materialId
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="status-badge status-info mb-3">
                Raw Board Setup
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Board Definitions
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Define the raw board sizes used for production planning and link
                them to optional material definitions for demonstration purposes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Existing Boards
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {boards.length}
                </div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Materials Available
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {materials.length}
                </div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Selected Material
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedMaterial?.name ?? "Not selected"}
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
                  Board Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the board name, dimensions, and optional linked material.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Board Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={inputClassName}
                    placeholder="e.g. Standard Board"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Display name used in recipe selection and planning.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Board Type
                  </label>
                  <input
                    type="text"
                    value={form.boardType}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, BoardType: e.target.value }))
                    }
                    className={inputClassName}
                    placeholder="e.g. Standard Board"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Display name used in recipe selection and planning.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Width
                  </label>
                  <input
                    type="number"
                    value={form.width}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        width: parseNumber(e.target.value),
                      }))
                    }
                    className={inputClassName}
                    placeholder="Width"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Raw board width used in cutting calculations.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Height
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        height: parseNumber(e.target.value),
                      }))
                    }
                    className={inputClassName}
                    placeholder="Height"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Raw board height used in cutting calculations.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Material
                  </label>
                  <select
                    value={form.materialId ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        materialId: e.target.value,
                      }))
                    }
                    className={inputClassName}
                  >
                    <option value="">Select material</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Optional material reference for reporting and demo clarity.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreate}
                 disabled={savingBoard}
                //className="primary-btn"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
              >
               {savingBoard ? "Saving..." : "Save Board"}
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
                  Quick overview of the board currently being configured.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Board Name
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.name.trim() || "Not set"}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Dimensions
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.width || 0} x {form.height || 0}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Material Link
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {selectedMaterial?.name ?? "No material selected"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Demonstration Guidance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Use realistic board names for the demo.</li>
                <li>• Match dimensions to actual production boards.</li>
                <li>• Link a material when you want clearer order summaries.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Existing Boards
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review the available raw board definitions used in box recipes and
              planning calculations.
            </p>
          </div>

          <div className="status-badge status-neutral">
            Total Boards: {boards.length}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading boards...</p>
        ) : boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-sm font-medium text-slate-700">
              No boards created yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a board above to start building recipes for the demo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {boards.map((board) => {
              const linkedMaterial = materials.find(
                (material) => material.id === board.materialId
              );

              return (
                <div
                  key={board.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {board.boardType}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Linked Material: {linkedMaterial?.name ?? "None"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(board.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Width
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {board.width}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Height
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {board.height}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Material
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {linkedMaterial?.name ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
