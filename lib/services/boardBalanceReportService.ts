import { API_BASE } from "../apiBase";

export const boardBalanceReportService = {
  async getReport(

  ) {
    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-board-balance`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load board balance report"
      );
    }

    return response.json();
  },
};