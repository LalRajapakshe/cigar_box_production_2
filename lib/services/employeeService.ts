export const employeeService = {
  async getAll() {
    const response = await fetch("/api/employees");

    if (!response.ok) {
      throw new Error("Failed to load employees");
    }

    return response.json();
  },
};