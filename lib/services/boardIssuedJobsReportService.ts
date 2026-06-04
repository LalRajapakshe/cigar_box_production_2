export const boardIssuedJobsReportService = {

  async getReport(
    fromDate: string,
    toDate: string
  ) {
    const response = await fetch(
      `/api/cigar-b-rpt-board-issued-jobs?fromDate=${fromDate}&toDate=${toDate}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load board issued jobs report"
      );
    }

    return response.json();
  },
};