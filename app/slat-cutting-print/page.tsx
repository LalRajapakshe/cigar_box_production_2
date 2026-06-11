"use client";

import { Suspense } from "react";
import SlatCuttingPageContent
from "./SlatCuttingPageContent";

export const dynamic = "force-dynamic";

export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SlatCuttingPageContent />
    </Suspense>
  );

}