export const boardBalanceReportService = {
  async getReport(
    fromDate: string,
    toDate: string
  ) {
    const response = await fetch(
      `/api/cigar-b-rpt-board-balance?fromDate=${fromDate}&toDate=${toDate}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load board balance report"
      );
    }

    return response.json();
  },
};