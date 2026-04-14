"use client";
import Script from "next/script";

// 카카오 JavaScript SDK 로더 + init
// Client Component로 분리한 이유: layout.tsx(Server Component)에서는 onLoad 핸들러 사용 불가
export default function KakaoLoader() {
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!jsKey) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(jsKey);
        }
      }}
    />
  );
}
