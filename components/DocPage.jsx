import Link from "next/link";

// 약관·개인정보·회사소개 같은 텍스트 페이지용 공통 쉘
// 90s 팝 톤을 유지하면서도 가독성을 위해 글자는 크고 여백은 여유롭게
export default function DocPage({ title, subtitle, children }) {
  const C = {
    bg: "linear-gradient(180deg,#ffe6f0 0%,#ffe9c2 35%,#c2f0ff 100%)",
    text: "#1a0033",
    textMid: "#4b3b6b",
    textLight: "#7c6f95",
    pink: "#ff3e9d",
    pinkDark: "#d61b75",
    cyan: "#00cfff",
    yellow: "#ffd400",
    border: "#1a0033",
    shadow: "4px 4px 0 #1a0033",
  };
  const FONT = "'Cafe24Ssurround','Pretendard Variable','Pretendard',sans-serif";

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: FONT,
      color: C.text,
    }}>
      <div style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "28px 20px 20px",
      }}>
        {/* 헤더 — 홈 이동 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}>
          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: C.cyan,
            border: `3px solid ${C.border}`,
            borderRadius: 50,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 900,
            color: C.text,
            textDecoration: "none",
            boxShadow: C.shadow,
          }}>
            ← 개팔자로
          </Link>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>
            🐾 개팔자
          </div>
        </div>

        {/* 타이틀 카드 */}
        <div style={{
          background: C.yellow,
          border: `4px solid ${C.border}`,
          borderRadius: 20,
          padding: "22px 24px",
          marginBottom: 20,
          boxShadow: "6px 6px 0 #1a0033",
        }}>
          <h1 style={{
            fontSize: 26,
            fontWeight: 900,
            color: C.text,
            margin: 0,
            lineHeight: 1.3,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: 12,
              color: C.textMid,
              fontWeight: 700,
              marginTop: 8,
              lineHeight: 1.7,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 본문 카드 */}
        <div style={{
          background: "#ffffff",
          border: `3px solid ${C.border}`,
          borderRadius: 18,
          padding: "24px 22px",
          boxShadow: C.shadow,
          fontSize: 13,
          lineHeight: 1.95,
          color: C.textMid,
          fontWeight: 700,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
