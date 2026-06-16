// app/api/cigar-b-rpt-utp-perimeter-range-summary/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getUTPPerimeterRangeSummary,
} from "@/lib/services/utpPerimeterRangeSummaryService";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: NextRequest
) {
  try {

    const fromDate =
      request.nextUrl.searchParams.get(
        "fromDate"
      ) || "";

    const toDate =
      request.nextUrl.searchParams.get(
        "toDate"
      ) || "";

    const data =
      await getUTPPerimeterRangeSummary(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load UTP Perimeter Range Summary",
      },
      {
        status: 500,
      }
    );
  }
}