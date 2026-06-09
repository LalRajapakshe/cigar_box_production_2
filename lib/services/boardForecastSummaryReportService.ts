import { API_BASE } from "../apiBase";
export const boardForecastSummaryReportService =
{
  async getReport(
    fromDate: string,
    toDate: string
  ) {
    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-board-forecast-summary?fromDate=${fromDate}&toDate=${toDate}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load board forecast summary report"
      );
    }

    return response.json();
  },
};