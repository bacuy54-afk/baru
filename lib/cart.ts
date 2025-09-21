"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];

  // actions
  add: (item: { id: string; name: string; price: number; image?: string }, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;

  // getters
  count: () => number; // total qty
  total: () => number; // total rupiah
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item, qty = 1) =>
        set((state) => {
          const idx = state.items.findIndex((x) => x.id === item.id);
          if (idx >= 0) {
            // sudah ada → tambah qty
            const next = [...state.items];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            return { items: next };
          }
          // belum ada → push
          return { items: [...state.items, { ...item, qty }] };
        }),

      inc: (id) =>
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)),
        })),

      dec: (id) =>
        set((state) => ({
          items: state.items
            .map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
            .filter((it) => it.qty > 0), // kalau qty 0, hilangkan
        })),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((it) => it.id !== id),
        })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((sum, it) => sum + it.qty, 0),
      total: () => get().items.reduce((sum, it) => sum + it.price * it.qty, 0),
    }),
    {
      name: "ds-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
