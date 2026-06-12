import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getUtpItemOrderPatternReport
} from "@/lib/services/utpItemOrderPatternService";

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
      await getUtpItemOrderPatternReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "UTP ITEM ORDER PATTERN ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load UTP Item Order Pattern Report"
      },
      {
        status: 500
      }
    );

  }

}