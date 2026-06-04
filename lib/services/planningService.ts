import { API_BASE } from "@/lib/apiBase";
export const planningService = {
  async getByOrderId(orderId: string | number) {
    const response = await fetch(`${API_BASE}/planning?orderId=${orderId}`);

    if (!response.ok) {
      throw new Error("Failed to load planning");
    }

    return response.json();
  },

  async savePlanning(payload: any) {
    const response = await fetch(`${API_BASE}/planning`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save planning");
    }

    return response.json();
  },

  async updateStatus(id: number, orderId: number, status: string) {
  //alert(`SERVICEAA: ${id} | ${orderId} | ${status}`);
  //console.log("SERVICE id =", id);
  //console.log("SERVICE orderId =", orderId);
  //console.log("SERVICE status =", status);
    const response = await fetch(`${API_BASE}/planning`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        orderId,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update planning status");
    }

    return response.json();
  },
};