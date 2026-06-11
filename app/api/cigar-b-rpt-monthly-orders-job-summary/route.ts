import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getMonthlyOrdersJobSummaryReport
} from "@/lib/services/monthlyOrdersJobSummaryService";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
) {

  try {

    const searchParams =
      request.nextUrl.searchParams;

    const fromDate =
      searchParams.get("fromDate") || "";

    const toDate =
      searchParams.get("toDate") || "";

    const data =
      await getMonthlyOrdersJobSummaryReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "MONTHLY ORDERS JOB SUMMARY ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Monthly Orders And Job Summary"
      },
      {
        status: 500
      }
    );

  }

}