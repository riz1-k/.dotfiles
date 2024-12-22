import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type excelProductTable } from "@/server/db/schema";
import { api } from "@/trpc/react";

interface Props {
  selectedDrugs: number[];
  data: Array<typeof excelProductTable.$inferSelect>;
}

export default function PublishDialog(props: Props) {
  const { selectedDrugs, data } = props;
  const router = useRouter();
  const [formData, setFormData] = useState<
    Array<{
      sellingPrice: number;
      stock: number;
      mrp: number;
      id: number;
    }>
  >([]);

  const selectedDrugsData = useMemo(() => {
    return data.filter((drug) => selectedDrugs.includes(drug.id));
  }, [selectedDrugs, data]);

  useEffect(() => {
    setFormData(
      selectedDrugsData.map((drug) => ({
        sellingPrice: drug.MRP,
        mrp: drug.MRP,
        stock: 10,
        id: drug.id,
      })),
    );
  }, [selectedDrugs, data]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const newFormData = [...formData];
    const value = event.target.value;
    newFormData[index]!.sellingPrice =
      value === "" ? 0 : Number(event.target.value);
    setFormData(newFormData);
  }

  const createProductAction = api.admin.product.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Products created successfully");
      router.push("/admin/dashboard/inventory");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button disabled={!selectedDrugs.length} className="w-fit">
          Create Products
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[50rem]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = formData.map((drug) => ({
              sellingPrice: drug.sellingPrice,
              mrp: drug.mrp,
              productId: drug.id,
              stock: drug.stock,
            }));
            createProductAction.mutate(data);
          }}
          className="flex flex-col gap-y-2"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedDrugsData.map((drug, index) => (
                <TableRow key={drug.id}>
                  <TableCell className="max-w-sm">
                    <span className="line-clamp-2">{drug.productName}</span>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData[index]?.mrp}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const prevData = formData[index]!;
                        setFormData([
                          ...formData.slice(0, index),
                          {
                            ...prevData,
                            mrp: value,
                          },
                          ...formData.slice(index + 1),
                        ]);
                      }}
                      placeholder="MRP"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData[index]?.sellingPrice}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Selling Price"
                      required
                      max={formData[index]?.mrp}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData[index]?.stock}
                      min={1}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const prevData = formData[index]!;
                        setFormData([
                          ...formData.slice(0, index),
                          {
                            ...prevData,
                            stock: value,
                          },
                          ...formData.slice(index + 1),
                        ]);
                      }}
                      placeholder="Stock"
                      required
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button type="button" className="w-full" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full"
              isLoading={createProductAction.isPending}
              variant="default"
            >
              Add Products to Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
