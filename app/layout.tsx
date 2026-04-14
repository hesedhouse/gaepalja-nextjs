import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gaepalja-nextjs.vercel.app"),
  title: "개팔자 — 우리 강아지 사주풀이",
  description: "ZERO EFFORT, MAXIMUM COMFORT. 천간지지·음양오행으로 풀어주는 반려견 사주팔자. 견종별 대운, 2026 토정비결, 주인과의 궁합까지.",
  keywords: ["개팔자", "강아지사주", "반려견사주", "사주개팔자", "토정비결", "오행", "강아지운세"],
  openGraph: {
    title: "개팔자 🐾 — Zero Effort, Maximum Comfort",
    description: "우리 강아지의 타고난 기질과 운명을 풀어드립니다",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "개팔자" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff3e9d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard — 한국 디자이너 표준, 깔끔한 산세리프 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Cafe24 Ssurround — 둥글고 귀여운 한글 (90s 팝 무드) */}
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/Cafe24Ssurround.css"
        />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        background: "#fef3f7",
        fontFamily: "'Cafe24Ssurround','Pretendard Variable','Pretendard',-apple-system,sans-serif",
      }}>
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
