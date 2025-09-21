// app/layout.tsx (ringkas)
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import SiteNavbar from "@/components/site-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider defaultTheme="system" storageKey="digitalstore-theme">
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
          <div className="min-h-screen relative">
            <SiteNavbar />
            <main className="relative pt-28">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
