import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const degular = localFont({
  src: [
    {
      path: "./fonts/DegularDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DegularDemo-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/DegularDemo-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/DegularDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/DegularDemo-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-degular",
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
        className={`${degular.variable} ${dmSans.variable} ${degular.className} antialiased bg-background text-foreground font-sans`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <FloatingButton />
      </body>
    </html>
  );
}
