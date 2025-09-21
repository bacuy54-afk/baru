"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // atau Checkbox bila tidak ada Switch
import { ScrollArea } from "@/components/ui/scroll-area"; // kalau belum ada, bisa ganti div biasa

type ProductFormValue = {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  image: string;
  tags: string;      // comma separated
  features: string;  // newline separated
  isActive: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<ProductFormValue>;      // data awal saat edit
  onSubmit: (values: ProductFormValue) => Promise<void> | void;
  title?: string;
};

export default function EditProductDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  title = "Edit Product",
}: Props) {
  const [values, setValues] = React.useState<ProductFormValue>({
    id: initial?.id,
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    price: initial?.price ?? "",
    originalPrice: initial?.originalPrice ?? "",
    image: initial?.image ?? "",
    tags: initial?.tags ?? "",
    features: initial?.features ?? "",
    isActive: initial?.isActive ?? true,
  });

  React.useEffect(() => {
    // sinkron saat dialog dibuka kembali
    if (open) {
      setValues({
        id: initial?.id,
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        category: initial?.category ?? "",
        price: initial?.price ?? "",
        originalPrice: initial?.originalPrice ?? "",
        image: initial?.image ?? "",
        tags: initial?.tags ?? "",
        features: initial?.features ?? "",
        isActive: initial?.isActive ?? true,
      });
    }
  }, [open, initial]);

  const handleChange =
    (key: keyof ProductFormValue) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((s) => ({ ...s, [key]: e.target.value }));
    };

  const handleToggle = (v: boolean) => {
    setValues((s) => ({ ...s, isActive: v }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-2xl max-w-[92vw]
          p-0 overflow-hidden
          bg-background
        "
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Lengkapi detail produk lalu simpan.
          </DialogDescription>
        </DialogHeader>

        {/* area scroll khusus isi form */}
        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <form id="product-form" onSubmit={submit} className="space-y-6">
            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={values.name}
                onChange={handleChange("name")}
                placeholder="cth: Netflix Premium"
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={values.description}
                onChange={handleChange("description")}
                placeholder="Deskripsi singkat produk..."
                className="min-h-[120px] resize-y"
              />
            </div>

            {/* Grid dua kolom untuk field pendek */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={values.category}
                  onChange={handleChange("category")}
                  placeholder="cth: Streaming"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar (URL)</Label>
                <Input
                  id="image"
                  value={values.image}
                  onChange={handleChange("image")}
                  placeholder="https://...."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  value={values.price}
                  onChange={handleChange("price")}
                  inputMode="numeric"
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Harga Coret (opsional)</Label>
                <Input
                  id="originalPrice"
                  value={values.originalPrice}
                  onChange={handleChange("originalPrice")}
                  inputMode="numeric"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Tags & Features */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
              <Input
                id="tags"
                value={values.tags}
                onChange={handleChange("tags")}
                placeholder="streaming, shared, akun"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Fitur (pisahkan baris)</Label>
              <Textarea
                id="features"
                value={values.features}
                onChange={handleChange("features")}
                placeholder={`4K HDR\nGaransi 30 hari\nDukungan multi-device`}
                className="min-h-[100px]"
              />
            </div>

            {/* Status aktif */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="block">Aktifkan produk</Label>
                <p className="text-sm text-muted-foreground">
                  Non-aktifkan jika sementara tidak dijual.
                </p>
              </div>
              <Switch checked={values.isActive} onCheckedChange={handleToggle} />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="product-form">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
