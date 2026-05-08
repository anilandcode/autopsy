import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0E0E0E] text-[#F4F1EA]">
        {children}
      </body>
    </html>
  );
}
