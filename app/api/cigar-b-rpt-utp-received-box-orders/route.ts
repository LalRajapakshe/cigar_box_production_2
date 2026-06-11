import { NextRequest, NextResponse } from "next/server";
import {
  getUtpReceivedBoxOrdersReport
} from "@/lib/services/utpReceivedBoxOrdersService";

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
      await getUtpReceivedBoxOrdersReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "UTP RECEIVED BOX ORDERS ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load UTP Received Box Orders Report"
      },
      {
        status: 500
      }
    );

  }

}