"use client";

import { useEffect, useMemo, useState } from "react";
import { boardService } from "@/lib/services/boardService";
import { boxTypeService } from "@/lib/services/boxTypeService";
import { API_BASE } from "@/lib/apiBase";
//import { materialService } from "@/lib/services/materialService";
//import { orderService } from "@/lib/services/orderService";
//, MaterialDefinition 
import type { BoardDefinition, BoxType} from "@/lib/types/master-data";
import type { Order, OrderFormValues, OrderStatus } from "@/lib/types/order";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

const primaryButtonClassName = "primary-btn";

const dangerButtonClassName =
  "rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100";

const initialForm: OrderFormValues = {
  salesOrderDetailId: 0,
  boxTypeId: "",
  quantity: 1,
  orderDate: "",
  deliveryDate: "",
 // materialOverrideId: "",
 // notes: "",
  status: "draft",
  usdRatePerBox: 0,
  usdToLkrRate: 0,
  lkrRatePerBox: 0,
};

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "planned":
      return "Planned";
    case "inProduction":
      return "In Production";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

function getStatusClassName(status: OrderStatus): string {
  switch (status) {
    case "draft":
      return "status-badge status-neutral";
    case "planned":
      return "status-badge status-info";
    case "inProduction":
      return "status-badge status-warn";
    case "completed":
      return "status-badge status-success";
    default:
      return "status-badge status-neutral";
  }
}

function getIncludedSheets(boxType: BoxType): string[] {
  const sheets = ["Top Sheet", "Long Sheet", "Small Sheet"];

  if (boxType.bottomSheet) sheets.push("Bottom Sheet");
  if (boxType.middleSheet) sheets.push("Middle Sheet");

  return sheets;
}

function getPrintableSurfaceCount(boxType: BoxType): number {
  return (
    boxType.topSheet.surfaces.filter((item) => item.requiresPrinting).length +
    boxType.longSheet.surfaces.filter((item) => item.requiresPrinting).length +
    boxType.smallSheet.surfaces.filter((item) => item.requiresPrinting).length +
    (boxType.bottomSheet?.surfaces.filter((item) => item.requiresPrinting).length ?? 0) +
    (boxType.middleSheet?.surfaces.filter((item) => item.requiresPrinting).length ?? 0)
  );
}

export default function OrderInputForm() {
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  //const [materials, setMaterials] = useState<MaterialDefinition[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

const [salesOrders, setSalesOrders] = useState<any[]>([]);
const [nextOrderNo, setNextOrderNo] = useState("");

  const [form, setForm] = useState<OrderFormValues>(initialForm);
  const [loading, setLoading] = useState(true);
    const [savingBoard, setSavingBoard] = useState(false); 

  const selectedBoxType = useMemo(
    () => boxTypes.find((item) => item.id === form.boxTypeId),
    [boxTypes, form.boxTypeId]
  );

  const selectedBoard = useMemo(() => {
    if (!selectedBoxType) return null;
    return boards.find((item) => item.id === selectedBoxType.boardDefinitionId) ?? null;
  }, [boards, selectedBoxType]);

//  const selectedMaterial = useMemo(
//    () => materials.find((item) => item.id === (form.materialOverrideId || undefined)) ?? null,
//    [materials, form.materialOverrideId]
//  );

  const selectedIncludedSheets = useMemo(
    () => (selectedBoxType ? getIncludedSheets(selectedBoxType) : []),
    [selectedBoxType]
  );

  const selectedPrintableSurfaceCount = useMemo(
    () => (selectedBoxType ? getPrintableSurfaceCount(selectedBoxType) : 0),
    [selectedBoxType]
  );
/*
  const loadData = async () => {
    setLoading(true);

    const [boxTypeData, boardData, materialData, orderData] = await Promise.all([
      boxTypeService.getAll(),
      boardService.getAll(),
      materialService.getAll(),
      orderService.getAll(),
    ]);

    setBoxTypes(boxTypeData);
    setBoards(boardData);
    setMaterials(materialData);
    setOrders(orderData);
    setLoading(false);
  };
*/
const loadData = async () => {
  setLoading(true);

const [
  boxTypeData,
  boardData,
  orderResponse,
  salesOrderResponse,
  orderNoResponse
] = await Promise.all([
  boxTypeService.getAll(),
  boardService.getAll(),
  fetch(`${API_BASE}/orders`),
  fetch(`${API_BASE}/orders/sales-orders`),
  fetch(`${API_BASE}/orders/next-order-no`)
]);

const salesOrderData =
  await salesOrderResponse.json();

const orderNoData =
  await orderNoResponse.json();

setSalesOrders(salesOrderData);
setNextOrderNo(orderNoData.orderNo);

 // const [boxTypeData, boardData, orderResponse] = await Promise.all([
 //   boxTypeService.getAll(),
 //   boardService.getAll(),
 //   fetch(`${API_BASE}/orders`),
 // ]);

  const orderData = await orderResponse.json();

  setBoxTypes(boxTypeData);
  setBoards(boardData);
  setOrders(orderData);

  setLoading(false);
};

  useEffect(() => {
    void loadData();
  }, []);
/*
  const handleCreate = async () => {
    if (!form.boxTypeId) return;
    if (form.quantity <= 0) return;
    if (!form.orderDate) return;
    if (!form.deliveryDate) return;

    await orderService.create({
      boxTypeId: form.boxTypeId,
      quantity: form.quantity,
      orderDate: form.orderDate,
      deliveryDate: form.deliveryDate,
      materialOverrideId: form.materialOverrideId || undefined,
      notes: form.notes?.trim() || undefined,
      status: form.status ?? "draft",
    });

    setForm(initialForm);
    await loadData();
  };
*/
const handleCreate = async () => {
  if (!form.boxTypeId) return;
  if (form.quantity <= 0) return;
  if (!form.orderDate) return;
  if (!form.deliveryDate) return;
try {
  setSavingBoard(true);
  const selectedBox = boxTypes.find(
    (item) => item.id === form.boxTypeId
  );

  if (!selectedBox) return;

  await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      salesOrderDetailId: form.salesOrderDetailId,
      boxTypeId: form.boxTypeId,
      boardTypeId: selectedBox.boardDefinitionId,
      quantity: form.quantity,
      orderDate: form.orderDate,
      deliveryDate: form.deliveryDate,
      usdRatePerBox: form.usdRatePerBox,
      usdToLkrRate: form.usdToLkrRate,
      lkrRatePerBox: form.lkrRatePerBox,
      status: form.status ?? "PENDING",
      
    }),
  });

  setForm(initialForm);
  await loadData();
} finally {
    setSavingBoard(false);
  }
};

 // const handleDelete = async (id: string) => {
 //   await orderService.remove(id);
 //   await loadData();
 // };
