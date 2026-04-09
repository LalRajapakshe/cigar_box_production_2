"use client";

import { useEffect, useMemo, useState } from "react";
import OrderPlanningComponent from "@/components/planning/OrderPlanningComponent";
import { boardService } from "@/lib/services/boardService";
import { boxTypeService } from "@/lib/services/boxTypeService";
import { orderService } from "@/lib/services/orderService";
import { generateOrderPlanning } from "@/lib/utils/calculationUtils";
import type { BoardDefinition, BoxType } from "@/lib/types/master-data";
import type { Order } from "@/lib/types/order";

export default function PlanningPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [orderData, boxTypeData, boardData] = await Promise.all([
        orderService.getAll(),
        boxTypeService.getAll(),
        boardService.getAll(),
      ]);

      setOrders(orderData);
      setBoxTypes(boxTypeData);
      setBoards(boardData);

      if (orderData.length > 0) {
        setSelectedOrderId((prev) => prev || orderData[0].id);
      }

      setLoading(false);
    };

    void loadData();
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((item) => item.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const selectedBoxType = useMemo(() => {
    if (!selectedOrder) return null;
    return boxTypes.find((item) => item.id === selectedOrder.boxTypeId) ?? null;
  }, [boxTypes, selectedOrder]);

  const selectedBoard = useMemo(() => {
    if (!selectedBoxType) return null;
    return boards.find((item) => item.id === selectedBoxType.boardDefinitionId) ?? null;
  }, [boards, selectedBoxType]);

  const planningResult = useMemo(() => {
    if (!selectedOrder || !selectedBoxType || !selectedBoard) return null;

    return generateOrderPlanning({
      order: selectedOrder,
      boxType: selectedBoxType,
      boardDefinition: selectedBoard,
    });
  }, [selectedOrder, selectedBoxType, selectedBoard]);

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="page-hero">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="status-badge status-info mb-4">
                Planning Analysis
              </div>
              <h1 className="page-title">Planning</h1>
              <p className="page-subtitle">
                Generate a corrected production detail viewer based on order
                quantity, box recipe, board size, 1 mm cutting loss, and best-fit
                orientation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Input
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Order
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Input
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Box Recipe
                </div>
              </div>
              <div className="soft-card min-w-[160px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Output
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Production Report
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Select Order for Planning
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose the order that should generate the production detail viewer.
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading planning data...</p>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div className="text-sm font-medium text-slate-700">
                  No orders available
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Create an order first before using the planner.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    {orders.map((order) => {
                      const boxType = boxTypes.find(
                        (item) => item.id === order.boxTypeId
                      );

                      return (
                        <option key={order.id} value={order.id}>
                          {boxType?.name ?? "Unknown Box Type"} - Qty {order.quantity} -{" "}
                          {order.deliveryDate}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Box Type
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedBoxType?.name ?? "-"}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Board
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedBoard?.name ?? "-"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {planningResult ? (
            <OrderPlanningComponent result={planningResult} />
          ) : !loading && orders.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="text-sm font-medium text-slate-700">
                Planning data could not be generated
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Check whether the selected order, box type, and board are properly linked.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}