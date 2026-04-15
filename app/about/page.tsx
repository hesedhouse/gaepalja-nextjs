import type { Metadata } from "next";
import DocPage from "../../components/DocPage";

export const metadata: Metadata = {
  title: "회사 소개 — 개팔자",
  description: "개팔자(우리 강아지 사주풀이)의 운영 주체 헤세드하우스를 소개합니다.",
};

const styles = {
  h2: { fontSize: 16, fontWeight: 900, color: "#1a0033", marginTop: 20, marginBottom: 10 } as const,
  p: { marginBottom: 12 } as const,
  infoBox: {
    background: "#fef3f7",
    border: "2px solid #1a0033",
    borderRadius: 12,
    padding: "16px 18px",
    marginTop: 12,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 2,
  } as const,
  label: { color: "#1a0033", fontWeight: 900, display: "inline-block", minWidth: 90 } as const,
};

export default function AboutPage() {
  return (
    <DocPage
      title="회사 소개"
      subtitle="개팔자는 헤세드하우스가 기획·운영하는 반려견 사주풀이 서비스입니다."
    >
      <h2 style={styles.h2}>🐾 서비스 소개</h2>
      <p style={styles.p}>
        <strong>개팔자</strong>는 사랑스러운 반려견의 생년월일 정보를 기반으로 천간지지·음양오행·신살·
        대운·세운·월운을 풀어드리는 재미 중심의 사주풀이 콘텐츠 서비스입니다.
        복잡한 동양철학의 원리를 90s 팝 감성으로 쉽고 재미있게 풀어내는 것을 목표로 합니다.
      </p>
      <p style={styles.p}>
        ZERO EFFORT, MAXIMUM COMFORT — 주인이 큰 노력 없이도
        우리 아이의 타고난 기질과 건강 포인트, 올 한 해의 흐름을 한눈에 볼 수 있도록
        설계했습니다. 주인과의 궁합 분석, 견종·오행 기반 맞춤 펫용품 추천까지 함께 제공합니다.
      </p>

      <h2 style={styles.h2}>🏢 운영 주체</h2>
      <p style={styles.p}>
        본 서비스는 아래 사업자가 운영·책임집니다. 운영·이용 관련 문의는 아래 이메일로 연락주시기 바랍니다.
      </p>
      <div style={styles.infoBox}>
        <div><span style={styles.label}>상호</span> 헤세드하우스 (HESEDHOUSE)</div>
        <div><span style={styles.label}>대표자</span> 이현우</div>
        <div><span style={styles.label}>사업자등록번호</span> 652-12-00575</div>
        <div><span style={styles.label}>주소</span> 경기도 고양시 일산서구 덕이로 24, B103호</div>
        <div><span style={styles.label}>연락처</span> 031-994-7740</div>
        <div><span style={styles.label}>이메일</span> hesed@hesedhouse.net</div>
      </div>

      <h2 style={styles.h2}>💌 문의 · 제휴</h2>
      <p style={styles.p}>
        서비스 개선 아이디어, 광고 제휴, IP 콜라보 문의는 <strong>hesed@hesedhouse.net</strong>으로
        보내주시면 순차적으로 검토 후 회신드리겠습니다.
      </p>
    </DocPage>
  );
}
