import Link from "next/link";

// 사이트 공통 푸터 — 카카오 AdFit 소유관계 심사 통과를 위해 운영자 정보 필수 노출
// 계정 명의(헤세드하우스 개인사업자)와 표기가 일치해야 함
export default function Footer() {
  const C = {
    text: "#1a0033",
    textMid: "#4b3b6b",
    textLight: "#7c6f95",
    pink: "#ff3e9d",
    border: "#1a0033",
  };
  const FONT = "'Cafe24Ssurround','Pretendard Variable','Pretendard',sans-serif";

  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      maxWidth: 540,
      margin: "0 auto",
      padding: "24px 20px 40px",
      fontFamily: FONT,
    }}>
      <div style={{
        background: "#ffffff",
        border: `3px solid ${C.border}`,
        borderRadius: 18,
        padding: "18px 20px",
        boxShadow: "4px 4px 0 #1a0033",
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 900,
          color: C.text,
          marginBottom: 10,
          letterSpacing: 0.3,
        }}>
          🐾 개팔자 · 운영 정보
        </div>

        <div style={{
          fontSize: 10,
          lineHeight: 1.9,
          color: C.textMid,
          fontWeight: 700,
        }}>
          <div><strong style={{ color: C.text }}>상호</strong> 헤세드하우스 (HESEDHOUSE)</div>
          <div><strong style={{ color: C.text }}>대표자</strong> 이현우</div>
          <div><strong style={{ color: C.text }}>사업자등록번호</strong> 652-12-00575</div>
          <div><strong style={{ color: C.text }}>주소</strong> 경기도 고양시 일산서구 덕이로 24, B103호</div>
          <div><strong style={{ color: C.text }}>연락처</strong> 031-994-7740</div>
          <div><strong style={{ color: C.text }}>이메일</strong> hesed@hesedhouse.net</div>
        </div>

        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 14,
          paddingTop: 12,
          borderTop: `2px dashed ${C.border}`,
        }}>
          {[
            { href: "/about", label: "회사 소개" },
            { href: "/terms", label: "이용약관" },
            { href: "/privacy", label: "개인정보처리방침" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: C.text,
                background: "#fef3f7",
                border: `2px solid ${C.border}`,
                borderRadius: 50,
                padding: "5px 12px",
                textDecoration: "none",
                boxShadow: "2px 2px 0 #1a0033",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{
          fontSize: 9,
          color: C.textLight,
          fontWeight: 700,
          marginTop: 12,
          lineHeight: 1.6,
        }}>
          © 2026 헤세드하우스. All rights reserved.<br />
          본 사주풀이는 재미를 위한 콘텐츠이며, 실제 운세를 보장하지 않습니다.
        </div>
      </div>
    </footer>
  );
}
