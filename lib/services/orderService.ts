// Placeholder for order service
// lib/services/orderService.ts

import type { Order, OrderInput } from "../types/order";

const STORAGE_KEY = "cbp_orders";

const isBrowser = typeof window !== "undefined";

function readOrders(): Order[] {
  if (!isBrowser) return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function createTimestamp(): string {
  return new Date().toISOString();
}

function createId(): string {
  return crypto.randomUUID();
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    return readOrders();
  },

  async getById(id: string): Promise<Order | null> {
    const orders = readOrders();
    return orders.find((item) => item.id === id) ?? null;
  },

  async create(input: OrderInput): Promise<Order> {
    const now = createTimestamp();

    const newOrder: Order = {
      id: createId(),
      createdAt: now,
      updatedAt: now,
      ...input,
    };

    const orders = readOrders();
    const updated = [...orders, newOrder];
    writeOrders(updated);

    return newOrder;
  },

  async update(
    id: string,
    updates: Partial<OrderInput>
  ): Promise<Order> {
    const orders = readOrders();
    const index = orders.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Order with id "${id}" not found.`);
    }

    const updatedOrder: Order = {
      ...orders[index],
      ...updates,
      updatedAt: createTimestamp(),
    };

    orders[index] = updatedOrder;
    writeOrders(orders);

    return updatedOrder;
  },

  async remove(id: string): Promise<void> {
    const orders = readOrders();
    const filtered = orders.filter((item) => item.id !== id);
    writeOrders(filtered);
  },
};