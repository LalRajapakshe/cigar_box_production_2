"use client";

import type {
  ImageColorMode,
  SurfaceSpec,
} from "@/lib/types/master-data";

interface SurfaceEditorProps {
  surfaces: SurfaceSpec[];
  onChange: (surfaces: SurfaceSpec[]) => void;
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

const selectClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

export default function SurfaceEditor({
  surfaces,
  onChange,
}: SurfaceEditorProps) {
  const updateSurface = <K extends keyof SurfaceSpec>(
    index: number,
    field: K,
    value: SurfaceSpec[K]
  ) => {
    const updated = [...surfaces];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const addSurface = () => {
    const newSurface: SurfaceSpec = {
      surfaceId: crypto.randomUUID(),
      surfaceName: "",
      requiresPrinting: false,
    };

    onChange([...surfaces, newSurface]);
  };

  const removeSurface = (index: number) => {
    const updated = surfaces.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-900">
            Surface Settings
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Add surface definitions and mark which surfaces require printing for
            the client demonstration workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={addSurface}
          className="primary-btn"
        >
          Add Surface
        </button>
      </div>

      {surfaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <div className="text-sm font-medium text-slate-700">
            No surfaces added yet
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Add at least one surface to define whether printing is required.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {surfaces.map((surface, index) => (
            <div
              key={surface.surfaceId}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      {surface.surfaceName?.trim()
                        ? surface.surfaceName
                        : `Surface ${index + 1}`}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Configure surface name, image reference, color mode, and
                      print requirement.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`status-badge ${
                        surface.requiresPrinting
                          ? "status-info"
                          : "status-neutral"
                      }`}
                    >
                      {surface.requiresPrinting
                        ? "Printing Required"
                        : "No Printing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Surface Name
                    </label>
                    <input
                      type="text"
                      value={surface.surfaceName}
                      onChange={(e) =>
                        updateSurface(index, "surfaceName", e.target.value)
                      }
                      className={inputClassName}
                      placeholder="e.g. Outer Front"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Name used to identify the surface in planning and design.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={surface.imageUrl ?? ""}
                      onChange={(e) =>
                        updateSurface(index, "imageUrl", e.target.value)
                      }
                      className={inputClassName}
                      placeholder="Optional image URL"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Optional reference to an artwork or preview image.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Image Color
                    </label>
                    <select
                      value={surface.imageColor ?? ""}
                      onChange={(e) =>
                        updateSurface(
                          index,
                          "imageColor",
                          e.target.value
                            ? (e.target.value as ImageColorMode)
                            : undefined
                        )
                      }
                      className={selectClassName}
                    >
                      <option value="">Select color mode</option>
                      <option value="Full Color">Full Color</option>
                      <option value="Black & White">Black & White</option>
                      <option value="RGB">RGB</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Choose the print color mode for this surface.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Printing Requirement
                    </label>

                    <div className="flex h-[46px] items-center rounded-xl border border-slate-300 bg-white px-3">
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={surface.requiresPrinting}
                          onChange={(e) =>
                            updateSurface(
                              index,
                              "requiresPrinting",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />
                        Requires Printing
                      </label>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Enable this if the surface needs printed artwork or image
                      treatment.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSurface(index)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Remove Surface
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}