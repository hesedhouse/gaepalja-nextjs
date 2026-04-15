"use client";
import { useEffect } from "react";

// 카카오 애드핏 광고 배너
// type: "loading" | "result" | "bottom"
// 환경변수가 비어있으면 placeholder 표시 (개발 모드)
//
// SPA 이슈 대응: 카카오 AdFit SDK(ba.min.js)는 최초 로드 시 한 번만 .kakao_ad_area를 스캔해서
// ins 태그를 활성화함. React가 동적으로 마운트하는 ins는 SDK가 발견하지 못해 광고가 뜨지 않음.
// 따라서 AdBanner가 마운트할 때마다 fresh script를 주입해 SDK를 재실행시키는 패턴을 사용.
// 언마운트 시 정리까지 하면 다음 마운트에서 다시 실행되어 새 광고가 표시됨.
export default function AdBanner({ type }) {
  const unitId = {
    loading: process.env.NEXT_PUBLIC_ADFIT_LOADING_UNIT,
    result: process.env.NEXT_PUBLIC_ADFIT_RESULT_UNIT,
    bottom: process.env.NEXT_PUBLIC_ADFIT_BOTTOM_UNIT,
  }[type];

  // AdFit 권장 사이즈
  const sizes = {
    loading: { w: 320, h: 100 },
    result: { w: 320, h: 100 },
    bottom: { w: 320, h: 50 },
  };
  const { w, h } = sizes[type] || sizes.bottom;

  useEffect(() => {
    if (!unitId || typeof window === "undefined") return;
    // Fresh script 주입 → SDK 재실행 → 현재 DOM의 모든 .kakao_ad_area 스캔
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try {
        if (script.parentNode) script.parentNode.removeChild(script);
      } catch {}
    };
  }, [unitId]);

  // 광고 단위 ID가 없으면 placeholder (로컬 개발 모드)
  if (!unitId) {
    return (
      <div style={{
        background: "#fff",
        border: "3px dashed #1a0033",
        borderRadius: 18,
        padding: "16px 18px",
        margin: "16px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Cafe24Ssurround','Pretendard Variable',sans-serif",
      }}>
        <div style={{ fontSize: 11, color: "#7c6f95", marginBottom: 4, fontWeight: 900 }}>ADVERTISEMENT</div>
        <div style={{ fontSize: 13, color: "#1a0033", fontWeight: 900 }}>📢 광고 영역 — Kakao AdFit</div>
        <div style={{ fontSize: 10, color: "#7c6f95", marginTop: 4, fontWeight: 700 }}>
          {type === "loading" ? "잠시만 기다려주세요..." : "반려견을 위한 최고의 선택"}
        </div>
        <div style={{ position: "absolute", top: 6, right: 8, fontSize: 9, color: "#fff", background: "#ff3e9d", padding: "2px 7px", borderRadius: 50, fontWeight: 900, border: "2px solid #1a0033" }}>AD</div>
      </div>
    );
  }

  // 실제 카카오 애드핏 광고 단위
  // ins 태그는 JSX로 렌더해 SSR HTML에 포함시킴 (AdFit 심사 크롤러가 발견할 수 있도록)
  // 실제 활성화는 위 useEffect가 주입한 script가 담당
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={unitId}
        data-ad-width={String(w)}
        data-ad-height={String(h)}
      />
    </div>
  );
}
