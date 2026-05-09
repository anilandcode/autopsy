import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Boxes } from "lucide-react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autopsy — Research why companies fail with six specialized analysts",
  description:
    "Six AI agents investigate why companies failed, predict what could kill living companies, analyze your startup idea, and explore alternate histories.",
  openGraph: {
    title: "Autopsy — Research why companies fail with six specialized analysts",
    description:
      "Six AI agents investigate why companies failed, predict what could kill living companies, analyze your startup idea, and explore alternate histories. One platform, four modes.",
    url: "https://autopsy-nine.vercel.app",
    siteName: "Autopsy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Autopsy — Research why companies fail",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autopsy — Research why companies fail with six specialized analysts",
    description:
      "Six AI agents investigate why companies failed, predict what could kill living companies, analyze your startup idea, and explore alternate histories.",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL("https://autopsy-nine.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1E1C] text-[#A1A1AA] font-[200]" suppressHydrationWarning>
        <div className="min-h-screen p-4 md:p-8 flex flex-col text-left">
          <div className="flex-1 w-full max-w-[1440px] mx-auto bg-[#0F1110] rounded-[32px] border border-white/10 relative overflow-hidden flex flex-col shadow-2xl diagonal-bg">
            <div className="corner-top-left"></div>
            <div className="corner-top-right"></div>
            <div className="corner-bottom-left"></div>
            <div className="corner-bottom-right"></div>

            {/* Grid Lines */}
            <div className="grid-borders">
              <div className="grid-line-v left-1/3 hidden md:block"></div>
              <div className="grid-line-v left-2/3 hidden md:block"></div>
            </div>

            {/* Global Header */}
            <header className="relative z-10 grid grid-cols-1 md:grid-cols-3 border-b border-white/5 items-center">
              <div className="px-8 py-6 md:px-12 md:py-8 flex items-center gap-3">
                <Boxes size={20} className="text-white opacity-80" />
                <Link href="/" className="text-white text-[15px] font-sans font-[300] tracking-wide">Autopsy AI</Link>
              </div>
              <nav className="hidden md:flex items-center justify-center gap-8 text-[13px] font-[300]">
                 <Link href="/investigate" className="hover:text-white transition-colors">Investigate</Link>
                 <Link href="/architecture" className="hover:text-white transition-colors">Architecture</Link>
                 <Link href="/about" className="hover:text-white transition-colors">About</Link>
              </nav>
              <div className="hidden md:flex p-8 md:px-12 md:py-8 items-center justify-end">
                 <Link href="/investigate" className="border border-[#4B4BA0]/30 text-[#4B4BA0] hover:bg-[#4B4BA0]/10 uppercase font-mono tracking-widest text-[11px] rounded flex items-center gap-2 px-3 py-1.5 transition-colors">Access Hub</Link>
              </div>
            </header>

            {/* Page Content */}
            <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto">
              {children}
            </div>

            {/* Global Footer */}
            <footer className="relative z-10 grid grid-cols-1 md:grid-cols-2 border-t border-white/5 text-[12px] font-[300] text-[#A1A1AA]">
              <div className="p-6 md:px-12 md:py-8 col-span-1 flex items-center justify-center md:justify-start">
                 Designed & Developed by anilpervaiz.com & flowmarc.com
              </div>
              <div className="p-6 md:px-12 md:py-8 col-span-1 md:border-l border-white/5 flex items-center justify-center md:justify-end gap-8">
                 <Link href="#" className="hover:text-white transition-colors tracking-wide">Privacy Directive</Link>
                 <Link href="#" className="hover:text-white transition-colors tracking-wide">Service Terms</Link>
                 <Link href="#" className="hover:text-white transition-colors tracking-wide">Network Status</Link>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
