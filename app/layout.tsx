import type { Metadata } from "next";
import {  IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata: Metadata = {
  title: "أجندة — Agendah | منصة تنظيم المواعيد وتحصيل العربون",
  description: "أنشئ حسابك وابدأ تنظيم مواعيدك وتحصيل العربون آليًا وبكل سهولة مع أجندة.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${ibmPlexArabic.className} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-neutral-primary font-arabic flex flex-col font-normal select-none sm:select-text">
        {children}
      </body>
    </html>
  );
}
