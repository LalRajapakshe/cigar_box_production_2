import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getSandingOutsideReadyForPaymentsReport
} from "@/lib/services/sandingOutsideReadyForPaymentsService";

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
      await getSandingOutsideReadyForPaymentsReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "SANDING OUTSIDE READY FOR PAYMENTS ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Sanding Outside Ready For Payments Report"
      },
      {
        status: 500
      }
    );

  }

}