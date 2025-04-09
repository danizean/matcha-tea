import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "sonner";
import { ToastProvider } from "@/components/ui/toast";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Matcha Tea 🍵 | Ghibli NFT",
  description: "Mint your serene Ghibli-style NFT from the Matcha Tea collection.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-ghibli-soft text-ghibli-dark font-sans min-h-screen antialiased">
        <ToastProvider>
          <Toaster position="bottom-center" />
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
