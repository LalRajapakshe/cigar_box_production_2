import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getUtpPcOrdersYearlyComparisonReport
} from "@/lib/services/utpPcOrdersYearlyComparisonService";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: NextRequest
) {

  try {

    const searchParams =
      request.nextUrl.searchParams;

    const year =
      searchParams.get("year") || "";

    const data =
      await getUtpPcOrdersYearlyComparisonReport(
        year
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "UTP PC ORDERS YEARLY COMPARISON ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load UTP PC Orders Yearly Comparison Report"
      },
      {
        status: 500
      }
    );

  }

}