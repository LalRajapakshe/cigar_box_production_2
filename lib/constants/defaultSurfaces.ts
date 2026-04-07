// Placeholder for default surfaces
// lib/constants/defaultSurfaces.ts

import type { SurfaceSpec } from "../types/master-data";

/**
 * Default reusable surface templates.
 *
 * These are starter surfaces you can attach to sheets when creating a BoxType.
 * You can keep them as defaults and still allow users to edit them in the UI.
 */

export const DEFAULT_TOP_SHEET_SURFACES: SurfaceSpec[] = [
  {
    surfaceId: "top-front",
    surfaceName: "Top Front",
    requiresPrinting: false,
  },
  {
    surfaceId: "top-back",
    surfaceName: "Top Back",
    requiresPrinting: false,
  },
];

export const DEFAULT_BOTTOM_SHEET_SURFACES: SurfaceSpec[] = [
  {
    surfaceId: "bottom-front",
    surfaceName: "Bottom Front",
    requiresPrinting: false,
  },
  {
    surfaceId: "bottom-back",
    surfaceName: "Bottom Back",
    requiresPrinting: false,
  },
];

export const DEFAULT_LONG_SHEET_SURFACES: SurfaceSpec[] = [
  {
    surfaceId: "long-outer",
    surfaceName: "Long Side Outer",
    requiresPrinting: false,
  },
  {
    surfaceId: "long-inner",
    surfaceName: "Long Side Inner",
    requiresPrinting: false,
  },
];

export const DEFAULT_SMALL_SHEET_SURFACES: SurfaceSpec[] = [
  {
    surfaceId: "small-outer",
    surfaceName: "Small Side Outer",
    requiresPrinting: false,
  },
  {
    surfaceId: "small-inner",
    surfaceName: "Small Side Inner",
    requiresPrinting: false,
  },
];

export const DEFAULT_MIDDLE_SHEET_SURFACES: SurfaceSpec[] = [
  {
    surfaceId: "middle-front",
    surfaceName: "Middle Front",
    requiresPrinting: false,
  },
  {
    surfaceId: "middle-back",
    surfaceName: "Middle Back",
    requiresPrinting: false,
  },
];

export const DEFAULT_SURFACES_BY_SHEET = {
  topSheet: DEFAULT_TOP_SHEET_SURFACES,
  bottomSheet: DEFAULT_BOTTOM_SHEET_SURFACES,
  longSheet: DEFAULT_LONG_SHEET_SURFACES,
  smallSheet: DEFAULT_SMALL_SHEET_SURFACES,
  middleSheet: DEFAULT_MIDDLE_SHEET_SURFACES,
} as const;