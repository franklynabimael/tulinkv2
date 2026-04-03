import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "TuLink - Tu catálogo virtual, pedidos por WhatsApp",
    template: "%s | TuLink"
  },
  description: "La plataforma SaaS que te permite crear tu tienda online en minutos, mostrar tus productos y recibir pedidos directamente en tu WhatsApp. Sin comisiones por venta. Prueba gratis por 1 mes.",
  keywords: ["catálogo virtual", "tienda online", "WhatsApp", "vender por WhatsApp", "pedidos WhatsApp", "e-commerce", "emprendedores", "TuLink"],
  authors: [{ name: "TuLink" }],
  creator: "TuLink",
  publisher: "TuLink",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://tulink.do",
    title: "TuLink - Tu catálogo virtual, pedidos por WhatsApp",
    description: "La plataforma SaaS que te permite crear tu tienda online en minutos, mostrar tus productos y recibir pedidos directamente en tu WhatsApp. Sin comisiones por venta.",
    siteName: "TuLink",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TuLink - Tu catálogo virtual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuLink - Tu catálogo virtual, pedidos por WhatsApp",
    description: "La plataforma SaaS que te permite crear tu tienda online en minutos. Sin comisiones por venta.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-gray-900">{children}</body>
    </html>
  );
}
