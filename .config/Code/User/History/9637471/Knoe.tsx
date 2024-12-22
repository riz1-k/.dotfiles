import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import CatalogTable from "./_components/CatalogTable";

export const metadata: Metadata = {
  title: "Catalog - Amed Health",
  description: "Manage your pharmacy products and prescription requests.",
  keywords: [
    "Amed Health",
    "inventory",
    "pharmacy",
    "healthcare management",
    "medical products",
  ],
};

export default function CatalogPage() {
  return (
    <section>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Catalog</h2>
        <Link
          href="/admin/dashboard/catalog/add"
          className={buttonVariants({
            size: "sm",
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>
      <CatalogTable />
    </section>
  );
}
