import { API_BASE } from "@/lib/apiBase";
import type {
  MaterialDefinition,
  MaterialDefinitionInput,
} from "../types/master-data";
  export const materialService = {
 async getAll(): Promise<MaterialDefinition[]> {
  const res = await fetch(`${API_BASE}/master-settings/materials`);

  if (!res.ok) {
    const text = await res.text(); 
    console.error("Materials API failed:", res.status, text);
    throw new Error(`Failed to load materials. Status: ${res.status}. ${text}`);
  }

  return res.json();
},
  async getById(id: string): Promise<MaterialDefinition | null> {
    const res = await fetch(`/api/master-settings/materials/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load material.");
    return res.json();
  },

  async create(input: MaterialDefinitionInput): Promise<MaterialDefinition> {
    const res = await fetch(`${API_BASE}/master-settings/materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error("Failed to create material.");
    return res.json();
  },

  async update(
    id: string,
    updates: Partial<MaterialDefinitionInput>
  ): Promise<MaterialDefinition> {
    const res = await fetch(`/api/master-settings/materials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update material.");
    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/master-settings/materials/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete material.");
  },
};