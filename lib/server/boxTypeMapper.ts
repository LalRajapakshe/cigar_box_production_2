import type {
  BoxType as ClientBoxType,
  BoxTypeInput,
  SheetKey,
  SheetWithSurfaces,
  SurfaceSpec,
} from "@/lib/types/master-data";

type DbSurface = {
  id: string;
  surfaceName: string;
  requiresPrinting: boolean;
  imageUrl: string | null;
  imageColor: string | null;
};

type DbSheet = {
  id: string;
  sheetKey: string;
  width: number;
  height: number;
  quantity: number;
  productionTimeMinutes: number;
  surfaces: DbSurface[];
};

type DbBoxType = {
  id: string;
  name: string;
  description: string | null;
  boardDefinitionId: string;
  createdAt: Date;
  updatedAt: Date;
  sheets: DbSheet[];
};

const REQUIRED_KEYS: SheetKey[] = ["topSheet", "longSheet", "smallSheet"];

function toClientSurface(surface: DbSurface): SurfaceSpec {
  return {
    surfaceId: surface.id,
    surfaceName: surface.surfaceName,
    requiresPrinting: surface.requiresPrinting,
    imageUrl: surface.imageUrl ?? undefined,
    imageColor: surface.imageColor as SurfaceSpec["imageColor"],
  };
}

function toClientSheet(sheet: DbSheet | undefined): SheetWithSurfaces | undefined {
  if (!sheet) return undefined;

  return {
    width: sheet.width,
    height: sheet.height,
    quantity: sheet.quantity,
    productionTimeMinutes: sheet.productionTimeMinutes ?? 0,
    surfaces: sheet.surfaces.map(toClientSurface),
  };
}

function requireSheet(
  sheetMap: Map<string, DbSheet>,
  key: SheetKey
): SheetWithSurfaces {
  const sheet = toClientSheet(sheetMap.get(key));
  if (!sheet) {
    throw new Error(`Missing required sheet: ${key}`);
  }
  return sheet;
}

export function toClientBoxType(record: DbBoxType): ClientBoxType {
  const sheetMap = new Map(record.sheets.map((sheet) => [sheet.sheetKey, sheet]));

  for (const key of REQUIRED_KEYS) {
    if (!sheetMap.has(key)) {
      throw new Error(`Box type "${record.name}" is missing required sheet "${key}"`);
    }
  }

  return {
    id: record.id,
    name: record.name,
    description: record.description ?? undefined,
    boardDefinitionId: record.boardDefinitionId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    topSheet: requireSheet(sheetMap, "topSheet"),
    longSheet: requireSheet(sheetMap, "longSheet"),
    smallSheet: requireSheet(sheetMap, "smallSheet"),
    bottomSheet: toClientSheet(sheetMap.get("bottomSheet")),
    middleSheet: toClientSheet(sheetMap.get("middleSheet")),
  };
}

export function getBoxTypeSheetPayload(input: BoxTypeInput) {
  const allSheets: Array<{ sheetKey: SheetKey; sheet?: SheetWithSurfaces }> = [
    { sheetKey: "topSheet", sheet: input.topSheet },
    { sheetKey: "longSheet", sheet: input.longSheet },
    { sheetKey: "smallSheet", sheet: input.smallSheet },
    { sheetKey: "bottomSheet", sheet: input.bottomSheet },
    { sheetKey: "middleSheet", sheet: input.middleSheet },
  ];

  return allSheets
    .filter(
      (item): item is { sheetKey: SheetKey; sheet: SheetWithSurfaces } =>
        Boolean(item.sheet)
    )
    .map((item) => ({
      sheetKey: item.sheetKey,
      width: item.sheet.width,
      height: item.sheet.height,
      quantity: item.sheet.quantity,
      productionTimeMinutes: item.sheet.productionTimeMinutes,
      surfaces: item.sheet.surfaces.map((surface) => ({
        surfaceName: surface.surfaceName,
        requiresPrinting: surface.requiresPrinting,
        imageUrl: surface.imageUrl ?? null,
        imageColor: surface.imageColor ?? null,
      })),
    }));
}