// Placeholder for order types
// lib/types/order.ts

import type { BaseEntity } from "./master-data";

/**
 * Order domain types.
 *
 * Rules:
 * - Order references a BoxType
 * - Box dimensions/sheets do NOT live in the order
 * - Geometry comes from the selected BoxType recipe
 * - Material can optionally be overridden at order level
 */

export type OrderStatus =
  | "draft"
  | "planned"
  | "inProduction"
  | "completed";

export interface Order extends BaseEntity {
  orderNo?: string;
  boxTypeId: string;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  materialOverrideId?: string;
  notes?: string;
  status: OrderStatus;
}

export type OrderInput = Omit<Order, keyof BaseEntity>;

export interface OrderFormValues {
  boxTypeId: string;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  materialOverrideId?: string;
  notes?: string;
  status?: OrderStatus;
  usdRatePerBox?: number;
  usdToLkrRate?: number;
  lkrRatePerBox?: number;
}