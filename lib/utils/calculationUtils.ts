// Placeholder for calculation utilities
// lib/utils/calculationUtils.ts
import type { BoxType, SheetKey } from "../types/master-data";
import type { Order } from "../types/order";
import type {
  ActiveSheetConfig,
  OrderPlanningResult,
  PlanningCalculationInput,
  PlanningSheetResult,
  PlanningSummary,
  PlanningWarning,
  PrintableSurfaceRequirement,
} from "../types/planning";

interface OrientationCandidate {
  rotated: boolean;
  pieceWidth: number;
  pieceHeight: number;
  piecesPerSlat: number;
  slatsPerBoard: number;
  piecesPerBoard: number;
}

const SHEET_CONFIGS: Array<{
  key: SheetKey;
  label: string;
  isOptional: boolean;
}> = [
  { key: "topSheet", label: "Top Sheet", isOptional: false },
  { key: "longSheet", label: "Long Sheet", isOptional: false },
  { key: "smallSheet", label: "Small Sheet", isOptional: false },
  { key: "bottomSheet", label: "Bottom Sheet", isOptional: true },
  { key: "middleSheet", label: "Middle Sheet", isOptional: true },
];

function toPositiveWholeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.ceil(value));
}

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function buildActiveSheets(boxType: BoxType): ActiveSheetConfig[] {
  return SHEET_CONFIGS.flatMap((config) => {
    const sheet = boxType[config.key];

    if (!sheet) return [];

    return [
      {
        sheetKey: config.key,
        sheetLabel: config.label,
        isOptional: config.isOptional,
        sheet,
      },
    ];
  });
}

function buildPrintableSurfaces(
  activeSheet: ActiveSheetConfig
): PrintableSurfaceRequirement[] {
  return activeSheet.sheet.surfaces
    .filter((surface) => surface.requiresPrinting)
    .map((surface) => ({
      ...surface,
      sheetKey: activeSheet.sheetKey,
      sheetLabel: activeSheet.sheetLabel,
    }));
}

function buildOrientationCandidate(params: {
  boardWidth: number;
  boardHeight: number;
  pieceWidth: number;
  pieceHeight: number;
  rotated: boolean;
}): OrientationCandidate {
  const { boardWidth, boardHeight, pieceWidth, pieceHeight, rotated } = params;

  if (
    !isPositiveNumber(boardWidth) ||
    !isPositiveNumber(boardHeight) ||
    !isPositiveNumber(pieceWidth) ||
    !isPositiveNumber(pieceHeight)
  ) {
    return {
      rotated,
      pieceWidth,
      pieceHeight,
      piecesPerSlat: 0,
      slatsPerBoard: 0,
      piecesPerBoard: 0,
    };
  }

  const piecesPerSlat = Math.floor(boardWidth / pieceWidth);
  const slatsPerBoard = Math.floor(boardHeight / pieceHeight);
  const piecesPerBoard = piecesPerSlat * slatsPerBoard;

  return {
    rotated,
    pieceWidth,
    pieceHeight,
    piecesPerSlat,
    slatsPerBoard,
    piecesPerBoard,
  };
}

function chooseBestOrientation(params: {
  boardWidth: number;
  boardHeight: number;
  pieceWidth: number;
  pieceHeight: number;
}): OrientationCandidate {
  const { boardWidth, boardHeight, pieceWidth, pieceHeight } = params;

  const normal = buildOrientationCandidate({
    boardWidth,
    boardHeight,
    pieceWidth,
    pieceHeight,
    rotated: false,
  });

  const rotated = buildOrientationCandidate({
    boardWidth,
    boardHeight,
    pieceWidth: pieceHeight,
    pieceHeight: pieceWidth,
    rotated: true,
  });

  if (rotated.piecesPerBoard > normal.piecesPerBoard) {
    return rotated;
  }

  if (rotated.piecesPerBoard < normal.piecesPerBoard) {
    return normal;
  }

  if (rotated.piecesPerSlat > normal.piecesPerSlat) {
    return rotated;
  }

  if (rotated.piecesPerSlat < normal.piecesPerSlat) {
    return normal;
  }

  if (rotated.slatsPerBoard > normal.slatsPerBoard) {
    return rotated;
  }

  return normal;
}

