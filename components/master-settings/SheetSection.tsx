"use client";

import type { SheetWithSurfaces } from "@/lib/types/master-data";
import SurfaceEditor from "./SurfaceEditor";

interface SheetSectionProps {
  title: string;
  sheet: SheetWithSurfaces;
  onChange: (sheet: SheetWithSurfaces) => void;
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function SheetSection({
  title,
  sheet,
  onChange,
}: SheetSectionProps) {
  const updateField = <K extends keyof SheetWithSurfaces>(
    field: K,
    value: SheetWithSurfaces[K]
  ) => {
    onChange({
      ...sheet,
      [field]: value,
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <p className="mt-1 text-sm text-slate-500">
              Define the sheet dimensions, quantity per box, production time, and printable
              surfaces for this section.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="status-badge status-neutral">
              Qty / Box: {sheet.quantity}
            </span>
            <span className="status-badge status-warn">
              Prod Time: {sheet.productionTimeMinutes} min
            </span>
            <span className="status-badge status-info">
              Surfaces: {sheet.surfaces.length}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Sheet Dimensions
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Width
              </label>
              <input
                type="number"
                value={sheet.width}
                onChange={(e) => updateField("width", parseNumber(e.target.value))}
                className={inputClassName}
                placeholder="Width"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter the sheet width used for planning.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Height
              </label>
              <input
                type="number"
                value={sheet.height}
                onChange={(e) => updateField("height", parseNumber(e.target.value))}
                className={inputClassName}
                placeholder="Height"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter the sheet height used for planning.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quantity per Box
              </label>
              <input
                type="number"
                value={sheet.quantity}
                onChange={(e) =>
                  updateField("quantity", parseNumber(e.target.value))
                }
                className={inputClassName}
                placeholder="Quantity"
              />
              <p className="mt-2 text-xs text-slate-500">
                Number of pieces required for one box.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Production Time (min)
              </label>
              <input
                type="number"
                value={sheet.productionTimeMinutes}
                onChange={(e) =>
                  updateField("productionTimeMinutes", parseNumber(e.target.value))
                }
                className={inputClassName}
                placeholder="Minutes"
              />
              <p className="mt-2 text-xs text-slate-500">
                Estimated production time for this sheet in minutes.
              </p>
            </div>

   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Poly Bag Width (mm)
  </label>

  <input
    type="number"
    value={sheet.polyBagWidthMm}
    onChange={(e) =>
      updateField("polyBagWidthMm", parseNumber(e.target.value))
    }
    className={inputClassName}
    placeholder="Width"
  />

  <p className="mt-2 text-xs text-slate-500">
    Poly bag width used for packing calculations.
  </p>
</div>

<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Poly Bag Height (mm)
  </label>

  <input
    type="number"
    value={sheet.polyBagHeightMm}
    onChange={(e) =>
      updateField("polyBagHeightMm", parseNumber(e.target.value))
    }
    className={inputClassName}
    placeholder="Height"
  />

  <p className="mt-2 text-xs text-slate-500">
    Poly bag height used for packing calculations.
  </p>
</div>

<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Polyethylene Weight / 1000 pcs
  </label>

  <input
    type="number"
    value={sheet.polyethyleneWeightPer1000}
    onChange={(e) =>
      updateField(
        "polyethyleneWeightPer1000",
        parseNumber(e.target.value)
      )
    }
    className={inputClassName}
    placeholder="Weight"
  />

  <p className="mt-2 text-xs text-slate-500">
    Polyethylene consumption weight per 1000 pieces.
  </p>
</div>          
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Surface Configuration
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Manage the printable and non-printable surfaces attached to this
              sheet.
            </p>
          </div>

          <SurfaceEditor
            surfaces={sheet.surfaces}
            onChange={(surfaces) => updateField("surfaces", surfaces)}
          />
        </div>
      </div>
    </div>
  );
}