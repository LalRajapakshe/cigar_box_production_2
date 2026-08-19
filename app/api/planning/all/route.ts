import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const planning =
      await prisma.productionPlanning.findMany({
        include: {
          order: true,
          parts: true,
        },

        orderBy: {
          id: "desc",
        },
      });

const planningDisplay = await prisma.$queryRaw<
  Array<{
    value: number;
    text: string;
  }>
>`
  SELECT DISTINCT
      P.id AS value,
      COALESCE(P.planningNo, '') +
      ' - ' +
      COALESCE(B.name, '') +
      ' - ' +
      COALESCE(H.PO_SO_DESCRIPTION, '') AS text
  FROM [ProductionPlanning] P
  INNER JOIN [Orders] O
      ON O.id = P.orderId
  INNER JOIN [BoxType] B
      ON B.id = O.boxTypeId
  INNER JOIN [PO_SO_DOC_DETAIL_W_A] D
      ON D.PO_SO_DET_ID = O.salesOrderDetailId
  INNER JOIN [PO_SO_DOC_HEADER_W_A] H
      ON H.PO_SO_HDR_ID = D.PO_SO_DET_HEADER_ID
`;

    const displayMap = new Map(
      planningDisplay.map((item) => [item.value, item.text])
    );

    const result = planning.map((item) => ({
      ...item,
      displayText: displayMap.get(item.id) ?? (
        `${item.planningNo} - ${item.order?.orderNo ?? ""}`
      ),
    }));

   return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load planning records",
      },
      {
        status: 500,
      }
    );
  }
}