const handleDelete = async (id: string) => {
  await fetch(`/api/orders/${id}`, {
    method: "DELETE",
  });

  await loadData();
};

useEffect(() => {
  const usdRate = form.usdRatePerBox ?? 0;

  const exchangeRate = 302.5;

  setForm((prev) => ({
    ...prev,
    usdToLkrRate: exchangeRate,
    lkrRatePerBox: Number(
      (usdRate * exchangeRate).toFixed(2)
    ),
  }));
}, [form.usdRatePerBox]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="status-badge status-info mb-3">Production Ticket Setup</div>
              <h2 className="text-2xl font-bold text-slate-900">Create Order</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Create a production order by selecting a box recipe, setting quantity and dates,
                and optionally applying a Board Type for the demonstration workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">Box Types</div>
                <div className="mt-2 text-lg font-bold text-slate-900">{boxTypes.length}</div>
              </div>
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">Orders</div>
                <div className="mt-2 text-lg font-bold text-slate-900">{orders.length}</div>
              </div>
              <div className="soft-card min-w-[150px]">
                <div className="text-xs uppercase tracking-wide text-slate-500">Draft Status</div>
                <div className="mt-2">
                  <span className={getStatusClassName(form.status ?? "draft")}>
                    {formatStatusLabel(form.status ?? "draft")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Order Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Select the production recipe, quantity, due dates, Board Type, and status.
                </p>
              </div>
{/* ========================   */}
<div className="rounded-xl border border-slate-200 bg-white p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Order No
  </label>

  <input
    value={nextOrderNo}
    readOnly
    className={inputClassName}
  />
</div>
 {/* ========================   */}

 
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
 {/* ========================   */}
<label className="mb-2 block text-sm font-medium text-slate-700">
  Sales Order
</label>

<select
  value={form.salesOrderDetailId ?? ""}
  onChange={async (e) => {

    const salesOrderId =
      Number(e.target.value);

    if (!salesOrderId) {
      return;
    }

    const response =
      await fetch(
        `${API_BASE}/orders/sales-orders/${salesOrderId}`
      );

    const details =
      await response.json();

    setForm((prev) => ({
      ...prev,

      salesOrderDetailId:
        salesOrderId,

      boxTypeId:
        details.boxTypeId,

      quantity:
        details.quantity,

      usdRatePerBox:
        details.usdRatePerBox,
    }));
  }}
  className={inputClassName}
>
  <option value="">
    Select Sales Order
  </option>

  {salesOrders.map((item) => (
    <option
      key={item.value}
      value={item.value}
    >
      {item.text}
    </option>
  ))}
</select>

<div className="rounded-xl border border-slate-200 bg-white p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Quantity
  </label>

  <input
    type="number"
    value={form.quantity}
    readOnly
    className={inputClassName}
  />

  <p className="mt-2 text-xs text-slate-500">
    Loaded automatically from ERP Sales Order.
  </p>
</div>
 {/*}
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Box Type
                  </label>
                  <select
                    value={form.boxTypeId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, boxTypeId: e.target.value }))
                    }
                    className={inputClassName}
                  >

                    <option value="">Select box type</option>
                    {boxTypes.map((boxType) => (
                      <option key={boxType.id} value={boxType.id}>
                        {boxType.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Choose the box recipe used for this production order.
                  </p>  */}
                </div>

{/*}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        quantity: parseNumber(e.target.value),
                      }))
                    }
                    className={inputClassName}
                    placeholder="Enter quantity"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Number of finished boxes required for this job ticket.
                  </p>
                </div>
*/}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={form.orderDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, orderDate: e.target.value }))
                    }
                    className={inputClassName}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Date when the order is captured into the system.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={form.deliveryDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, deliveryDate: e.target.value }))
                    }
                    className={inputClassName}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Requested delivery or production completion date.
                  </p>
                </div>
