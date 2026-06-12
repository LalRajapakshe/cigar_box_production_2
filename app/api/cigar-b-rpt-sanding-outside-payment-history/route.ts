import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getSandingOutsidePaymentHistoryReport
} from "@/lib/services/sandingOutsidePaymentHistoryService";

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
      await getSandingOutsidePaymentHistoryReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "SANDING OUTSIDE PAYMENT HISTORY ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Sanding Outside Payment History"
      },
      {
        status: 500
      }
    );

  }

}