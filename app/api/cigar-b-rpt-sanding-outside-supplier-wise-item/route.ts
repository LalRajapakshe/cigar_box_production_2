// app/api/cigar-b-rpt-sanding-outside-job-wise-item/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getSandingOutsideJobWiseItem,
} from "@/lib/services/sandingOutsideSupplierWiseItemService";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: NextRequest
) {
  try {

    const asAtDate =
      request.nextUrl.searchParams.get(
        "asAtDate"
      ) || "";

    const rows =
      await getSandingOutsideJobWiseItem(
        asAtDate
      );

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load Sanding Outside Job Wise Item Report",
      },
      {
        status: 500,
      }
    );
  }
}