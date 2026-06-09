import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const year =
      searchParams.get("year");

    if (!year) {

      return NextResponse.json(
        {
          message:
            "Year is required",
        },
        {
          status: 400,
        }
      );
    }

    const result: any[] =
      await prisma.$queryRawUnsafe(`
     SELECT

        B.name AS [Item Name] ,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 1
            THEN O.quantity
            ELSE 0
        END
    ) AS Jan,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 2
            THEN O.quantity
            ELSE 0
        END
    ) AS Feb,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 3
            THEN O.quantity
            ELSE 0
        END
    ) AS Mar,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 4
            THEN O.quantity
            ELSE 0
        END
    ) AS Apr,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 5
            THEN O.quantity
            ELSE 0
        END
    ) AS May,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 6
            THEN O.quantity
            ELSE 0
        END
    ) AS Jun,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 7
            THEN O.quantity
            ELSE 0
        END
    ) AS Jul,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 8
            THEN O.quantity
            ELSE 0
        END
    ) AS Aug,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 9
            THEN O.quantity
            ELSE 0
        END
    ) AS Sep,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 10
            THEN O.quantity
            ELSE 0
        END
    ) AS Oct,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 11
            THEN O.quantity
            ELSE 0
        END
    ) AS Nov,

    SUM(
        CASE
            WHEN MONTH(O.deliveryDate) = 12
            THEN O.quantity
            ELSE 0
        END
    ) AS Dec

FROM Orders O

INNER JOIN BoxType B
    ON O.boxTypeId = B.id

WHERE YEAR(O.deliveryDate) = ${year}

GROUP BY
    B.name

ORDER BY
    B.name;

      `);

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to load UTP item order report",
      },
      {
        status: 500,
      }
    );
  }
}