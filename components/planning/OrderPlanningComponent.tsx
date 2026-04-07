"use client";

import { useEffect, useMemo, useState } from "react";
import { orderService } from "@/lib/services/orderService";
import { boxTypeService } from "@/lib/services/boxTypeService";
import { boardService } from "@/lib/services/boardService";
import type { BoxType, BoardDefinition } from "@/lib/types/master-data";
import type { Order } from "@/lib/types/order";
import type { OrderPlanningResult } from "@/lib/types/planning";
import { calculateOrderPlanning } from "@/lib/utils/calculationUtils";

const inputClassName =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

const cardClassName =
  "rounded-2xl bg-white p-6 shadow-md border border-gray-100";

export default function OrderPlanningComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [loading, setLoading] = useState(true);

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

    if (!selectedOrderId && orderData.length > 0) {
      setSelectedOrderId(orderData[0].id);
    }

    setLoading(false);
  };

  useEffect(() => {
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
    return (
      boards.find((item) => item.id === selectedBoxType.boardDefinitionId) ?? null
    );
  }, [boards, selectedBoxType]);

  const planningResult: OrderPlanningResult | null = useMemo(() => {
    if (!selectedOrder || !selectedBoxType || !selectedBoard) return null;

    return calculateOrderPlanning({
      order: selectedOrder,
      boxType: selectedBoxType,
      boardDefinition: selectedBoard,
    });
  }, [selectedOrder, selectedBoxType, selectedBoard]);

  return (
    <div className="space-y-6">
      <div className={cardClassName}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Order Planning</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select an order to calculate board usage, slats, pieces, and printing
            requirements.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading planning data...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">
            No orders available. Create an order first.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Select Order
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className={inputClassName}
              >
                <option value="">Select an order</option>
                {orders.map((order) => {
                  const boxType = boxTypes.find((item) => item.id === order.boxTypeId);

                  return (
                    <option key={order.id} value={order.id}>
                      {(boxType?.name ?? "Unknown Box Type")} - Qty {order.quantity} -{" "}
                      {order.deliveryDate}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedOrder && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                <div>
                  <span className="font-semibold">Order Quantity:</span>{" "}
                  {selectedOrder.quantity}
                </div>
                <div>
                  <span className="font-semibold">Order Date:</span>{" "}
                  {selectedOrder.orderDate}
                </div>
                <div>
                  <span className="font-semibold">Delivery Date:</span>{" "}
                  {selectedOrder.deliveryDate}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedOrder.status}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedBoxType && selectedBoard && (
        <div className={cardClassName}>
          <h3 className="text-lg font-semibold text-gray-900">
            Planning Source Details
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
            <div>
              <span className="font-medium text-gray-800">Box Type:</span>{" "}
              {selectedBoxType.name}
            </div>
            <div>
              <span className="font-medium text-gray-800">Board:</span>{" "}
              {selectedBoard.name}
            </div>
            <div>
              <span className="font-medium text-gray-800">Board Size:</span>{" "}
              {selectedBoard.width} x {selectedBoard.height}
            </div>
            <div>
              <span className="font-medium text-gray-800">Board Material ID:</span>{" "}
              {selectedBoard.materialId ?? "-"}
            </div>
          </div>
        </div>
      )}

      {planningResult && (
        <>
          <div className={cardClassName}>
            <h3 className="text-lg font-semibold text-gray-900">Planning Summary</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Active Sheets</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {planningResult.summary.activeSheetCount}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Total Pieces</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {planningResult.summary.totalPiecesRequired}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Total Slats</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {planningResult.summary.totalSlatsRequired}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Total Boards</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {planningResult.summary.totalBoardsRequired}
                </div>
              </div>
            </div>
          </div>

          {planningResult.warnings.length > 0 && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
              <h3 className="text-lg font-semibold text-yellow-900">Warnings</h3>
              <div className="mt-3 space-y-2">
                {planningResult.warnings.map((warning, index) => (
                  <div
                    key={`${warning.code}-${index}`}
                    className="rounded-lg border border-yellow-200 bg-white p-3 text-sm text-yellow-900"
                  >
                    <div className="font-medium">{warning.code}</div>
                    <div>{warning.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cardClassName}>
            <h3 className="text-lg font-semibold text-gray-900">
              Sheet Planning Details
            </h3>

            <div className="mt-4 space-y-4">
              {planningResult.sheetResults.map((sheet) => (
                <div
                  key={sheet.sheetKey}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">
                        {sheet.sheetLabel}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {sheet.isOptional ? "Optional Sheet" : "Required Sheet"}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      Piece Size: {sheet.pieceWidth} x {sheet.pieceHeight}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-3 lg:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Quantity per Box</div>
                      <div className="mt-1 font-semibold">
                        {sheet.quantityPerBox}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Order Quantity</div>
                      <div className="mt-1 font-semibold">{sheet.orderQuantity}</div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Total Pieces Required</div>
                      <div className="mt-1 font-semibold">
                        {sheet.totalPiecesRequired}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Board Size</div>
                      <div className="mt-1 font-semibold">
                        {sheet.boardWidth} x {sheet.boardHeight}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Pieces per Slat</div>
                      <div className="mt-1 font-semibold">
                        {sheet.piecesPerSlat}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Slats per Board</div>
                      <div className="mt-1 font-semibold">
                        {sheet.slatsPerBoard}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Pieces per Board</div>
                      <div className="mt-1 font-semibold">
                        {sheet.piecesPerBoard}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Total Slats Required</div>
                      <div className="mt-1 font-semibold">
                        {sheet.totalSlatsRequired}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Total Boards Required</div>
                      <div className="mt-1 font-semibold">
                        {sheet.totalBoardsRequired}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 md:col-span-2 lg:col-span-3">
                      <div className="text-gray-500">Printable Surfaces</div>
                      <div className="mt-1 font-semibold">
                        {sheet.printableSurfaces.length}
                      </div>

                      {sheet.printableSurfaces.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sheet.printableSurfaces.map((surface) => (
                            <span
                              key={surface.surfaceId}
                              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                            >
                              {surface.surfaceName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClassName}>
            <h3 className="text-lg font-semibold text-gray-900">
              Printable Surface Summary
            </h3>

            {planningResult.printableSurfaces.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                No printable surfaces found for the selected order.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {planningResult.printableSurfaces.map((surface) => (
                  <div
                    key={`${surface.sheetKey}-${surface.surfaceId}`}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {surface.surfaceName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sheet: {surface.sheetLabel}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        {surface.imageColor ?? "No color mode selected"}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      Image URL: {surface.imageUrl || "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}