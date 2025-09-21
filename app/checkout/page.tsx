'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const router = useRouter();

  const items   = useCart((s) => s.items);
  const inc     = useCart((s) => s.inc);
  const dec     = useCart((s) => s.dec);
  const remove  = useCart((s) => s.remove);
  const clear   = useCart((s) => s.clear);
  const totalFn = useCart((s) => s.total);
  const countFn = useCart((s) => s.count);

  const total = totalFn();
  const count = countFn();

  const [loading, setLoading] = useState(false);
  const [buyer, setBuyer] = useState({ name: '', wa: '', note: '' });

  const canPay = useMemo(
    () => items.length > 0 && buyer.name.trim() && buyer.wa.trim(),
    [items.length, buyer],
  );

  async function submitOrder() {
    if (!canPay || loading) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      clear();
      router.replace('/thank-you');
    } catch (e) {
      console.error(e);
      alert('Gagal memproses pesanan. Coba lagi ya.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-3">Keranjang kosong</h1>
        <p className="text-zinc-300 mb-8">Tambahkan produk dulu ya.</p>
        <Button asChild>
          <Link href="/products">Lihat Produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-6">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        {/* LIST ITEM */}
        <Card className="border-white/10 bg-zinc-900/90 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Produk ({count})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/50 p-4"
              >
                <div className="h-16 w-16 overflow-hidden rounded-md bg-black/70">
                  {it.image ? (
                    <Image
                      src={it.image}
                      alt={it.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{it.name}</div>
                  <div className="text-sm text-emerald-300">
                    Rp {Number(it.price).toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dec(it.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/10 hover:bg-white/20"
                    aria-label="Kurangi"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="min-w-[2rem] text-center font-semibold">{it.qty}</div>
                  <button
                    type="button"
                    onClick={() => inc(it.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/10 hover:bg-white/20"
                    aria-label="Tambah"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-400/25 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30"
                  aria-label="Hapus item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RINGKASAN + FORM */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-zinc-900/90 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Jumlah Item</span>
                <span className="font-semibold text-white">{count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Total</span>
                <span className="text-lg font-bold text-white">
                  Rp {Number(total).toLocaleString('id-ID')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-900/90 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Data Pembeli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nama</Label>
                <Input
                  id="name"
                  placeholder="Nama lengkap"
                  value={buyer.name}
                  onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                  className="bg-black/40 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wa" className="text-white">Nomor WhatsApp</Label>
                <Input
                  id="wa"
                  type="tel"
                  inputMode="tel"
                  placeholder="08xxxxxxxxxx"
                  value={buyer.wa}
                  onChange={(e) => setBuyer((b) => ({ ...b, wa: e.target.value }))}
                  className="bg-black/40 border-white/20 text-white placeholder:text-white/60"
                />
                <p className="text-xs text-white/70">
                  Kami gunakan WA untuk mengirim detail pesanan.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-white">Catatan (opsional)</Label>
                <Input
                  id="note"
                  placeholder="Catatan untuk penjual"
                  value={buyer.note}
                  onChange={(e) => setBuyer((b) => ({ ...b, note: e.target.value }))}
                  className="bg-black/40 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={!canPay || loading}
                onClick={submitOrder}
              >
                {loading ? 'Memproses…' : 'Bayar sekarang'}
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                <Link href="/products">← Kembali belanja</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
