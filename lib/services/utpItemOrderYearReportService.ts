import { API_BASE } from "../apiBase";

export const utpItemOrderYearReportService = {

  async getReport(year: string) {

    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-utp-item-order-year?year=${year}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load UTP item order report"
      );
    }

    return response.json();
  },
};