import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fincasya.com"),
  title: "FincasYa - Encuentra tu descanso ideal",
  description:
    "Alquiler de fincas exclusivas para tu descanso y recreación en Colombia.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "FincasYa - Encuentra tu descanso ideal",
    description:
      "Alquiler de fincas exclusivas para tu descanso y recreación en Colombia.",
    url: "https://fincasya.com",
    siteName: "FincasYa",
    images: [
      {
        url: "/fincas-ya-logo.png",
        width: 800,
        height: 600,
        alt: "FincasYa Logo",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FincasYa - Encuentra tu descanso ideal",
    description:
      "Alquiler de fincas exclusivas para tu descanso y recreación en Colombia.",
    images: ["/fincas-ya-logo.png"],
  },
};

import { SmoothScroll } from "@/components/common/smooth-scroll";
import { FloatingButton } from "@/components/common/floating-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased bg-background text-foreground font-sans`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <FloatingButton />
      </body>
    </html>
  );
}
