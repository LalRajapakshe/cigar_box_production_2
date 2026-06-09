import { API_BASE } from "../apiBase";

export const monthlyJobDataReportService = {

  async getReport(
    fromDate: string,
    toDate: string
  ) {

    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-monthly-job-data?fromDate=${fromDate}&toDate=${toDate}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load monthly job data report"
      );
    }

    return response.json();
  },
};