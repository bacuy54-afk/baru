'use client'
import { useState } from 'react'

export default function BuyButtons(props: { productId: string; planId: string }) {
  const [loading, setLoading] = useState<'wa' | 'online' | null>(null)
  async function start(mode: 'wa' | 'online') {
    setLoading(mode)
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: props.productId, planId: props.planId, checkout: mode })
      })
      const j = await r.json()
      if (mode === 'online' && j.orderId) {
        const r2 = await fetch('/api/payments/midtrans/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: j.orderId })
        })
        const j2 = await r2.json()
        if (j2.redirect_url) window.location.href = j2.redirect_url
      } else if (mode === 'wa') {
        alert('Order dibuat. Silakan lanjut via WhatsApp/admin. Order ID: ' + j.orderId)
      }
    } finally {
      setLoading(null)
    }
  }
  return (
    <div className="flex gap-3">
      <button onClick={() => start('wa')} disabled={!!loading} className="rounded-lg px-4 py-2 bg-emerald-600 text-white">
        {loading === 'wa' ? 'Membuka…' : 'Beli via WhatsApp'}
      </button>
      <button onClick={() => start('online')} disabled={!!loading} className="rounded-lg px-4 py-2 bg-indigo-600 text-white">
        {loading === 'online' ? 'Menuju Pembayaran…' : 'Bayar Online'}
      </button>
    </div>
  )
}
