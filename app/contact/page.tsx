export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Contact</h1>
      <p className="mb-8 text-muted-foreground">
        Ada pertanyaan seputar produk, pembayaran, atau kerja sama? Hubungi kami.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur transition hover:bg-black/60"
        >
          <h2 className="mb-1 text-xl font-semibold">WhatsApp</h2>
          <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
        </a>
        <a
          href="mailto:support@digitalstore.id"
          className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur transition hover:bg-black/60"
        >
          <h2 className="mb-1 text-xl font-semibold">Email</h2>
          <p className="text-sm text-muted-foreground">support@digitalstore.id</p>
        </a>
      </div>
    </section>
  );
}
