import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 검색하고 나만의 즐겨찾기와 평점을 남겨보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Suspense fallback={<div className="h-[91px]" />}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
