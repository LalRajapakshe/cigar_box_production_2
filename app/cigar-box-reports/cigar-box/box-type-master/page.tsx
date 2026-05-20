import ReportLayout from "@/components/reports/ReportLayout";
import PrintButton from "@/components/reports/PrintButton";

const sampleData = [
  {
    name: "Classic Box",
    description: "Standard cigar box",
    top_width: 120,
    top_high: 80,
    bottom_width: 120,
    bottom_high: 80,
    long_width: 200,
    long_height: 70,
    short_width: 90,
    short_height: 70,
    middle_width: 100,
    middle_height: 50,
    print_available: true,
  },
];

export default function BoxTypeMasterReportPage() {
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-end">
        <PrintButton />
      </div>

      <ReportLayout title="Box Type Master Report">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Top</th>
                <th className="border p-2">Bottom</th>
                <th className="border p-2">Long</th>
                <th className="border p-2">Short</th>
                <th className="border p-2">Middle</th>
                <th className="border p-2">Print</th>
              </tr>
            </thead>

            <tbody>
              {sampleData.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>

                  <td className="border p-2">
                    {item.description}
                  </td>

                  <td className="border p-2 text-center">
                    {item.top_width} × {item.top_high}
                  </td>

                  <td className="border p-2 text-center">
                    {item.bottom_width} × {item.bottom_high}
                  </td>

                  <td className="border p-2 text-center">
                    {item.long_width} × {item.long_height}
                  </td>

                  <td className="border p-2 text-center">
                    {item.short_width} × {item.short_height}
                  </td>

                  <td className="border p-2 text-center">
                    {item.middle_width} × {item.middle_height}
                  </td>

                  <td className="border p-2 text-center">
                    {item.print_available ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportLayout>
    </div>
  );
}