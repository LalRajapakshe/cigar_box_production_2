// lib/types/planning.ts

import type {
  BoardDefinition,
  BoxType,
  SheetKey,
  SurfaceSpec,
} from "./master-data";
import type { Order } from "./order";

export type PlanningPartLabel =
  | "T/B"
  | "Top"
  | "Bottom"
  | "Long"
  | "Small"
  | "Middle";

export type PlanningOrientation = "normal" | "rotated";

export interface PlanningCalculationInput {
  order: Order;
  boxType: BoxType;
  boardDefinition: BoardDefinition;
}

export interface PrintableSurfaceRequirement extends SurfaceSpec {
  sheetKey: SheetKey;
  sheetLabel: string;
}

export interface PlanningPartResult {
  sheetKey: SheetKey;
  partLabel: PlanningPartLabel;
  sheetLabel: string;
  isOptional: boolean;

  pieceWidth: number;
  pieceHeight: number;
  quantityPerBox: number;
  totalPiecesRequired: number;

  boardWidth: number;
  boardHeight: number;

  cuttingWidth: number;
  cuttingHeight: number;

  orientation: PlanningOrientation;

  piecesPerSlat: number;
  slatsPerBoard: number;
  piecesPerBoard: number;

  totalSlatsRequired: number;
  totalBoardsRequired: number;

  remainingBoardWidth: number;
  remainingBoardHeight: number;

  productionTimeMinutesPerPiece: number;
  totalProductionTimeMinutes: number;

  printableSurfaces: PrintableSurfaceRequirement[];
}

export interface PlanningSummary {
  totalParts: number;
  totalPiecesRequired: number;
  totalSlatsRequired: number;
  totalBoardsRequired: number;
  totalPrintableSurfaceCount: number;
  totalProductionTimeMinutes: number;
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

  parts: PlanningPartResult[];
  printableSurfaces: PrintableSurfaceRequirement[];
  summary: PlanningSummary;
  warnings: PlanningWarning[];
}