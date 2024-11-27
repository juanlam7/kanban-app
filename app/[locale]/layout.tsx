import { Locale, routing } from "@/i18n/routing";
import { Providers } from "@/redux/provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { ProvidersTheme } from "../providers";

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kanban App",
  description: "This app allows you to order all of your items",
  icons: "/globe.svg",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={pjs.className}>
      <body className="h-screen overflow-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ProvidersTheme>{children}</ProvidersTheme>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
