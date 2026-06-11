import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getSandingOutsideUncheckedReport
} from "@/lib/services/sandingOutsideUncheckedService";

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
      await getSandingOutsideUncheckedReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "SANDING OUTSIDE UNCHECKED ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Sanding Outside Unchecked Report"
      },
      {
        status: 500
      }
    );

  }

}