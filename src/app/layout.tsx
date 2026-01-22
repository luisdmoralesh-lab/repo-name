import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import LaunchGate from "@/components/LaunchGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masajes en Bolivia - Próximamente",
  description: "La plataforma de masajes profesionales en Bolivia. Lanzamiento: 14 de Febrero, 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 min-h-screen`}>
        <LaunchGate>
          <Header />
          <main>
            {children}
          </main>
        </LaunchGate>
      </body>
    </html>
  );
}
