import { API_BASE } from "../apiBase";

export const productionPendingOrdersReportService = {

  async getReport() {

    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-production-pending-orders`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load production pending orders report"
      );
    }

    return response.json();
  },
};