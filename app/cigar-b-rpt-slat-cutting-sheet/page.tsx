"use client";

import {
  useState,
} from "react";

import {
  slatCuttingSheetReportService,
} from "@/lib/services/slatCuttingSheetReportService";

export default function Page() {

  const [
    planningId,
    setPlanningId,
  ] = useState("");

  const [
    report,
    setReport,
  ] = useState<any>();

  const loadReport =
    async () => {

      const data =
        await slatCuttingSheetReportService
          .getReport(
            Number(planningId)
          );

      setReport(data);
    };

  return (
    <div className="p-4">

      <h2>
        Slat Cutting Sheet
      </h2>

      <div className="mb-3">
        <input
          value={planningId}
          onChange={(e) =>
            setPlanningId(
              e.target.value
            )
          }
          placeholder="Planning Id"
        />

        <button
          onClick={loadReport}
        >
          Load
        </button>
      </div>

      {report && (

        <div
          id="printArea"
          className="bg-white p-4"
        >

          <h3 className="text-center">
            CIGAR BOX PRODUCTION SYSTEM
          </h3>

          <h4 className="text-center">
            SLAT CUTTING REPORT
          </h4>

          {/* HEADER */}

          {/* STOCK STATUS */}

          {/* RECTANGLE ROW */}

          {/* ATTRIBUTE MATRIX */}

          {/* FORECAST BOARDS */}

          {/* POLYTHENE */}

        </div>

      )}

    </div>
  );
}