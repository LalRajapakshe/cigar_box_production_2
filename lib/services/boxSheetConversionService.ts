import { API_BASE } from "@/lib/apiBase";

export const boxSheetConversionService = {
  async getInitialData() {
    const response = await fetch(
      `${API_BASE}/box-sheet-conversion`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load box conversion data"
      );
    }

    return response.json();
  },

  async getSheets(
    boxTypeId: string
  ) {
    const response = await fetch(
      `${API_BASE}/box-sheet-conversion?boxTypeId=${boxTypeId}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load sheets"
      );
    }

    return response.json();
  },

  async saveConversion(
    payload: any
  ) {
    const response = await fetch(
      `${API_BASE}/box-sheet-conversion`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to save conversion"
      );
    }

    return response.json();
  },
};