import { NextRequest, NextResponse } from "next/server";
import { getMonthlySaleOrderReport }
from "@/lib/services/monthlySaleOrderService";

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
      await getMonthlySaleOrderReport(
        fromDate,
        toDate
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load Monthly Sale Order Report"
      },
      {
        status: 500
      }
    );

  }

}