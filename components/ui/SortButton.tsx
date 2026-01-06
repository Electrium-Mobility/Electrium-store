"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChangeEvent } from "react";

export default function SortButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "name_asc";

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    
    // Push the new URL with the updated sort query parameter
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-[hsl(var(--text-secondary))]">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-2 text-sm text-[hsl(var(--text-primary))] shadow-sm focus:border-[hsl(var(--border-focus))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--border-focus))]"
      >
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A-Z</option>
        <option value="name_desc">Name: Z-A</option>
        <option value="date_desc">Newest</option>
        <option value="date_asc">Oldest</option>
      </select>
    </div>
  );
}