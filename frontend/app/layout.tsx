import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/app/components/ui/toaster";

export const metadata: Metadata = {
  title: "Dientex - Gestión de Consultorio Dental",
  description: "Sistema completo de gestión para consultorios dentales - Dientex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
