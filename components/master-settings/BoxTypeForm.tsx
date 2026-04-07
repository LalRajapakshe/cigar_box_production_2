"use client";

import { useEffect, useState } from "react";
import { boardService } from "@/lib/services/boardService";
import { boxTypeService } from "@/lib/services/boxTypeService";
import {
  DEFAULT_BOTTOM_SHEET_SURFACES,
  DEFAULT_LONG_SHEET_SURFACES,
  DEFAULT_MIDDLE_SHEET_SURFACES,
  DEFAULT_SMALL_SHEET_SURFACES,
  DEFAULT_TOP_SHEET_SURFACES,
} from "@/lib/constants/defaultSurfaces";
import type {
  BoardDefinition,
  BoxType,
  BoxTypeInput,
  SheetWithSurfaces,
} from "@/lib/types/master-data";
import SheetSection from "./SheetSection";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

function createSheet(
  quantity: number,
  surfaces: SheetWithSurfaces["surfaces"]
): SheetWithSurfaces {
  return {
    width: 0,
    height: 0,
    quantity,
    productionTimeMinutes: 0,
    surfaces: surfaces.map((surface) => ({ ...surface })),
  };
}

const initialForm: BoxTypeInput = {
  name: "",
  description: "",
  boardDefinitionId: "",
  topSheet: createSheet(1, DEFAULT_TOP_SHEET_SURFACES),
  longSheet: createSheet(2, DEFAULT_LONG_SHEET_SURFACES),
  smallSheet: createSheet(2, DEFAULT_SMALL_SHEET_SURFACES),
  bottomSheet: undefined,
  middleSheet: undefined,
};