<div className="rounded-xl border border-slate-200 bg-white p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    USD Rate Per Box
  </label>

  <input
    type="number"
    step="0.01"
    value={form.usdRatePerBox ?? 0}
    readOnly
    className={inputClassName}
  />

  <p className="mt-2 text-xs text-slate-500">
    Loaded automatically from ERP Sales Order.
  </p>
</div>           
{/*}
<div className="rounded-xl border border-slate-200 bg-white p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    USD Rate Per Box
  </label>

  <input
    type="number"
    step="0.01"
    value={form.usdRatePerBox ?? 0}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        usdRatePerBox: parseNumber(e.target.value),
      }))
    }
    className={inputClassName}
    placeholder="USD Rate"
  />

  <p className="mt-2 text-xs text-slate-500">
    Export selling rate per finished box in USD.
  </p>
</div>
*/}

<div className="rounded-xl border border-slate-200 bg-white p-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    LKR Rate Per Box
  </label>

  <input
    type="number"
    value={form.lkrRatePerBox ?? 0}
    className={inputClassName}
    readOnly
  />

  <p className="mt-2 text-xs text-slate-500">
    Automatically converted using USD exchange rate.
  </p>
</div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={form.status ?? "draft"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as OrderStatus,
                      }))
                    }
                    className={inputClassName}
                  >
                    <option value="draft">Draft</option>
                    <option value="planned">Planned</option>
                    <option value="inProduction">In Production</option>
                    <option value="completed">Completed</option>
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Select the current lifecycle stage of the order.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add optional comments, client notes, or production instructions.
                </p>
              </div>

              <textarea
                value={form.notes ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                className={inputClassName}
                rows={5}
                placeholder="Optional production notes"
              />
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreate}
                disabled={savingBoard}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                //className={primaryButtonClassName}
              >
                 {savingBoard ? "Saving..." : "Create Order"}
              </button>

              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="secondary-btn"
              >
                Reset Form
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Box Type Summary
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Live overview of the selected recipe for this order.
                </p>
              </div>

              {!selectedBoxType ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <div className="text-sm font-medium text-slate-700">
                    No box type selected
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Select a box type to display the recipe summary.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="soft-card">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Box Type
                    </div>
                    <div className="mt-2 font-semibold text-slate-900">
                      {selectedBoxType.name}
                    </div>
                  </div>

                  <div className="soft-card">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Board
                    </div>
                    <div className="mt-2 font-semibold text-slate-900">
                      {selectedBoard
                        ? `${selectedBoard.name} (${selectedBoard.width} x ${selectedBoard.height})`
                        : "No board found"}
                    </div>
                  </div>

                  <div className="soft-card">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Included Sheets
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedIncludedSheets.map((sheet) => (
                        <span key={sheet} className="status-badge status-neutral">
                          {sheet}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="soft-card">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Printable Surfaces
                    </div>
                    <div className="mt-2 font-semibold text-slate-900">
                      {selectedPrintableSurfaceCount}
                    </div>
                  </div>

                  <div className="soft-card">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                     Board Type   
                    </div>
                    <div className="mt-2 font-semibold text-slate-900">
                     {selectedBoard?.name ?? "Using selected board"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Demonstration Guidance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Select a recipe with printable surfaces to show planning impact.</li>
                <li>• Use delivery dates to explain production prioritization.</li>
                <li>• Show how status changes reflect the production lifecycle.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Existing Orders</h3>
            <p className="mt-1 text-sm text-slate-500">
              Review previously created production orders and their current status.
            </p>
          </div>

          <div className="status-badge status-neutral">
            Total Orders: {orders.length}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-sm font-medium text-slate-700">
              No orders created yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create an order above to demonstrate the production flow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {orders.map((order) => {
              const orderBoxType =
                boxTypes.find((boxType) => boxType.id === order.boxTypeId) ?? null;
              const orderBoard = orderBoxType
                ? boards.find((board) => board.id === orderBoxType.boardDefinitionId) ?? null
                : null;
              //const orderMaterial =
              //  materials.find((material) => material.id === order.materialOverrideId) ?? null;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">
                          {orderBoxType?.name ?? "Unknown Box Type"}
                        </h4>
                        <span className={getStatusClassName(order.status)}>
                          {formatStatusLabel(order.status)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Delivery Date: {order.deliveryDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(order.id)}
                      className={dangerButtonClassName}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Quantity
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {order.quantity}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Order Date
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {order.orderDate}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Board
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {orderBoard?.name ?? "-"}
                      </div>
                    </div>



                    <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Notes
                      </div>
                      <div className="mt-2 font-medium text-slate-900">
                        {order.notes ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
