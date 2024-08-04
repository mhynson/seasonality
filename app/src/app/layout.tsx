import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { YearsProvider } from "./context/YearsContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Seasonality App",
  description: "View monthly and weekly stock seasonality!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <YearsProvider>{children}</YearsProvider>
      </body>
    </html>
  );
}
