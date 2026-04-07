import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cigar Box Production System",
  description: "Production planning and master settings system",
};

const navLinkClassName =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
              <div className="min-w-0">
                <Link href="/" className="block">
                  <div className="text-lg font-bold tracking-tight text-slate-900">
                    Cigar Box Production System
                  </div>
                  <div className="text-xs text-slate-500">
                    Planning, Recipes, and Order Preparation
                  </div>
                </Link>
              </div>

              <nav className="hidden items-center gap-2 md:flex">
                <Link href="/" className={navLinkClassName}>
                  Home
                </Link>
                <Link href="/master-settings" className={navLinkClassName}>
                  Master Settings
                </Link>
                <Link href="/orders" className={navLinkClassName}>
                  Orders
                </Link>
                <Link href="/planning" className={navLinkClassName}>
                  Planning
                </Link>
              </nav>

              <div className="hidden items-center gap-3 md:flex">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Demo Mode
                </span>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-700">
                    Demo User
                  </div>
                  <div className="text-xs text-slate-500">{today}</div>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}