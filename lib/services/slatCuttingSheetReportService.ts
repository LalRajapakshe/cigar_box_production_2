import { API_BASE } from "../apiBase";

export interface SlatCuttingReport {
  header: any;
  stockStatus: any[];
  slatDetails: any[];
  polyDetails: any[];
  forecastBoards: number;
}

export const slatCuttingSheetReportService = {
  async getReport(planningId: number) {
    const response = await fetch(
      `${API_BASE}/cigar-b-rpt-slat-cutting-sheet?planningId=${planningId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load report");
    }

    return response.json();
  },
};