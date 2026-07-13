import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Megome — API-First Portfolio Platform",
    template: "%s | Megome",
  },

  description:
    "Megome is an API-first portfolio platform for developers. Store, manage, and expose your career data through a structured REST API. Build dynamic portfolios powered by real-time data.",

  keywords: [
    "developer portfolio API",
    "portfolio API",
    "developer portfolio builder",
    "REST API portfolio",
    "personal API",
    "developer profile API",
    "structured portfolio data",
    "backend portfolio system",
    "Go backend portfolio",
    "developer tools",
  ],

  authors: [{ name: "Megome" }],

  creator: "Megome",

  openGraph: {
    title: "Megome — API-First Portfolio Platform",
    description:
      "Build developer portfolios powered by a structured REST API. Manage your career data in one place and reuse it anywhere.",
    url: "https://megome.dev",
    siteName: "Megome",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Megome API-first portfolio platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Megome — API-First Portfolio Platform",
    description:
      "Turn your developer portfolio into a structured API you can reuse anywhere.",
    images: ["/og-image.png"],
  },

  metadataBase: new URL("https://megome.dev"),

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
