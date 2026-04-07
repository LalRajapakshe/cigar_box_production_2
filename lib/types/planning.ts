// Placeholder for planning types
// lib/types/planning.ts

import type {
  BoardDefinition,
  BoxType,
  SheetKey,
  SheetWithSurfaces,
  SurfaceSpec,
} from "./master-data";
import type { Order } from "./order";

/**
 * Planning / calculation domain types.
 *
 * Rules:
 * - Planning is calculated from Order + BoxType + BoardDefinition
 * - Each active sheet is processed individually
 * - Required sheets: topSheet, longSheet, smallSheet
 * - Optional sheets: bottomSheet, middleSheet
 * - Printable surfaces are collected from sheet.surfaces
 */

export interface PlanningCalculationInput {
  order: Order;
  boxType: BoxType;
  boardDefinition: BoardDefinition;
}

export interface ActiveSheetConfig {
  sheetKey: SheetKey;
  sheetLabel: string;
  isOptional: boolean;
  sheet: SheetWithSurfaces;
}

export interface PrintableSurfaceRequirement extends SurfaceSpec {
  sheetKey: SheetKey;
  sheetLabel: string;
}

export interface PlanningSheetResult {
  sheetKey: SheetKey;
  sheetLabel: string;
  isOptional: boolean;

  pieceWidth: number;
  pieceHeight: number;
  quantityPerBox: number;
  orderQuantity: number;
  totalPiecesRequired: number;

  boardWidth: number;
  boardHeight: number;

  piecesPerSlat: number;
  slatsPerBoard: number;
  piecesPerBoard: number;

  totalSlatsRequired: number;
  totalBoardsRequired: number;

  printableSurfaces: PrintableSurfaceRequirement[];
}

export interface PlanningSummary {
  activeSheetCount: number;
  totalPiecesRequired: number;
  totalSlatsRequired: number;
  totalBoardsRequired: number;
  totalPrintableSurfaceCount: number;
}

export type PlanningWarningCode =
  | "INVALID_ORDER_QUANTITY"
  | "INVALID_BOARD_SIZE"
  | "INVALID_SHEET_SIZE"
  | "SHEET_DOES_NOT_FIT_BOARD";

export interface PlanningWarning {
  code: PlanningWarningCode;
  message: string;
  sheetKey?: SheetKey;
  sheetLabel?: string;
}

export interface OrderPlanningResult {
  orderId: string;
  boxTypeId: string;
  boxTypeName: string;
  boardDefinitionId: string;
  boardDefinitionName: string;

  sheetResults: PlanningSheetResult[];
  printableSurfaces: PrintableSurfaceRequirement[];
  summary: PlanningSummary;
  warnings: PlanningWarning[];
}