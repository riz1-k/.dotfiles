import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ExcelProductList from "./_components/ExcelProductList";
import SearchExcelInput from "./_components/SearchExcelInput";

export default function AddProductPage() {
  return (
    <section>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
        <Link
          href="/admin/dashboard/inventory/new"
          className={buttonVariants({
            size: "sm",
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Link>
      </div>
      <SearchExcelInput />
      <ExcelProductList />
    </section>
  );
}
