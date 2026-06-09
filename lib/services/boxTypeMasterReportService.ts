import { API_BASE } from "../apiBase";

export const boxTypeMasterReportService = {

  async getReport() {

    const response =
      await fetch(
        `${API_BASE}/cigar-b-rpt-box-type-master`
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load report"
      );
    }

    return response.json();
  },
};