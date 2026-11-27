import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

// CDN 링크 대신 패키지의 가변 폰트 파일을 next/font로 불러와 우리 서버에서 함께 제공한다.
const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

// 페이지에서 따로 정하지 않으면 이 제목과 설명을 쓴다. %s 자리에 페이지 제목이 들어간다.
export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "TMDB 인기 영화를 보고 평점과 즐겨찾기를 남기는 UMCine입니다.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    siteName: "UMCine",
    title: "UMCine",
    description: "TMDB 인기 영화를 보고 평점과 즐겨찾기를 남기는 UMCine입니다.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
