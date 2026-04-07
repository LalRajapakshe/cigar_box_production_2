import type { BoxType, BoxTypeInput } from "../types/master-data";

export const boxTypeService = {
  async getAll(): Promise<BoxType[]> {
    const res = await fetch("/api/master-settings/box-types");

    if (!res.ok) {
      const text = await res.text();
      console.error("Box types API failed:", res.status, text);
      throw new Error(`Failed to load box types. Status: ${res.status}. ${text}`);
    }

    return res.json();
  },

  async getById(id: string): Promise<BoxType | null> {
    const res = await fetch(`/api/master-settings/box-types/${id}`);

    if (res.status === 404) return null;

    if (!res.ok) {
      const text = await res.text();
      console.error("Box type API failed:", res.status, text);
      throw new Error(`Failed to load box type. Status: ${res.status}. ${text}`);
    }

    return res.json();
  },

  async create(input: BoxTypeInput): Promise<BoxType> {
    const res = await fetch("/api/master-settings/box-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Create box type API failed:", res.status, text);
      throw new Error(`Failed to create box type. Status: ${res.status}. ${text}`);
    }

    return res.json();
  },

  async update(id: string, updates: Partial<BoxTypeInput>): Promise<BoxType> {
    const res = await fetch(`/api/master-settings/box-types/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Update box type API failed:", res.status, text);
      throw new Error(`Failed to update box type. Status: ${res.status}. ${text}`);
    }

    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/master-settings/box-types/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Delete box type API failed:", res.status, text);
      throw new Error(`Failed to delete box type. Status: ${res.status}. ${text}`);
    }
  },
};