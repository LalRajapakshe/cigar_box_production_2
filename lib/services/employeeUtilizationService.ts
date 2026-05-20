export const employeeUtilizationService = {
  async getByPlanningId(planningId: number) {
    const response = await fetch(
      `/api/employee-utilization?planningId=${planningId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load utilization");
    }

    return response.json();
  },

  async save(planningId: number, rows: any[]) {
    const response = await fetch(
      "/api/employee-utilization",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          planningId,
          rows,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save utilization");
    }

    return response.json();
  },
};