function calculateSheetResult(params: {
  order: Order;
  activeSheet: ActiveSheetConfig;
  boardWidth: number;
  boardHeight: number;
}): {
  result: PlanningSheetResult;
  warnings: PlanningWarning[];
} {
  const { order, activeSheet, boardWidth, boardHeight } = params;

  const warnings: PlanningWarning[] = [];
  const quantityPerBox = toPositiveWholeNumber(activeSheet.sheet.quantity);
  const orderQuantity = toPositiveWholeNumber(order.quantity);
  const pieceWidth = activeSheet.sheet.width;
  const pieceHeight = activeSheet.sheet.height;

  const printableSurfaces = buildPrintableSurfaces(activeSheet);

  if (
    !isPositiveNumber(pieceWidth) ||
    !isPositiveNumber(pieceHeight) ||
    quantityPerBox <= 0
  ) {
    warnings.push({
      code: "INVALID_SHEET_SIZE",
      message: `${activeSheet.sheetLabel} has invalid width, height, or quantity.`,
      sheetKey: activeSheet.sheetKey,
      sheetLabel: activeSheet.sheetLabel,
    });

    return {
      result: {
        sheetKey: activeSheet.sheetKey,
        sheetLabel: activeSheet.sheetLabel,
        isOptional: activeSheet.isOptional,

        pieceWidth,
        pieceHeight,
        quantityPerBox,
        orderQuantity,
        totalPiecesRequired: 0,

        boardWidth,
        boardHeight,

        piecesPerSlat: 0,
        slatsPerBoard: 0,
        piecesPerBoard: 0,

        totalSlatsRequired: 0,
        totalBoardsRequired: 0,

        printableSurfaces,
      },
      warnings,
    };
  }

  const bestOrientation = chooseBestOrientation({
    boardWidth,
    boardHeight,
    pieceWidth,
    pieceHeight,
  });

  const totalPiecesRequired = quantityPerBox * orderQuantity;

  if (bestOrientation.piecesPerBoard <= 0) {
    warnings.push({
      code: "SHEET_DOES_NOT_FIT_BOARD",
      message: `${activeSheet.sheetLabel} does not fit within the selected board dimensions.`,
      sheetKey: activeSheet.sheetKey,
      sheetLabel: activeSheet.sheetLabel,
    });

    return {
      result: {
        sheetKey: activeSheet.sheetKey,
        sheetLabel: activeSheet.sheetLabel,
        isOptional: activeSheet.isOptional,

        pieceWidth: bestOrientation.pieceWidth,
        pieceHeight: bestOrientation.pieceHeight,
        quantityPerBox,
        orderQuantity,
        totalPiecesRequired,

        boardWidth,
        boardHeight,

        piecesPerSlat: 0,
        slatsPerBoard: 0,
        piecesPerBoard: 0,

        totalSlatsRequired: 0,
        totalBoardsRequired: 0,

        printableSurfaces,
      },
      warnings,
    };
  }

  const totalSlatsRequired = Math.ceil(
    totalPiecesRequired / bestOrientation.piecesPerSlat
  );

  const totalBoardsRequired = Math.ceil(
    totalSlatsRequired / bestOrientation.slatsPerBoard
  );

  return {
    result: {
      sheetKey: activeSheet.sheetKey,
      sheetLabel: activeSheet.sheetLabel,
      isOptional: activeSheet.isOptional,

      pieceWidth: bestOrientation.pieceWidth,
      pieceHeight: bestOrientation.pieceHeight,
      quantityPerBox,
      orderQuantity,
      totalPiecesRequired,

      boardWidth,
      boardHeight,

      piecesPerSlat: bestOrientation.piecesPerSlat,
      slatsPerBoard: bestOrientation.slatsPerBoard,
      piecesPerBoard: bestOrientation.piecesPerBoard,

      totalSlatsRequired,
      totalBoardsRequired,

      printableSurfaces,
    },
    warnings,
  };
}

function buildSummary(sheetResults: PlanningSheetResult[]): PlanningSummary {
  return {
    activeSheetCount: sheetResults.length,
    totalPiecesRequired: sheetResults.reduce(
      (sum, item) => sum + item.totalPiecesRequired,
      0
    ),
    totalSlatsRequired: sheetResults.reduce(
      (sum, item) => sum + item.totalSlatsRequired,
      0
    ),
    totalBoardsRequired: sheetResults.reduce(
      (sum, item) => sum + item.totalBoardsRequired,
      0
    ),
    totalPrintableSurfaceCount: sheetResults.reduce(
      (sum, item) => sum + item.printableSurfaces.length,
      0
    ),
  };
}

export function calculateOrderPlanning(
  input: PlanningCalculationInput
): OrderPlanningResult {
  const { order, boxType, boardDefinition } = input;

  const warnings: PlanningWarning[] = [];
  const boardWidth = boardDefinition.width;
  const boardHeight = boardDefinition.height;

  const orderQuantity = toPositiveWholeNumber(order.quantity);
  const activeSheets = buildActiveSheets(boxType);

  if (orderQuantity <= 0) {
    warnings.push({
      code: "INVALID_ORDER_QUANTITY",
      message: "Order quantity must be greater than zero.",
    });
  }

  if (!isPositiveNumber(boardWidth) || !isPositiveNumber(boardHeight)) {
    warnings.push({
      code: "INVALID_BOARD_SIZE",
      message: "Board width and height must both be greater than zero.",
    });
  }

  const sheetResults: PlanningSheetResult[] = [];
  const allPrintableSurfaces: PrintableSurfaceRequirement[] = [];

  for (const activeSheet of activeSheets) {
    const { result, warnings: sheetWarnings } = calculateSheetResult({
      order,
      activeSheet,
      boardWidth,
      boardHeight,
    });

    sheetResults.push(result);
    warnings.push(...sheetWarnings);
    allPrintableSurfaces.push(...result.printableSurfaces);
  }

  const summary = buildSummary(sheetResults);

  return {
    orderId: order.id,
    boxTypeId: boxType.id,
    boxTypeName: boxType.name,
    boardDefinitionId: boardDefinition.id,
    boardDefinitionName: boardDefinition.name,

    sheetResults,
    printableSurfaces: allPrintableSurfaces,
    summary,
    warnings,
  };
}

export function getBoxTypeActiveSheets(boxType: BoxType): ActiveSheetConfig[] {
  return buildActiveSheets(boxType);
}