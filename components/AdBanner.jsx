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
