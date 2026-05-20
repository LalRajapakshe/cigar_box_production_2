"use client";

import { useEffect, useMemo, useState } from "react";
import OrderPlanningComponent from "@/components/planning/OrderPlanningComponent";
import { boardService } from "@/lib/services/boardService";
import { boxTypeService } from "@/lib/services/boxTypeService";
import { orderService } from "@/lib/services/orderService";
import { generateOrderPlanning } from "@/lib/utils/calculationUtils";
import type { BoardDefinition, BoxType } from "@/lib/types/master-data";
import type { Order } from "@/lib/types/order";

import { planningService } from "@/lib/services/planningService";



export default function PlanningPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);


  
  //const [loading, setLoading] = useState(true);
   const [savedPlanning, setSavedPlanning] = useState<any>(null);
   const [planningStatus, setPlanningStatus] = useState("PLANNING");
   const [savingPlanning, setSavingPlanning] = useState(false);

   const [pendingStatus, setPendingStatus] = useState("");
   const [savingStatus, setSavingStatus] = useState(false);

   //const [remainingQty, setRemainingQty] = useState(0);
   //const [planningQty, setPlanningQty] = useState(0);
   //const [confirmedOrderId, setConfirmedOrderId] = 
   //                     useState<number | null>(null);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [orderData, boxTypeData, boardData] = await Promise.all([
        
        orderService.getAll(),
        boxTypeService.getAll(),
        boardService.getAll(),
      ]);
//console.log("orderData", orderData);
      setOrders(orderData);
      setBoxTypes(boxTypeData);
      setBoards(boardData);

      if (orderData.length > 0) {
        setSelectedOrderId((prev) => 
  prev ?? Number(orderData[0].id)
);
      }

      setLoading(false);
    };

    void loadData();
  }, []);

  const selectedOrder = useMemo(
    () => orders.find(
  (item) => Number(item.id) === selectedOrderId
     )?? null,
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


//console.log("selectedOrderId", selectedOrderId);
//console.log("orders", orders);
//console.log(
//  orders.map((o) => ({
//    id: o.id,
//    converted: Number(o.id),
//    type: typeof o.id,
//  }))
//);
//console.log(selectedBoxType);
//console.log(selectedBoard);
  const planningResult = useMemo(() => {
  if (savedPlanning?.parts?.length) {
    return {
      orderId: String(savedPlanning.orderId),
      boxTypeId: selectedBoxType?.id ?? "",
      boxTypeName: selectedBoxType?.name ?? "",
      boardDefinitionId: selectedBoard?.id ?? "",
      boardDefinitionName: selectedBoard?.name ?? "",

      originalOrderQuantity: selectedOrder?.quantity ?? 0,
      
      orderNo: selectedOrder?.orderNo ?? "",
      planningNo: savedPlanning?.planningNo,

      plannedProductionQuantity:
        savedPlanning.plannedQuantity,

      parts: savedPlanning.parts,

      printableSurfaces: [],

      summary: {
        totalParts: savedPlanning.totalParts,
        totalPiecesRequired:
          savedPlanning.totalPiecesRequired,
        totalSlatsRequired:
          savedPlanning.totalSlatsRequired,
        totalBoardsRequired:
          savedPlanning.totalBoardsRequired,
        totalPrintableSurfaceCount: 0,
        totalProductionTimeMinutes:
          savedPlanning.totalProductionTimeMinutes,
      },

      warnings: [],
    };
  }

  if (!selectedOrder || !selectedBoxType || !selectedBoard)
  {
    return null;
  }

  return generateOrderPlanning({
order: selectedOrder,
    boxType: selectedBoxType,
    boardDefinition: selectedBoard,
  });
}, [
  savedPlanning,
  selectedOrder,
  selectedBoxType,
  selectedBoard,
]);

     useEffect(() => {
            const loadPlanning = async () => {
              if (!selectedOrderId) {
                setSavedPlanning(null);
                return;
              }

              try {
                const planning = await planningService.getByOrderId(
                  selectedOrderId
                );

                setSavedPlanning(planning);

                if (planning?.status) {
                  setPlanningStatus(planning.status);
                  //setPendingStatus(planning.status);
                }
              } catch (error) {
                console.error(error);
                setSavedPlanning(null);
              }
            };
            void loadPlanning();
     }, [selectedOrderId]);


  const handleSavePlanning = async () => {
      if (!planningResult) return;

      try {
        setSavingPlanning(true);

        const saved = await planningService.savePlanning(planningResult);

        setSavedPlanning(saved);
        setPlanningStatus(saved.status);
      } catch (error) {
        console.error(error);
        alert("Failed to save planning");
      } finally {
        setSavingPlanning(false);
      }
  };
    const handleStatusChange = async (status: string) => {
      if (!savedPlanning) return;

      try {
        await planningService.updateStatus(
          savedPlanning.id,
          savedPlanning.orderId,
          status
        );

        setPlanningStatus(status);

        setSavedPlanning((prev: any) => ({
          ...prev,
          status,
        }));
      } catch (error) {
        console.error(error);
        alert("Failed to update status");
      }
    };
         const handleSaveStatus = async () => {
          if (!savedPlanning) return;

          try {
            setSavingStatus(true);

            await handleStatusChange(pendingStatus);
          } finally {
            setSavingStatus(false);
          }
        };
 // function handleSaveStatus(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
 //   throw new Error("Function not implemented.");
 // }

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
                    value={selectedOrderId ?? ""}
                    onChange={(e) => setSelectedOrderId(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    {orders.map((order) => {
                      const boxType = boxTypes.find(
                        (item) => item.id === order.boxTypeId
                      );

                      return (
                        <option key={order.id} value={order.id}>
                          {order.orderNo} - {boxType?.name ?? "Unknown Box Type"} - Qty {order.quantity}
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
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Production Planning
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Planning snapshot can be saved and tracked.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {savedPlanning ? (
                     <>
                    <select
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="COMPLETE">Complete</option>
                      <option value="REVERSE">Reverse</option>
                    </select>
                    
                      <button
                        onClick={handleSaveStatus}
                        disabled={
                          savingStatus ||
                          pendingStatus === planningStatus
                        }
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                      >
                        {savingStatus ? "Saving..." : "Save Status"}
                      </button>
                      </>
                  ) : (
                    <button
                      onClick={handleSavePlanning}
                      disabled={savingPlanning}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      {savingPlanning ? "Saving..." : "Save Planning"}
                    </button>
                  )}
                </div>
              </div>

              <OrderPlanningComponent result={planningResult} />
            </div>
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