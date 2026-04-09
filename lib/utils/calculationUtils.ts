// lib/utils/calculationUtils.ts

import type {
  PlanningCalculationInput,
  OrderPlanningResult,
  PlanningPartResult,
  PlanningSummary,
  PlanningWarning,
} from "../types/planning";
import type {
  SheetWithSurfaces,
  SheetKey,
} from "../types/master-data";

/**
 * Helper to safely parse numbers
 */
function safeNumber(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Build active sheets (Generation 3 model)
 */
function getActiveSheets(boxType: PlanningCalculationInput["boxType"]) {
  const sheets: Array<{
    key: SheetKey;
    label: string;
    sheet?: SheetWithSurfaces;
    isOptional: boolean;
  }> = [
    { key: "topSheet", label: "T/B", sheet: boxType.topSheet, isOptional: false },
    { key: "longSheet", label: "Long", sheet: boxType.longSheet, isOptional: false },
    { key: "smallSheet", label: "Small", sheet: boxType.smallSheet, isOptional: false },
    { key: "bottomSheet", label: "Bottom", sheet: boxType.bottomSheet, isOptional: true },
    { key: "middleSheet", label: "Middle", sheet: boxType.middleSheet, isOptional: true },
  ];

  return sheets.filter((s) => s.sheet);
}

/**
 * Core calculation for one orientation
 */
function calculateOrientation(
  boardWidth: number,
  boardHeight: number,
  pieceWidth: number,
  pieceHeight: number
) {
  const cutWidth = pieceWidth + 1;   // 1mm loss
  const cutHeight = pieceHeight + 1; // 1mm loss

  const slatsPerBoard = Math.floor(boardHeight / cutHeight);
  const piecesPerSlat = Math.floor(boardWidth / cutWidth);

  const remainingBoardHeight =
    boardHeight - slatsPerBoard * cutHeight;

  const remainingBoardWidth =
    boardWidth - piecesPerSlat * cutWidth;

  return {
    cuttingWidth: cutWidth,
    cuttingHeight: cutHeight,
    slatsPerBoard,
    piecesPerSlat,
    remainingBoardWidth,
    remainingBoardHeight,
    piecesPerBoard: slatsPerBoard * piecesPerSlat,
  };
}

/**
 * Choose best orientation (normal vs rotated)
 */
function getBestOrientation(
  boardWidth: number,
  boardHeight: number,
  pieceWidth: number,
  pieceHeight: number
) {
  const normal = calculateOrientation(
    boardWidth,
    boardHeight,
    pieceWidth,
    pieceHeight
  );

  const rotated = calculateOrientation(
    boardWidth,
    boardHeight,
    pieceHeight,
    pieceWidth
  );

  if (rotated.piecesPerBoard > normal.piecesPerBoard) {
    return {
      orientation: "rotated" as const,
      ...rotated,
      pieceWidth: pieceHeight,
      pieceHeight: pieceWidth,
    };
  }

  return {
    orientation: "normal" as const,
    ...normal,
    pieceWidth,
    pieceHeight,
  };
}

/**
 * Main planner
 */
export function generateOrderPlanning(
  input: PlanningCalculationInput
): OrderPlanningResult {
  const { order, boxType, boardDefinition } = input;

  const warnings: PlanningWarning[] = [];

  const boardWidth = safeNumber(boardDefinition.width);
  const boardHeight = safeNumber(boardDefinition.height);

  if (boardWidth <= 0 || boardHeight <= 0) {
    warnings.push({
      code: "INVALID_BOARD_SIZE",
      message: "Board dimensions are invalid.",
    });
  }

  const parts: PlanningPartResult[] = [];

  let totalPieces = 0;
  let totalSlats = 0;
  let totalBoards = 0;
  let totalProductionTime = 0;

  const activeSheets = getActiveSheets(boxType);

  for (const sheetConfig of activeSheets) {
    const sheet = sheetConfig.sheet!;
    const pieceWidth = safeNumber(sheet.width);
    const pieceHeight = safeNumber(sheet.height);
    const quantityPerBox = safeNumber(sheet.quantity);

    if (pieceWidth <= 0 || pieceHeight <= 0) {
      warnings.push({
        code: "INVALID_SHEET_SIZE",
        message: `Invalid size for ${sheetConfig.label}`,
        sheetKey: sheetConfig.key,
        sheetLabel: sheetConfig.label,
      });
      continue;
    }

    const orientationResult = getBestOrientation(
      boardWidth,
      boardHeight,
      pieceWidth,
      pieceHeight
    );

    const totalPiecesRequired =
      safeNumber(order.quantity) * quantityPerBox;

    if (orientationResult.piecesPerSlat === 0 || orientationResult.slatsPerBoard === 0) {
      warnings.push({
        code: "SHEET_DOES_NOT_FIT_BOARD",
        message: `${sheetConfig.label} does not fit into board.`,
        sheetKey: sheetConfig.key,
        sheetLabel: sheetConfig.label,
      });
      continue;
    }

    const totalSlatsRequired = Math.ceil(
      totalPiecesRequired / orientationResult.piecesPerSlat
    );

    const totalBoardsRequired = Math.ceil(
      totalSlatsRequired / orientationResult.slatsPerBoard
    );

    const productionTimePerPiece = safeNumber(sheet.productionTimeMinutes);
    const totalTime = productionTimePerPiece * totalPiecesRequired;

    totalPieces += totalPiecesRequired;
    totalSlats += totalSlatsRequired;
    totalBoards += totalBoardsRequired;
    totalProductionTime += totalTime;

    const part: PlanningPartResult = {
      sheetKey: sheetConfig.key,
      partLabel: sheetConfig.label as any,
      sheetLabel: sheetConfig.label,
      isOptional: sheetConfig.isOptional,

      pieceWidth: orientationResult.pieceWidth,
      pieceHeight: orientationResult.pieceHeight,
      quantityPerBox,
      totalPiecesRequired,

      boardWidth,
      boardHeight,

      cuttingWidth: orientationResult.cuttingWidth,
      cuttingHeight: orientationResult.cuttingHeight,

      orientation: orientationResult.orientation,

      piecesPerSlat: orientationResult.piecesPerSlat,
      slatsPerBoard: orientationResult.slatsPerBoard,
      piecesPerBoard: orientationResult.piecesPerBoard,

      totalSlatsRequired,
      totalBoardsRequired,

      remainingBoardWidth: orientationResult.remainingBoardWidth,
      remainingBoardHeight: orientationResult.remainingBoardHeight,

      productionTimeMinutesPerPiece: productionTimePerPiece,
      totalProductionTimeMinutes: totalTime,

      printableSurfaces: sheet.surfaces.map((s) => ({
        ...s,
        sheetKey: sheetConfig.key,
        sheetLabel: sheetConfig.label,
      })),
    };

    parts.push(part);
  }

  const summary: PlanningSummary = {
    totalParts: parts.length,
    totalPiecesRequired: totalPieces,
    totalSlatsRequired: totalSlats,
    totalBoardsRequired: totalBoards,
    totalPrintableSurfaceCount: parts.reduce(
      (acc, p) => acc + p.printableSurfaces.length,
      0
    ),
    totalProductionTimeMinutes: totalProductionTime,
  };

  return {
    orderId: order.id,
    boxTypeId: boxType.id,
    boxTypeName: boxType.name,
    boardDefinitionId: boardDefinition.id,
    boardDefinitionName: boardDefinition.name,

    parts,
    printableSurfaces: parts.flatMap((p) => p.printableSurfaces),
    summary,
    warnings,
  };
}