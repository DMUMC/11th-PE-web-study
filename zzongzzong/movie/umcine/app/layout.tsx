import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import Header from "../src/components/layout/header";
import Footer from "../src/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 발견하고 기록하는 UMCine",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 bg-[#f6f7f9] px-[80px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
