import {
  NextResponse
} from "next/server";

import {
  getBoxStockBalanceOfSizeReport
} from "@/lib/services/boxStockBalanceOfSizeService";

export const dynamic =
  "force-dynamic";

export async function GET() {

  try {

    const data =
      await getBoxStockBalanceOfSizeReport();

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "BOX STOCK BALANCE OF SIZE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Box Stock Balance Of Size Report"
      },
      {
        status: 500
      }
    );

  }

}