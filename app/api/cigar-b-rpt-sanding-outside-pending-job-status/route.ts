import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  getSandingOutsidePendingJobStatusReport
} from "@/lib/services/sandingOutsidePendingJobStatusService";

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
      await getSandingOutsidePendingJobStatusReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "SANDING OUTSIDE PENDING JOB STATUS ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Sanding Outside Pending Job Status"
      },
      {
        status: 500
      }
    );

  }

}