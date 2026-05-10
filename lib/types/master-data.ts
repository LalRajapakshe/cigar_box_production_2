// Placeholder for master data types
// lib/types/master-data.ts

/**
 * Core master-data types for the Generation 3 model.
 *
 * Rules:
 * - Only inline sheet configuration is allowed
 * - No separate SheetDimension entity
 * - No root-level surfaceSettings on BoxType
 * - Surfaces live inside each sheet
 */

export type SheetKey =
  | "topSheet"
  | "bottomSheet"
  | "longSheet"
  | "smallSheet"
  | "middleSheet";

export type RequiredSheetKey = "topSheet" | "longSheet" | "smallSheet";
export type OptionalSheetKey = "bottomSheet" | "middleSheet";

export type ImageColorMode = "Full Color" | "Black & White" | "RGB";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurfaceSpec {
  surfaceId: string;
  surfaceName: string;
  requiresPrinting: boolean;
  imageUrl?: string;
  imageColor?: ImageColorMode;
}

export interface SheetWithSurfaces {
  width: number;
  height: number;
  quantity: number;
  productionTimeMinutes: number;
  polyBagWidthMm: number;
  polyBagHeightMm: number;
  polyethyleneWeightPer1000: number;
  surfaces: SurfaceSpec[];
}

export interface MaterialDefinition extends BaseEntity {
  name: string;
  description?: string;
  cost?: number;
}

export interface BoardDefinition extends BaseEntity {
  name: string;
  width: number;
  height: number;
  materialId?: string;
}

export interface BoxTypeSheets {
  topSheet: SheetWithSurfaces;
  longSheet: SheetWithSurfaces;
  smallSheet: SheetWithSurfaces;
  bottomSheet?: SheetWithSurfaces;
  middleSheet?: SheetWithSurfaces;
}

export interface BoxType extends BaseEntity, BoxTypeSheets {
  name: string;
  description?: string;
  boardDefinitionId: string;
}

export type BoardDefinitionInput = Omit<BoardDefinition, keyof BaseEntity>;
export type MaterialDefinitionInput = Omit<MaterialDefinition, keyof BaseEntity>;
export type BoxTypeInput = Omit<BoxType, keyof BaseEntity>;

export type MasterSettingsTab = "boards" | "materials" | "boxTypes";