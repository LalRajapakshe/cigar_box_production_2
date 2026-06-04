"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/apiBase";

import { planningService } from "@/lib/services/planningService";
import { employeeService } from "@/lib/services/employeeService";
import { employeeUtilizationService } from "@/lib/services/employeeUtilizationService";

export default function EmployeeUtilizationPage() {
  const [plannings, setPlannings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [selectedPlanningId, setSelectedPlanningId] =
    useState<number | null>(null);

  const [rows, setRows] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const planningResponse = await fetch(`${API_BASE}/planning-list`);
        const planningData = await planningResponse.json();

        const employeeData =
          await employeeService.getAll();

        setPlannings(planningData);
        setEmployees(employeeData);

        if (planningData.length > 0) {
          setSelectedPlanningId(planningData[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const loadRows = async () => {
      if (!selectedPlanningId) return;

      try {
        const data =
          await employeeUtilizationService.getByPlanningId(
            selectedPlanningId
          );

        setRows(data);
      } catch (error) {
        console.error(error);
      }
    };

    void loadRows();
  }, [selectedPlanningId]);

  const selectedPlanning = useMemo(() => {
    return (
      plannings.find(
        (item) => item.id === selectedPlanningId
      ) ?? null
    );
  }, [plannings, selectedPlanningId]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        employeeId: "",
        workingHours: 0,
      },
    ]);
  };

  const handleRowChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const handleSave = async () => {
    if (!selectedPlanningId) return;

    try {
      setSaving(true);

      await employeeUtilizationService.save(
        selectedPlanningId,
        rows
      );

      alert("Employee utilization saved");
    } catch (error) {
      console.error(error);

      alert("Failed to save utilization");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container space-y-6">

        <section className="page-hero">
          <div>
            <div className="status-badge status-info mb-4">
              Production Tracking
            </div>

            <h1 className="page-title">
              Employee Utilization
            </h1>

            <p className="page-subtitle">
              Assign employees and working hours
              against production planning jobs.
            </p>
          </div>
        </section>

        <section className="section-card space-y-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Production Planning
            </label>

            <select
              value={selectedPlanningId ?? ""}
              onChange={(e) =>
                setSelectedPlanningId(Number(e.target.value))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2"
            >
              {plannings.map((planning) => (
                <option
                  key={planning.id}
                  value={planning.id}
                >
                  {planning.planningNo} | {planning.order?.orderNo}
                </option>
              ))}
            </select>
          </div>

          {selectedPlanning && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                <div>
                  <div className="text-xs text-slate-500">
                    Planning No
                  </div>

                  <div className="font-semibold">
                    {selectedPlanning.planningNo}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">
                    Order No
                  </div>

                  <div className="font-semibold">
                    {selectedPlanning.order?.orderNo}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">
                    Status
                  </div>

                  <div className="font-semibold">
                    {selectedPlanning.status}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">
                    Planned Qty
                  </div>

                  <div className="font-semibold">
                    {selectedPlanning.plannedQuantity}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Employee Hours
              </div>

              <button
                onClick={handleAddRow}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Add Employee
              </button>
            </div>

            <div className="space-y-3">

              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 md:grid-cols-2"
                >
                  <select
                    value={row.employeeId}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "employeeId",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-slate-300 px-4 py-2"
                  >
                    <option value="">
                      Select Employee
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.empId}
                        value={employee.empId}
                      >
                        {employee.empCode} - {employee.empName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.5"
                    value={row.workingHours}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "workingHours",
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-slate-300 px-4 py-2"
                    placeholder="Working Hours"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Utilization"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}