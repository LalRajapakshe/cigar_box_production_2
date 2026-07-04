import { API_BASE } from "../apiBase";
import type { Order, OrderInput } from "../types/order";

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders`,
  {
    cache: "no-store",
  });

    if (!response.ok) {
      throw new Error("Failed to load orders");
    }

    return response.json();
  },

  async getById(id: string): Promise<Order | null> {
    const response = await fetch(`/api/orders/${id}`,
  {
    cache: "no-store",
  });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  async create(input: OrderInput): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
  
    cache: "no-store",
  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  },

  async update(
    id: string,
    updates: Partial<OrderInput>
  ): Promise<Order> {
    const response = await fetch(`/api/orders/${id}`, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update order");
    }

    return response.json();
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`/api/orders/${id}`, {
      cache: "no-store",
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }
  },
};