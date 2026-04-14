import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "사주개팔자 — 우리 강아지 사주풀이",
  description: "천간지지·음양오행·십성·신살로 풀어주는 반려견 사주팔자. 견종별 수명 반영 대운, 2026 토정비결, 주인과의 궁합까지.",
  keywords: ["사주", "강아지사주", "반려견사주", "사주개팔자", "토정비결", "오행", "강아지운세"],
  openGraph: {
    title: "사주개팔자 🐾",
    description: "우리 강아지의 타고난 기질과 운명을 풀어드립니다",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#080810" }}>
        {children}
        {/* 카카오 애드핏 SDK — 광고단위 ID가 설정된 경우에만 로드 */}
        {process.env.NEXT_PUBLIC_ADFIT_LOADING_UNIT && (
          <Script
            src="https://t1.daumcdn.net/kas/static/ba.min.js"
            strategy="afterInteractive"
            async
          />
        )}
      </body>
    </html>
  );
}
