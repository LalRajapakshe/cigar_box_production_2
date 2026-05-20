interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ReportLayout({
  title,
  children,
}: Props) {
  return (
    <div className="bg-white p-6 print:p-0">
      <div className="mb-6 border-b border-slate-300 pb-4">
        <div className="text-2xl font-bold text-slate-800">
          Cigar Box Production System
        </div>

        <div className="mt-1 text-lg font-semibold text-slate-700">
          {title}
        </div>

        <div className="mt-2 text-sm text-slate-500">
          Generated Date:{" "}
          {new Date().toLocaleDateString("en-GB")}
        </div>
      </div>

      {children}
    </div>
  );
}