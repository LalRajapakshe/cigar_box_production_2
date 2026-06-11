import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getSalesOrderSummaryReport
} from "@/lib/services/salesOrderSummaryService";

export const dynamic =
  "force-dynamic";

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
      await getSalesOrderSummaryReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "SALES ORDER SUMMARY ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Sales Order Summary Report"
      },
      {
        status: 500
      }
    );

  }

}