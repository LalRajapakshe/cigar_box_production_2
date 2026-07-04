"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  boxSheetConversionService,
} from "@/lib/services/boxSheetConversionService";

export default function BoxSheetConversionPage() {
  const [
    stocks,
    setStocks,
  ] = useState<any[]>([]);

  const [
    locations,
    setLocations,
  ] = useState<any[]>([]);

  const [
    sheets,
    setSheets,
  ] = useState<any[]>([]);

  const [
    selectedStock,
    setSelectedStock,
  ] = useState<any>(null);

  const [
    conversionQty,
    setConversionQty,
  ] = useState(0);

  const [
    toLocationId,
    setToLocationId,
  ] = useState("");

  const [
    remarks,
    setRemarks,
  ] = useState("");

  useEffect(() => {
    const load =
      async () => {
        const data =
          await boxSheetConversionService.getInitialData();

        setStocks(
          data.stocks
        );

        setLocations(
          data.locations
        );
      };

    void load();
  }, []);

  useEffect(() => {
    const loadSheets =
      async () => {
        if (
          !selectedStock
        ) {
          setSheets([]);
          return;
        }

        const data =
          await boxSheetConversionService.getSheets(
            selectedStock.boxMasterId
          );

        setSheets(data);
      };

    void loadSheets();
  }, [
    selectedStock,
  ]);

  const handleSave =
    async () => {
      if (
        !selectedStock
      ) {
        alert(
          "Select box stock."
        );
        return;
      }

      if (
        conversionQty <=
        0
      ) {
        alert(
          "Enter conversion quantity."
        );
        return;
      }

      if (
        conversionQty >
        selectedStock.boxQuantity
      ) {
        alert(
          "Quantity exceeds available stock."
        );
        return;
      }

      if (
        !toLocationId
      ) {
        alert(
          "Select location."
        );
        return;
      }

      try {
        await boxSheetConversionService.saveConversion(
          {
            fromStockRefId:
              selectedStock.fromStockRefId,

            toLocationId:
              Number(
                toLocationId
              ),

            conversionDate:
              new Date(),

            boxTypeId:
              selectedStock.boxMasterId,

            conversionQty,

            remarks,
          }
        );

        alert(
          "Conversion saved successfully."
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Failed to save conversion."
        );
      }
    };

  return (
    <div className="page-shell">
      <div className="page-container">

        <section className="page-hero">
          <h1 className="page-title">
            Box Sheet Conversion
          </h1>

          <p className="page-subtitle">
            Convert finished boxes
            back into sheets.
          </p>
        </section>

        <section className="section-card space-y-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Box Stock
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={
                selectedStock
                  ?.fromStockRefId ??
                ""
              }
              onChange={(
                e
              ) => {
                const stock =
                  stocks.find(
                    (
                      x
                    ) =>
                      x.fromStockRefId ===
                      Number(
                        e.target.value
                      )
                  );

                setSelectedStock(
                  stock
                );

                setConversionQty(
                  0
                );
              }}
            >
              <option value="">
                Select Stock
              </option>

              {stocks.map(
                (
                  stock
                ) => (
                  <option
                    key={
                      stock.fromStockRefId
                    }
                    value={
                      stock.fromStockRefId
                    }
                  >
                    {
                      stock.boxItemName
                    }
                    {" - Qty "}
                    {
                      stock.boxQuantity
                    }
                  </option>
                )
              )}
            </select>

          </div>

          {selectedStock && (
            <>
              <div className="grid grid-cols-3 gap-4">

                <div>
                  Available Qty
                  <div className="rounded-xl border p-3">
                    {
                      selectedStock.boxQuantity
                    }
                  </div>
                </div>

                <div>
                  Convert Qty
                  <input
                    type="number"
                    value={
                      conversionQty
                    }
                    onChange={(
                      e
                    ) =>
                      setConversionQty(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div>
                  To Location
                  <select
                    value={
                      toLocationId
                    }
                    onChange={(
                      e
                    ) =>
                      setToLocationId(
                        e.target
                          .value
                      )
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="">
                      Select
                    </option>

                    {locations.map(
                      (
                        l
                      ) => (
                        <option
                          key={
                            l.value
                          }
                          value={
                            l.value
                          }
                        >
                          {
                            l.text
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th>
                      Sheet
                    </th>
                    <th>
                      Qty/Box
                    </th>
                    <th>
                      Converted Qty
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sheets.map(
                    (
                      row
                    ) => (
                      <tr
                        key={
                          row.sheetType
                        }
                      >
                        <td>
                          {
                            row.itemName
                          }
                        </td>

                        <td>
                          {
                            row.quantityPerBox
                          }
                        </td>

                        <td>
                          {Number(
                            row.quantityPerBox
                          ) *
                            conversionQty}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <textarea
                value={
                  remarks
                }
                onChange={(
                  e
                ) =>
                  setRemarks(
                    e.target
                      .value
                  )
                }
                placeholder="Remarks"
                className="w-full rounded-xl border p-3"
              />

              <button
                onClick={
                  handleSave
                }
                className="rounded-xl bg-slate-900 px-4 py-2 text-white"
              >
                Save Conversion
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}