import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autopsy — Forensic Postmortem Intelligence",
  description:
    "6 specialized AI agents investigate why startups fail. Parallel research, cross-agent debate, one forensic verdict. Built on AMD MI300X.",
  openGraph: {
    title: "Autopsy — Forensic Postmortem Intelligence",
    description:
      "6 AI agents investigate startup failures. Parallel research, cross-agent debate, one verdict in 90 seconds.",
    url: "https://autopsy-nine.vercel.app",
    siteName: "Autopsy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AUTOPSY — Forensic Postmortem Intelligence",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autopsy — Forensic Postmortem Intelligence",
    description:
      "6 AI agents investigate startup failures. Parallel research, cross-agent debate, one verdict.",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL("https://autopsy-nine.vercel.app"),
};

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FEFCF5] text-[#3C3A39]">
        {children}
      </body>
    </html>
  );
}
