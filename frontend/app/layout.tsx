import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: { default: "Байтерек — Единый портал поддержки бизнеса", template: "%s | Байтерек" },
  description: "Государственный агрегатор мер господдержки для предпринимателей Казахстана",
  keywords: ["господдержка", "МСБ", "Казахстан", "Байтерек", "субсидии", "гранты"],
};

import { Providers } from "@/components/providers/Providers";
import ChatWidget from "@/components/features/ai-assistant/ChatWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
