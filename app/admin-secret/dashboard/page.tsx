'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  DollarSign,
  Edit,
  LogOut,
  Package,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';

import type { Product } from '@/lib/types';

type Metrics = {
  products: number;
  categories: number;
  revenue: number;
  avgPrice: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    products: 0,
    categories: 0,
    revenue: 0,
    avgPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    features: '',
    tags: '',
    // 🆕 featured controls
    featured: false,
    featuredOrder: '',
  });

  // Kelas util agar input/textarea/select lebih kontras & fokus jelas
  const fieldClasses =
    'text-foreground placeholder:text-foreground/60 ' +
    'bg-white dark:bg-zinc-950 ' +
    'border-zinc-300 dark:border-zinc-800 ' +
    'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 ' +
    'shadow-sm';

    const labelClasses =
  "mb-1 block text-zinc-900 dark:text-zinc-100";
  
  useEffect(() => {
    const adminSession =
      typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
    if (!adminSession) {
      router.push('/admin-secret');
      return;
    }

    (async () => {
      try {
        const [rp, rm] = await Promise.all([
          fetch('/api/admin/products', { cache: 'no-store' }),
          fetch('/api/admin/metrics', { cache: 'no-store' }),
        ]);

        // products
        const ctP = rp.headers.get('content-type') || '';
        const jp = ctP.includes('application/json') ? await rp.json() : { products: [] };
        const list = Array.isArray(jp.products) ? jp.products.filter(Boolean) : [];
        setProducts(list);

        // metrics
        const ctM = rm.headers.get('content-type') || '';
        const jm = ctM.includes('application/json')
          ? await rm.json()
          : { totals: { products: 0, categories: 0, revenue: 0, avgPrice: 0 } };
        setMetrics(jm.totals || { products: 0, categories: 0, revenue: 0, avgPrice: 0 });
      } catch (e) {
        console.error('load dashboard data failed:', e);
        setProducts([]);
        setMetrics({ products: 0, categories: 0, revenue: 0, avgPrice: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session'); // (kalau pakai NextAuth → signOut())
    router.push('/');
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: String(product?.price ?? ''),
      originalPrice: product?.originalPrice ? String(product.originalPrice) : '',
      category: product?.category || '',
      image: product?.image || '',
      features: (product?.features || []).join('\n'),
      tags: (product?.tags || []).join(', '),
      featured: Boolean((product as any)?.featured ?? false),
      featuredOrder:
        (product as any)?.featuredOrder !== undefined &&
        (product as any)?.featuredOrder !== null
          ? String((product as any)?.featuredOrder)
          : '',
    });
    setIsEditDialogOpen(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      features: '',
      tags: '',
      featured: false,
      featuredOrder: '',
    });
    setIsEditDialogOpen(true);
  };

  async function handleSave() {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price || 0),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      category: formData.category.trim(),
      image: formData.image.trim(),
      features: formData.features
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      isActive: true,
      // 🆕 kirim ke API
      featured: !!formData.featured,
      featuredOrder:
        formData.featuredOrder.trim() === '' ? null : Number(formData.featuredOrder),
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const ct = r.headers.get('content-type') || '';
      const isJSON = ct.includes('application/json');

      if (!r.ok) {
        const errMsg = isJSON ? (await r.json()).error : await r.text();
        throw new Error(errMsg || `Request failed (${r.status})`);
      }

      const j = isJSON ? await r.json() : { product: null };
      if (!j?.product) throw new Error('Server did not return product JSON');

      if (editingProduct) {
        setProducts((prev) =>
          prev
            .map((p) => (p?.id === editingProduct.id ? { ...p, ...j.product } : p))
            .filter(Boolean),
        );
      } else {
        setProducts((prev) => [j.product, ...prev].filter(Boolean));
        setMetrics((m) => ({ ...m, products: (m.products ?? 0) + 1 }));
      }

      setIsEditDialogOpen(false);
    } catch (e: any) {
      console.error('Save failed:', e);
      alert(`Gagal menyimpan: ${e.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const r = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!r.ok) {
        const msg = (await r.text()) || `Delete failed (${r.status})`;
        throw new Error(msg);
      }
      setProducts((prev) => prev.filter((p) => p?.id !== id).filter(Boolean));
      setMetrics((m) => ({ ...m, products: Math.max(0, (m.products ?? 1) - 1) }));
    } catch (e: any) {
      console.error('Delete failed:', e);
      alert(`Gagal menghapus: ${e.message}`);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your digital products</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.products}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {Number(metrics.revenue).toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {Number(metrics.avgPrice).toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.categories}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products Management</CardTitle>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto
             bg-white text-zinc-900
             dark:bg-zinc-950 dark:text-zinc-50">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        className={fieldClasses}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="Netflix Premium"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className={labelClasses}>Description</Label>
                      <Textarea
                        id="description"
                        className={fieldClasses}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, description: e.target.value }))
                        }
                        rows={3}
                        placeholder="Deskripsi singkat produk…"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="price"className={labelClasses}>Price (Rp)</Label>
                        <Input
                          id="price"
                          type="number"
                          className={fieldClasses}
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((s) => ({ ...s, price: e.target.value }))
                          }
                          placeholder="10000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice" className={labelClasses}>Original Price (Rp)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          className={fieldClasses}
                          value={formData.originalPrice}
                          onChange={(e) =>
                            setFormData((s) => ({ ...s, originalPrice: e.target.value }))
                          }
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category" className={labelClasses}>Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((s) => ({ ...s, category: value }))
                        }
                      >
                        <SelectTrigger id="category" className={fieldClasses}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Streaming">Streaming</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Apps">Apps</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="image" className={labelClasses}>URL</Label>
                      <Input
                        id="image"
                        className={fieldClasses}
                        value={formData.image}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, image: e.target.value }))
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="features" className={labelClasses}>Features (one per line)</Label>
                      <Textarea
                        id="features"
                        className={fieldClasses}
                        value={formData.features}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, features: e.target.value }))
                        }
                        rows={4}
                        placeholder={'4K HDR\nGaransi 30 hari\nMulti-device'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags" className={labelClasses}>Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        className={fieldClasses}
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, tags: e.target.value }))
                        }
                        placeholder="Netflix, Premium, HD"
                      />
                    </div>

                    {/* 🆕 Featured controls */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 pt-1">
                        <input
                          id="featured"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData((s) => ({ ...s, featured: e.target.checked }))
                          }
                          className="h-4 w-4 accent-emerald-600"
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          Tampilkan di beranda (preview)
                        </Label>
                      </div>

                      <div>
                        <Label htmlFor="featuredOrder">Urutan di beranda</Label>
                        <Input
                          id="featuredOrder"
                          type="number"
                          inputMode="numeric"
                          className={fieldClasses}
                          value={formData.featuredOrder}
                          onChange={(e) =>
                            setFormData((s) => ({ ...s, featuredOrder: e.target.value }))
                          }
                          placeholder="Contoh: 1 (paling depan)"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        {editingProduct ? 'Update' : 'Create'} Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    {/* 🆕 kolom featured */}
                    <TableHead className="whitespace-nowrap">Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.filter(Boolean).map((product) => {
                    const isFeatured = Boolean((product as any)?.featured);
                    const order =
                      (product as any)?.featuredOrder ?? (isFeatured ? '-' : null);

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="max-w-xs truncate text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{product.category || '-'}</Badge>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium">
                            Rp {Number(product.price ?? 0).toLocaleString('id-ID')}
                          </div>
                          {product.originalPrice ? (
                            <div className="text-sm text-muted-foreground line-through">
                              Rp {Number(product.originalPrice).toLocaleString('id-ID')}
                            </div>
                          ) : null}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            Active
                          </Badge>
                        </TableCell>

                        {/* 🆕 featured badge */}
                        <TableCell>
                          {isFeatured ? (
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                              <Star className="h-3 w-3" />
                              <span>Yes</span>
                              <span className="opacity-70">
                                {order !== null ? `(#${order})` : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Belum ada produk. Klik “Add Product” untuk membuat.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
