import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const result: any[] =
      await prisma.$queryRawUnsafe(`
        SELECT

    b.id,

    b.name,

    b.description,

    MAX(
        CASE
            WHEN s.sheetKey = 'topSheet'
            THEN s.width
        END
    ) AS top_width,

    MAX(
        CASE
            WHEN s.sheetKey = 'topSheet'
            THEN s.height
        END
    ) AS top_height,

    MAX(
        CASE
            WHEN s.sheetKey = 'longSheet'
            THEN s.width
        END
    ) AS long_width,

    MAX(
        CASE
            WHEN s.sheetKey = 'longSheet'
            THEN s.height
        END
    ) AS long_height,

    MAX(
        CASE
            WHEN s.sheetKey = 'smallSheet'
            THEN s.width
        END
    ) AS short_width,

    MAX(
        CASE
            WHEN s.sheetKey = 'smallSheet'
            THEN s.height
        END
    ) AS short_height,

    COUNT(
        CASE
            WHEN f.requiresPrinting = 'True'
            THEN f.id
        END
    ) AS print_available

FROM BoxType b

INNER JOIN BoxTypeSheet s
    ON b.id = s.boxTypeId

LEFT JOIN SurfaceSpec f
    ON f.boxTypeSheetId = s.id

GROUP BY

    b.id,
    b.name,
    b.description

ORDER BY
    b.name
      `);

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load box type master report",
      },
      {
        status: 500,
      }
    );
  }
}