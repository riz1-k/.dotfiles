"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchExcelInput() {
  const searchParmas = useSearchParams();
  const [search, setSearch] = useState(searchParmas.get("search") ?? "");
  const deboucedSearch = useDebounce(search, 500);
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard/inventory/add?search=" + deboucedSearch);
  }, [router, deboucedSearch]);

  return (
    <div className="py-2">
      <Input
        type="text"
        placeholder="Search by product name or salt composition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
