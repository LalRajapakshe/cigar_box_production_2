import Link from "next/link";

const reportGroups = [
  {
    title: "Cigar Box Reports",
    reports: [
      {
        name: "Box Type Master Report",
        href: "/cigar-b-rpt-box-type-master",
      },
    //  {
     //   name: "Production Planning Report",
    //    href: "/cigar-box-reports/cigar-box/production-planning",
    //  },
      {
      name: "Board Balance Report",
      href: "/cigar-b-rpt-board-balance",
    },

    {
      name: "Board Issued for Jobs",
      href: "/cigar-b-rpt-board-issued-jobs",
    },

    {
      name: "Board Forecast Summary",
      href: "/cigar-b-rpt-board-forecast-summary",
    },

    {
      name: "Sanding Outside Pending Job Status",
      href: "/cigar-b-rpt-sanding-outside-pending-job-status",
    },

    {
      name: "Sanding Outside Unchecked",
      href: "/cigar-b-rpt-sanding-outside-unchecked",
    },

    {
      name: "Sanding Outside Ready for Payments",
      href: "/cigar-b-rpt-sanding-outside-ready-payments",
    },

       {
      name: "Monthly Job Data",
      href: "/cigar-b-rpt-monthly-job-data",
    },
    {
      name: "UTP Item Order Of The Year",
      href: "/cigar-b-rpt-utp-item-order-year",
    },
      {
      name: "Monthly Sales orders",
      href: "/cigar-b-rpt-sale-order",
    },
    {
      name: "UTP Received Box orders",
      href: "/cigar-b-rpt-utp-received-box-orders",
    },
        {
      name: "Sales Order Summary",
      href: "/cigar-b-rpt-sales-order-summary",
    },
            {
      name: "Monthly Order And Job Summary",
      href: "/cigar-b-rpt-monthly-orders-job-summary",
    },
            {
      name: "UTP Item Order Pattern",
      href: "/cigar-b-rpt-utp-item-order-pattern",
    },     
              {
      name: "UTP PC Order Year Comparison",
      href: "/cigar-b-rpt-utp-pc-orders-yearly-comparison",
    },  
              {
      name: "Sanding Outside Payment History",
      href: "/cigar-b-rpt-sanding-outside-payment-history",
    },
             {
      name: "Box Stock Balance Of Size",
      href: "/cigar-b-rpt-box-stock-balance-of-size",
    },
    {
      name: "Production Pending Orders",
      href: "/cigar-b-rpt-production-pending-orders",
    },
    ],
  },

  {
    title: "Employee Utilization Reports",
    reports: [
      {
        name: "Attendance Report",
        href: "/repcigar-box-reportsorts/employee-utilization/attendance",
      },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Reports
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Generate and print system reports.
        </p>
      </div>

      <div className="space-y-8">
        {reportGroups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              {group.title}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.reports
                 .filter(Boolean)
                  .map((report) => (
                <Link
                  key={report?.href}
                  href={report?.href  || "#"}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md"
                >
                  <div className="text-lg font-semibold text-slate-800">
                    {report.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}