import type { Metadata } from "next";
import React from 'react'
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

 
export const metadata: Metadata = {
  title: "Yakudi",
  description: "Placeholder for yakudi website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
        className={cn(
         "fixed inset-0 -z-10",
          "bg-size-[12px_12px]",
          "bg-[radial-gradient(#d4d4d4_0.8px,transparent_1px)]",
          "dark:bg-[radial-gradient(#404040_0.8px,transparent_1px)]"
        )}
      />
        {children}
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
