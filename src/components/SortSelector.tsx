"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "recent";

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="inline-flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
      <span className="text-xs font-medium text-gray-500 pl-2">Ordenar:</span>
      <div className="flex gap-1">
        <button
          onClick={() => handleSortChange("recent")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            currentSort === "recent"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recientes
          </div>
        </button>
        <button
          onClick={() => handleSortChange("popular")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            currentSort === "popular"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Populares
          </div>
        </button>
      </div>
    </div>
  );
}
