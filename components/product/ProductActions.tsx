"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export default function ProductActions({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number;
  image?: string | null;
}) {
  const router = useRouter();
  const { add } = useCart();

  const handleAdd = () => {
    add({ id, name, price, image: image ?? "" });
  };

  const handleBuyNow = () => {
    // pastikan klik tidak ketutup overlay
    add({ id, name, price, image: image ?? "" });
    router.push("/cart");
  };

  return (
    <div className="relative z-10 mt-4 flex gap-3">
      <Button
        type="button"
        onClick={handleAdd}
        className="
          flex-1 h-12 rounded-xl
          bg-emerald-600 hover:bg-emerald-500
          text-white font-medium
        "
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Tambah ke keranjang
      </Button>

      <Button
        type="button"
        onClick={handleBuyNow}
        className="
          flex-1 h-12 rounded-xl
          bg-white/10 hover:bg-white/15
          text-white font-medium
          border border-white/15
          backdrop-blur
        "
      >
        Beli sekarang
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
