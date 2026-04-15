import type { Metadata } from "next";
import DocPage from "../../components/DocPage";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 개팔자",
  description: "개팔자 개인정보처리방침",
};

const styles = {
  h2: { fontSize: 15, fontWeight: 900, color: "#1a0033", marginTop: 20, marginBottom: 8 } as const,
  p: { marginBottom: 10 } as const,
  ul: { paddingLeft: 20, marginBottom: 12 } as const,
  li: { marginBottom: 6 } as const,
  box: {
    background: "#fef3f7",
    border: "2px solid #1a0033",
    borderRadius: 12,
    padding: "14px 16px",
    marginTop: 10,
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 1.9,
  } as const,
};

export default function PrivacyPage() {
  return (
    <DocPage
      title="개인정보처리방침"
      subtitle="헤세드하우스는 이용자의 개인정보를 소중히 여기며, 개인정보 보호법을 준수합니다."
    >
      <p style={{ fontSize: 11, color: "#7c6f95", fontWeight: 700, marginBottom: 16 }}>
        시행일: 2026년 4월 15일
      </p>

      <div style={styles.box}>
        <strong style={{ color: "#1a0033" }}>📌 핵심 요약</strong>
        <div style={{ marginTop: 6 }}>
          개팔자는 <strong>회원가입·로그인이 없는 서비스</strong>입니다. 입력하신 반려견 정보는
          <strong> 브라우저 내에서만 처리</strong>되며 서버에 저장되지 않습니다. 제3자에게 제공되거나
          마케팅에 활용되는 개인정보가 없습니다.
        </div>
      </div>

      <h2 style={styles.h2}>제1조 (수집하는 정보와 목적)</h2>
      <p style={styles.p}>
        회사는 아래 정보만 처리하며, <strong>모두 브라우저 메모리 내에서 즉시 계산</strong>되고 서버로
        전송되거나 저장되지 않습니다.
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <strong>반려견 정보</strong>: 이름, 견종, 성별, 생년월일, 태어난 시간 — 사주 계산 목적.
        </li>
        <li style={styles.li}>
          <strong>반려인(주인) 정보</strong>: 궁합 분석 시에만 이름·생년월일·시간 — 계산 후 즉시 소멸.
        </li>
      </ul>
      <p style={styles.p}>
        결과를 공유할 때 생성되는 링크에는 위 입력값이 암호화된 형태로 포함됩니다. 이 링크를 받은 사람은
        동일한 사주 결과를 볼 수 있으나, 링크를 공개 배포하지 않는 한 제3자에게 노출되지 않습니다.
      </p>

      <h2 style={styles.h2}>제2조 (쿠키 및 제3자 스크립트)</h2>
      <p style={styles.p}>
        본 서비스는 이용자의 편의와 광고 운영을 위해 아래 제3자 스크립트를 사용합니다.
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <strong>카카오 AdFit</strong>: 광고 게재 및 최적화를 위한 쿠키를 사용할 수 있습니다.
          관련 정책은 카카오 AdFit의 개인정보처리방침을 참고해주세요.
        </li>
        <li style={styles.li}>
          <strong>카카오 JavaScript SDK</strong>: 공유 기능 지원. 이용자가 공유 버튼을 누를 때만 동작합니다.
        </li>
        <li style={styles.li}>
          <strong>쿠팡 파트너스</strong>: 추천 상품 링크 클릭 시 쿠팡으로 이동합니다. 이후 개인정보 처리는
          쿠팡의 정책을 따릅니다.
        </li>
      </ul>
      <p style={styles.p}>
        이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 광고 기능이 제한될 수 있습니다.
      </p>

      <h2 style={styles.h2}>제3조 (개인정보의 보유 및 파기)</h2>
      <p style={styles.p}>
        회사는 서비스 이용 과정에서 수집된 정보를 <strong>서버에 저장하지 않습니다</strong>.
        브라우저 메모리에서 계산 후 즉시 소멸되며, 이용자가 페이지를 닫는 순간 완전히 삭제됩니다.
      </p>

      <h2 style={styles.h2}>제4조 (제3자 제공)</h2>
      <p style={styles.p}>
        회사는 이용자의 개인정보를 <strong>제3자에게 제공하지 않습니다</strong>.
      </p>

      <h2 style={styles.h2}>제5조 (이용자 권리)</h2>
      <p style={styles.p}>
        본 서비스는 서버 저장을 하지 않으므로 열람·정정·삭제 요청 대상이 되는 개인정보가 존재하지 않습니다.
        다만 관련 문의사항은 언제든 연락주시면 안내해드립니다.
      </p>

      <h2 style={styles.h2}>제6조 (14세 미만 이용자)</h2>
      <p style={styles.p}>
        본 서비스는 14세 미만 아동으로부터 개인정보를 수집하지 않으며, 14세 미만 아동이 이용할 경우
        법정 대리인의 동의를 권장합니다.
      </p>

      <h2 style={styles.h2}>제7조 (개인정보 보호책임자)</h2>
      <div style={styles.box}>
        <div><strong style={{ color: "#1a0033" }}>이름</strong> 이현우</div>
        <div><strong style={{ color: "#1a0033" }}>소속</strong> 헤세드하우스</div>
        <div><strong style={{ color: "#1a0033" }}>이메일</strong> hesed@hesedhouse.net</div>
        <div><strong style={{ color: "#1a0033" }}>연락처</strong> 031-994-7740</div>
      </div>

      <h2 style={styles.h2}>제8조 (방침 변경)</h2>
      <p style={styles.p}>
        본 방침이 변경되는 경우, 변경 사항은 본 페이지 공지를 통해 시행일과 함께 즉시 적용됩니다.
      </p>
    </DocPage>
  );
}