export default function BoxTypeForm() {
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [form, setForm] = useState<BoxTypeInput>(initialForm);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [boardData, boxTypeData] = await Promise.all([
      boardService.getAll(),
      boxTypeService.getAll(),
    ]);

    setBoards(boardData);
    setBoxTypes(boxTypeData);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.boardDefinitionId) return;

    await boxTypeService.create({
      ...form,
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
    });

    setForm(initialForm);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await boxTypeService.remove(id);
    await loadData();
  };

  const selectedBoard = boards.find((board) => board.id === form.boardDefinitionId);

  const totalConfiguredSurfaces =
    form.topSheet.surfaces.length +
    form.longSheet.surfaces.length +
    form.smallSheet.surfaces.length +
    (form.bottomSheet?.surfaces.length ?? 0) +
    (form.middleSheet?.surfaces.length ?? 0);

  const totalPrintableSurfaces =
    form.topSheet.surfaces.filter((item) => item.requiresPrinting).length +
    form.longSheet.surfaces.filter((item) => item.requiresPrinting).length +
    form.smallSheet.surfaces.filter((item) => item.requiresPrinting).length +
    (form.bottomSheet?.surfaces.filter((item) => item.requiresPrinting).length ?? 0) +
    (form.middleSheet?.surfaces.filter((item) => item.requiresPrinting).length ?? 0);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="status-badge status-info mb-3">Recipe Builder</div>
              <h2 className="text-2xl font-bold text-slate-900">
                Box Type Definitions
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Create a box recipe with embedded sheet sizes, optional bottom and
                middle sheets, and per-sheet surface settings for planning and
                printing preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Required Sheets
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">3</div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Configured Surfaces
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {totalConfiguredSurfaces}
                </div>
              </div>

              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Printable Surfaces
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">
                  {totalPrintableSurfaces}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  General Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Define the recipe name, optional description, and the raw board
                  used for planning.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Box Type Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={inputClassName}
                    placeholder="e.g. Premium Cigar Box"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    The primary production recipe name shown to users.
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
                    Add a short explanation for the recipe or box use case.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Board Definition
                  </label>
                  <select
                    value={form.boardDefinitionId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        boardDefinitionId: e.target.value,
                      }))
                    }
                    className={inputClassName}
                  >
                    <option value="">Select board</option>
                    {boards.map((board) => (
                      <option key={board.id} value={board.id}>
                        {board.name} ({board.width} x {board.height})
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Select the raw board used for planning calculations.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Required Sheets
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    These sheets are always part of the box recipe.
                  </p>
                </div>
                <span className="status-badge status-neutral">Mandatory</span>
              </div>

              <SheetSection
                title="Top Sheet"
                sheet={form.topSheet}
                onChange={(sheet) => setForm((prev) => ({ ...prev, topSheet: sheet }))}
              />

              <SheetSection
                title="Long Sheet"
                sheet={form.longSheet}
                onChange={(sheet) =>
                  setForm((prev) => ({ ...prev, longSheet: sheet }))
                }
              />

              <SheetSection
                title="Small Sheet"
                sheet={form.smallSheet}
                onChange={(sheet) =>
                  setForm((prev) => ({ ...prev, smallSheet: sheet }))
                }
              />
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Optional Sheets
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Enable optional sheets when the recipe requires extra sections.
                  </p>
                </div>
                <span className="status-badge status-info">Optional</span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        Bottom Sheet
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Enable this if the box recipe includes a bottom sheet.
                      </p>
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(form.bottomSheet)}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            bottomSheet: e.target.checked
                              ? createSheet(1, DEFAULT_BOTTOM_SHEET_SURFACES)
                              : undefined,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      Include Bottom Sheet
                    </label>
                  </div>
                </div>

                {form.bottomSheet ? (
                  <div className="p-5">
                    <SheetSection
                      title="Bottom Sheet"
                      sheet={form.bottomSheet}
                      onChange={(sheet) =>
                        setForm((prev) => ({ ...prev, bottomSheet: sheet }))
                      }
                    />
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                      <div className="text-sm font-medium text-slate-700">
                        Bottom sheet not included
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Enable the toggle above to configure bottom sheet details.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        Middle Sheet
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Enable this if the box recipe includes a middle sheet.
                      </p>
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(form.middleSheet)}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            middleSheet: e.target.checked
                              ? createSheet(1, DEFAULT_MIDDLE_SHEET_SURFACES)
                              : undefined,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      Include Middle Sheet
                    </label>
                  </div>
                </div>

                {form.middleSheet ? (
                  <div className="p-5">
                    <SheetSection
                      title="Middle Sheet"
                      sheet={form.middleSheet}
                      onChange={(sheet) =>
                        setForm((prev) => ({ ...prev, middleSheet: sheet }))
                      }
                    />
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                      <div className="text-sm font-medium text-slate-700">
                        Middle sheet not included
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Enable the toggle above to configure middle sheet details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreate}
                className="primary-btn"
              >
                Save Box Type
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
                  Recipe Summary
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Live overview of the recipe being configured.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Name
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {form.name.trim() || "Not set"}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Selected Board
                  </div>
                  <div className="mt-2 font-semibold text-slate-900">
                    {selectedBoard
                      ? `${selectedBoard.name} (${selectedBoard.width} x ${selectedBoard.height})`
                      : "No board selected"}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Included Sheets
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="font-medium text-slate-900">Top Sheet</div>
                    <div className="font-medium text-slate-900">Long Sheet</div>
                    <div className="font-medium text-slate-900">Small Sheet</div>
                    {form.bottomSheet && (
                      <div className="font-medium text-slate-900">Bottom Sheet</div>
                    )}
                    {form.middleSheet && (
                      <div className="font-medium text-slate-900">Middle Sheet</div>
                    )}
                  </div>
                </div>

                <div className="soft-card">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Surface Overview
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium text-slate-900">
                      Total Surfaces: {totalConfiguredSurfaces}
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      Printable Surfaces: {totalPrintableSurfaces}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Demonstration Guidance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Start by selecting a board definition.</li>
                <li>• Configure required sheets first.</li>
                <li>• Enable optional sheets only when needed.</li>
                <li>• Add printable surfaces to support planning output.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Existing Box Types
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review saved box recipes available for order creation and planning.
            </p>
          </div>

          <div className="status-badge status-neutral">
            Total Recipes: {boxTypes.length}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading box types...</p>
        ) : boxTypes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-sm font-medium text-slate-700">
              No box types created yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a recipe above to start demonstrating the production flow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {boxTypes.map((boxType) => (
              <div
                key={boxType.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {boxType.name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {boxType.description || "No description"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(boxType.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Top Sheet
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      {boxType.topSheet.width} x {boxType.topSheet.height}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Long Sheet
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      {boxType.longSheet.width} x {boxType.longSheet.height}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Small Sheet
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      {boxType.smallSheet.width} x {boxType.smallSheet.height}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Optional Sheets
                    </div>
                    <div className="mt-2 font-medium text-slate-900">
                      Bottom: {boxType.bottomSheet ? "Yes" : "No"} | Middle:{" "}
                      {boxType.middleSheet ? "Yes" : "No"}
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