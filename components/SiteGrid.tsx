"use client";

export default function SiteGrid() {
  // Full-screen grid di belakang semua konten
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none bg-black"
      style={{
        backgroundSize: "15px 15px",
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
      }}
    />
  );
}
