import { API_BASE } from "@/lib/apiBase";
export const employeeService = {
  async getAll() {
    const response = await fetch(`${API_BASE}/employees`);

    if (!response.ok) {
      throw new Error("Failed to load employees");
    }

    return response.json();
  },
};