"use client";
import { useEffect, useRef } from "react";

// 카카오 애드핏 광고 배너
// type: "loading" | "result" | "bottom"
// 환경변수가 비어있으면 placeholder 표시 (개발 모드)
export default function AdBanner({ type }) {
  const ref = useRef(null);
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
    // SDK가 이미 로드되어 있으면 광고 다시 요청
    if (window.adfit) {
      try { window.adfit.display(unitId); } catch (e) {}
    }
  }, [unitId]);

  // 광고 단위 ID가 없으면 placeholder
  if (!unitId) {
    return (
      <div style={{
        background: "linear-gradient(135deg,rgba(255,232,18,0.06),rgba(60,30,10,0.08))",
        border: "1px dashed rgba(255,232,18,0.2)",
        borderRadius: 10,
        padding: "14px 16px",
        margin: "16px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ fontSize: 11, color: "#8a7e6e", marginBottom: 4 }}>ADVERTISEMENT</div>
        <div style={{ fontSize: 13, color: "#b0a490", fontWeight: 700 }}>📢 광고 영역 — Kakao AdFit</div>
        <div style={{ fontSize: 10, color: "#5a5549", marginTop: 4 }}>
          {type === "loading" ? "사주 감정 중 잠시 기다려주세요..." : "반려견을 위한 최고의 선택"}
        </div>
        <div style={{ position: "absolute", top: 6, right: 8, fontSize: 9, color: "#5a5549", background: "rgba(0,0,0,0.2)", padding: "1px 5px", borderRadius: 3 }}>AD</div>
      </div>
    );
  }

  // 실제 카카오 애드핏 광고 단위
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <ins
        ref={ref}
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={unitId}
        data-ad-width={String(w)}
        data-ad-height={String(h)}
      />
    </div>
  );
}
