import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";

import { createERPItem } from "@/lib/server/erpItemService";

const BOARD_DEFINITION_ID = "cmnseza2u0000rg99kbi20x0w";

const EXCEL_PATH = "./data/BoxMaster.xlsx";

const LIMIT = null; // change to null after testing

const SURFACES = {
    topSheet: [
        {
            surfaceName: "Top Front",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
        {
            surfaceName: "Top Back",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
    ],

    longSheet: [
        {
            surfaceName: "Long Side Outer",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
        {
            surfaceName: "Long Side Inner",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
    ],

    smallSheet: [
        {
            surfaceName: "Small Side Outer",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
        {
            surfaceName: "Small Side Inner",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
    ],

    bottomSheet: [
        {
            surfaceName: "Bottom Front",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
        {
            surfaceName: "Bottom Back",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
    ],

    middleSheet: [
        {
            surfaceName: "Middle Front",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
        {
            surfaceName: "Middle Back",
            requiresPrinting: false,
            imageUrl: null,
            imageColor: null,
        },
    ],
};

type Sheet = {
    sheetKey:
        | "topSheet"
        | "bottomSheet"
        | "longSheet"
        | "smallSheet"
        | "middleSheet";

    width: number;

    height: number;

    quantity: number;
};

function readExcel() {

    const workbook = XLSX.readFile(EXCEL_PATH);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<any>(sheet, {
    defval: null,
});

console.log("Rows found:", rows.length);
console.log("First row:", rows[0]);
    return LIMIT
        ? rows.slice(0, LIMIT)
        : rows;
}
function toNumber(value: any): number {

    if (value === null || value === undefined || value === "") {
        return 0;
    }

    return Number(value);
}

function hasDimension(length: any, width: any) {

    return toNumber(length) > 0 && toNumber(width) > 0;
}
function getSheets(row: any): Sheet[] {

    const sheets: Sheet[] = [];

    const hasTop = hasDimension(
        row["Top_L"],
        row["Top_W"]
    );

    const hasBottom = hasDimension(
        row["Bottom_L"],
        row["Bottom_W"]
    );

    const hasLong = hasDimension(
        row["Long_L"],
        row["Long_W"]
    );

    const hasSmall = hasDimension(
        row["Short_L"],
        row["Short_W"]
    );

    const hasMiddle = hasDimension(
        row["Middle_L"],
        row["Middle_W"]
    );

    // --------------------
    // Top
    // --------------------

    if (hasTop) {

        sheets.push({

            sheetKey: "topSheet",

            width: toNumber(row["Top_W"]),

            height: toNumber(row["Top_L"]),

            quantity: hasBottom ? 1 : 2,
        });
    }

    // --------------------
    // Bottom
    // --------------------

    if (hasBottom) {

        sheets.push({

            sheetKey: "bottomSheet",

            width: toNumber(row["Bottom_W"]),

            height: toNumber(row["Bottom_L"]),

            quantity: 1,
        });
    }

    // --------------------
    // Long
    // --------------------

    if (hasLong) {

        sheets.push({

            sheetKey: "longSheet",

            width: toNumber(row["Long_W"]),

            height: toNumber(row["Long_L"]),

            quantity: 2,
        });
    }

    // --------------------
    // Small
    // --------------------

    if (hasSmall) {

        sheets.push({

            sheetKey: "smallSheet",

            width: toNumber(row["Short_W"]),

            height: toNumber(row["Short_L"]),

            quantity: 2,
        });
    }

    // --------------------
    // Middle
    // --------------------

    if (hasMiddle) {

        sheets.push({

            sheetKey: "middleSheet",

            width: toNumber(row["Middle_W"]),

            height: toNumber(row["Middle_L"]),

            quantity: 1,
        });
    }

    return sheets;
}

async function createSheetERPItems(
    boxName: string,
    sheetKey: string
) {

    const weight = await createERPItem({

        description: `${boxName}-${sheetKey}- Wgt`,

        groupCode: 22,

        controlTableCode: 37,

        defaultUnitId: 1,
    });

    const pcs = await createERPItem({

        description: `${boxName}-${sheetKey}- Pcs`,

        groupCode: 26,

        controlTableCode: 37,

        defaultUnitId: 3,
    });

    return {

        erpItemRefId: weight.erpItemRefId,

        erpItemRefIdPcs: pcs.erpItemRefId,
    };
}

async function importBox(row: any) {

    //-------------------------------------------------------
    // ITEM ID
    //-------------------------------------------------------

    const itemId = String(row["Item ID"] ?? "").trim();

    const boxType = String(row["Box Type"] ?? "").trim();

    if (!itemId) {
        throw new Error("Item ID is empty.");
    }

    //-------------------------------------------------------
    // DUPLICATE CHECK
    //-------------------------------------------------------

    const existing = await prisma.boxType.findFirst({
        where: {
            name: itemId,
        },
    });

    if (existing) {

        console.log(`⏭ Skipped : ${itemId}`);

        return {
            status: "skipped",
        };
    }

    //-------------------------------------------------------
    // BUILD SHEETS
    //-------------------------------------------------------

    const sheets = getSheets(row);

    if (!sheets.length) {
        throw new Error("No valid sheets found.");
    }

    //-------------------------------------------------------
    // CREATE ERP ITEM (BOX)
    //-------------------------------------------------------

    const boxERP = await createERPItem({
        description: itemId,
        groupCode: 14,
        controlTableCode: 36,
        defaultUnitId: 3,
    });

    //-------------------------------------------------------
    // CREATE ERP ITEMS FOR SHEETS
    //-------------------------------------------------------

const sheetERPMap = new Map<
    string,
    {
        erpItemRefId: any;
        erpItemRefIdPcs: any;
    }
>();

    for (const sheet of sheets) {

        const erp = await createSheetERPItems(
            itemId,
            sheet.sheetKey
        );

        sheetERPMap.set(
            sheet.sheetKey,
            erp
        );
    }

    //-------------------------------------------------------
    // DATABASE
    //-------------------------------------------------------

    await prisma.$transaction(async (tx) => {

        //---------------------------------------------
        // BOX TYPE
        //---------------------------------------------

        const box = await tx.boxType.create({

            data: {

                name: itemId,

                description: boxType,

                boardDefinitionId:
                    BOARD_DEFINITION_ID,

                erpItemRefId:
                    boxERP.erpItemRefId,
            },
        });

        //---------------------------------------------
        // CREATE SHEETS
        //---------------------------------------------

        for (const sheet of sheets) {

            const erp =
                sheetERPMap.get(sheet.sheetKey);

            if (!erp) {
                throw new Error(
                    `ERP Item missing for ${sheet.sheetKey}`
                );
            }

            const createdSheet =
                await tx.boxTypeSheet.create({

                    data: {

                        boxTypeId:
                            box.id,

                        sheetKey:
                            sheet.sheetKey,

                        width:
                            sheet.width,

                        height:
                            sheet.height,

                        quantity:
                            sheet.quantity,

                        productionTimeMinutes: 0,

                        polyBagWidthMm: 0,

                        polyBagHeightMm: 0,

                        polyethyleneWeightPer1000: 0,

                        erpItemRefId:
                            erp.erpItemRefId,

                        erpItemRefIdPcs:
                            erp.erpItemRefIdPcs,
                    },
                });

            //-----------------------------------------
            // SURFACES
            //-----------------------------------------

            const surfaces =
                SURFACES[sheet.sheetKey];

            for (const surface of surfaces) {

                await tx.surfaceSpec.create({

                    data: {

                        boxTypeSheetId:
                            createdSheet.id,

                        surfaceName:
                            surface.surfaceName,

                        requiresPrinting:
                            false,

                        imageUrl: null,

                        imageColor: null,
                    },
                });
            }

            //-----------------------------------------
            // BOX SHEET MAPPING
            //-----------------------------------------

            await tx.boxSheetMapping.create({

                data: {

                    boxTypeId:
                        box.id,

                    sheetType:
                        sheet.sheetKey,

                    quantityPerBox:
                        sheet.quantity,
                },
            });
        }

    });

    console.log(`✅ Imported : ${itemId}`);

    return {

        status: "imported",
    };
}

async function main() {

    console.log("----------------------------------------");
    console.log("Box Master Import Started");
    console.log("----------------------------------------");

    const rows = readExcel();

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        const itemId = String(
            row["Item ID"] ?? ""
        ).trim();

        if (!itemId) {
            continue;
        }

        console.log("");
        console.log(
            `[${i + 1}/${rows.length}] ${itemId}`
        );

        try {

            const result =
                await importBox(row);

            if (result.status === "imported") {
                imported++;
            }
            else {
                skipped++;
            }

        }
        catch (error: any) {

            failed++;

            console.error("");

            console.error(
                `❌ Failed : ${itemId}`
            );

            console.error(
                error?.message ?? error
            );

            console.error("");
        }
    }

    console.log("");
    console.log("----------------------------------------");
    console.log("Import Completed");
    console.log("----------------------------------------");

    console.log(`Imported : ${imported}`);
    console.log(`Skipped  : ${skipped}`);
    console.log(`Failed   : ${failed}`);

    console.log("----------------------------------------");
}

main()
    .catch((error) => {

        console.error(error);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });