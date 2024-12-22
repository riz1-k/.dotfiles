"use client";

import EmptyTable from "@/components/global/EmptyTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableBodySkeleton,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { type productsTable, type PRODUCT_STATUS } from "@/server/db/schema";
import { api } from "@/trpc/react";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import ProductDeleteDialog from "./ProductDeleteDialog";
import { useState } from "react";

export default function CatalogTable() {
  const productQuery = api.admin.product.getProducts.useQuery({});
  return (
    <Table className="max-h-[95vh] overflow-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>MRP</TableHead>
          <TableHead>Selling Price</TableHead>
          <TableHead>Prescription </TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productQuery.data?.map((product) => (
          <ProductRow product={product} key={product.id} />
        ))}
        {productQuery.isLoading && <TableBodySkeleton columns={9} rows={5} />}
        {productQuery.data?.length === 0 && (
          <EmptyTable
            title="No Products"
            description="You have not added any products yet."
            actionLabel="Add Product"
            icon="product"
            link="/admin/dashboard/inventory/add"
          />
        )}
      </TableBody>
    </Table>
  );
}

function ProductRow({
  product,
}: {
  product: typeof productsTable.$inferSelect;
}) {
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  return (
    <>
      <TableRow
        key={product.id}
        aria-disabled={product.status === "DELETED"}
        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.productName}</TableCell>
        <TableCell>{product.type}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(product.status)}>
            {product.status}
          </Badge>
        </TableCell>
        <TableCell>{product.mrp.toFixed(2)}</TableCell>
        <TableCell>{product.sellingPrice.toFixed(2)}</TableCell>
        <TableCell>{product.prescriptionRequired ? "Yes" : "No"}</TableCell>
        <TableCell>{formatDate(product.createdAt)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="secondary" size="icon">
                <DotsVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="pr-8">
                  <Link
                    href={`/admin/dashboard/inventory/edit/${product.id}`}
                    className="flex items-center"
                  >
                    <EditIcon className="mr-2 h-4 w-4" />
                    <span>Edit Product</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="pr-8"
                  onClick={() => setDeleteProductDialog(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete Product</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <ProductDeleteDialog
        id={product.id}
        open={deleteProductDialog}
        setOpen={setDeleteProductDialog}
      />
    </>
  );
}
function getStatusVariant(status: (typeof PRODUCT_STATUS)[number]) {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "DELETED":
      return "destructive";
    default:
      return "outline";
  }
}
