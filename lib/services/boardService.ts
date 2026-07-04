import type {
  BoardDefinition,
  BoardDefinitionInput,
} from "../types/master-data";
import { API_BASE } from "@/lib/apiBase";

export const boardService = {
async getAll(): Promise<BoardDefinition[]> {
  const res = await fetch(`${API_BASE}/master-settings/boards`,
  {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Boards API failed:", res.status, text);
    throw new Error(`Failed to load boards. Status: ${res.status}. ${text}`);
  }

  return res.json();
},

  async getById(id: string): Promise<BoardDefinition | null> {
    const res = await fetch(`${API_BASE}/master-settings/boards/${id}`,
  {
    cache: "no-store",
  });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load board.");
    return res.json();
  },

  async create(input: BoardDefinitionInput): Promise<BoardDefinition> {
    const res = await fetch(`${API_BASE}/master-settings/boards`, {
     cache: "no-store",
  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error("Failed to create board.");
    return res.json();
  },

  async update(
    id: string,
    updates: Partial<BoardDefinitionInput>
  ): Promise<BoardDefinition> {
    const res = await fetch(`${API_BASE}/master-settings/boards/${id}`, {
  
    cache: "no-store",
  
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update board.");
    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/master-settings/boards/${id}`, {
  
    cache: "no-store",
  
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete board.");
  },
};