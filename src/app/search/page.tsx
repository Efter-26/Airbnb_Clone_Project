export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import ClientSearch from "./ClientSearch";

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading search…</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientSearch />
    </Suspense>
  );
}
