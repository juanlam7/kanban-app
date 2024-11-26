import { Providers } from "@/redux/provider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { ProvidersTheme } from "../providers";

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kanban App",
  description: "This app allows you to order all of your items",
  icons: "/globe.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pjs.className}>
      <body className="h-screen overflow-hidden">
        <Providers>
          <ProvidersTheme>{children}</ProvidersTheme>
        </Providers>
      </body>
    </html>
  );
}
