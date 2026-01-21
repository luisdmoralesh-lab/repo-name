import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masajes en Bolivia - Encuentra masajistas profesionales",
  description: "Encuentra masajistas profesionales cerca de ti en Bolivia. Publica tu anuncio de servicios de masajes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 min-h-screen`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
