"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProductSchema } from "@/lib/common-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type z } from "zod";
import { RichTextEditor } from "@/components/global/RichTextEditor";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_TYPE } from "@/server/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

type TFormData = z.infer<typeof updateProductSchema>;

export function EditProductForm() {
  const productId = useParams<{ id: string }>().id;
  const productData = api.admin.product.getProduct.useQuery(productId);
  const router = useRouter();

  const form = useForm<TFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  const updateProductMutation = api.admin.product.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      router.push("/admin/dashboard/inventory");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (productData.data) {
      console.log({ productData });
      form.reset({
        productName: productData.data.productName,
        sellingPrice: productData.data.sellingPrice,
        mrp: productData.data.mrp,
        description: productData.data.description,
        benefits: productData.data.benefits,
        ifMissedDose: productData.data.ifMissedDose,
        type: productData.data.type,
        introduction: productData.data.introduction,
        manufacturer: productData.data.manufacturer,
        medicineType: productData.data.medicineType,
        packaging: productData.data.packaging,
        package: productData.data.package,
        prescriptionRequired: productData.data.prescriptionRequired,
        safetyInformation: productData.data.safetyInformation,
        factBox: productData.data.factBox ?? undefined,
        ingredients: productData.data.ingredients ?? undefined,
        productId,
      });
    }
  }, [productData.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Editing the product details will be reflected in the customer page
          only after the product is approved.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={form.handleSubmit(
          (vals) => updateProductMutation.mutate(vals),
          console.log,
        )}
      >
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                placeholder="Enter your product name"
                autoComplete="business"
                {...form.register("productName")}
                error={form.formState.errors?.productName?.message}
              />
            </div>
            <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Product Type</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) =>
                    form.setValue(
                      "type",
                      value as (typeof PRODUCT_TYPE)[number],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPE.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="MRP"
                type="number"
                placeholder="Enter your selling price"
                step={0.01}
                {...form.register("mrp")}
                error={form.formState.errors?.mrp?.message}
              />
              <Input
                label="Selling Price"
                type="number"
                placeholder="Enter your selling price"
                step={0.01}
                {...form.register("sellingPrice")}
                max={form.watch("mrp")}
                error={form.formState.errors?.sellingPrice?.message}
              />
            </div>
            <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
              <Input
                label="Manufacturer"
                placeholder="Enter your manufacturer"
                {...form.register("manufacturer")}
                error={form.formState.errors?.manufacturer?.message}
              />
              <Input
                label="Medicine Type"
                placeholder="Enter your medicine type"
                {...form.register("medicineType")}
                error={form.formState.errors?.medicineType?.message}
              />
            </div>
            <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
              <Textarea
                label="Packaging"
                placeholder="Enter your packaging"
                {...form.register("packaging")}
                error={form.formState.errors?.packaging?.message}
              />
              <Textarea
                label="Package"
                placeholder="Enter your package"
                {...form.register("package")}
                error={form.formState.errors?.package?.message}
              />
            </div>
            <div
              aria-hidden={form.watch().type !== "DRUG"}
              className="flex items-center gap-2 aria-hidden:hidden"
            >
              <span>Prescription Required</span>
              <Switch
                checked={form.watch().prescriptionRequired}
                onCheckedChange={(checked) => {
                  form.setValue("prescriptionRequired", checked);
                }}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                title="Introduction"
                value={form.watch("introduction") ?? ""}
                onChange={(value) => form.setValue("introduction", value)}
                error={form.formState.errors?.introduction?.message}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                title="Description"
                value={form.watch("description") ?? ""}
                onChange={(value) => form.setValue("description", value)}
                error={form.formState.errors?.description?.message}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                title="Benefits"
                value={form.watch("benefits") ?? ""}
                onChange={(value) => form.setValue("benefits", value)}
                error={form.formState.errors?.benefits?.message}
              />
            </div>
            <div
              className="aria-hidden:hidden md:col-span-2"
              aria-hidden={form.watch().type === "OTC"}
            >
              <RichTextEditor
                title="If Missed Dose"
                value={form.watch("ifMissedDose") ?? ""}
                onChange={(value) => form.setValue("ifMissedDose", value)}
                error={form.formState.errors?.ifMissedDose?.message}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                title="Safety Information"
                value={form.watch("safetyInformation") ?? ""}
                onChange={(value) => form.setValue("safetyInformation", value)}
                error={form.formState.errors?.safetyInformation?.message}
              />
            </div>
            <div
              className="aria-hidden:hidden md:col-span-2"
              aria-hidden={form.watch().type !== "OTC"}
            >
              <RichTextEditor
                title="Fact Box"
                value={form.watch("factBox") ?? ""}
                onChange={(value) => form.setValue("factBox", value)}
                error={form.formState.errors?.factBox?.message}
              />
            </div>
            <div className="md:col-span-2">
              <RichTextEditor
                title="Ingredients"
                value={form.watch("ingredients") ?? ""}
                onChange={(value) => form.setValue("ingredients", value)}
                error={form.formState.errors?.ingredients?.message}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" isLoading={updateProductMutation.isPending}>
            Update Product
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
