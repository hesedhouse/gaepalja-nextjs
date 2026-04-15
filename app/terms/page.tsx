import type { Metadata } from "next";
import DocPage from "../../components/DocPage";

export const metadata: Metadata = {
  title: "이용약관 — 개팔자",
  description: "개팔자 서비스 이용약관",
};

const styles = {
  h2: { fontSize: 15, fontWeight: 900, color: "#1a0033", marginTop: 20, marginBottom: 8 } as const,
  p: { marginBottom: 10 } as const,
  ol: { paddingLeft: 20, marginBottom: 12 } as const,
  li: { marginBottom: 6 } as const,
};

export default function TermsPage() {
  return (
    <DocPage
      title="이용약관"
      subtitle="개팔자(이하 '서비스')를 이용해주셔서 감사합니다. 본 약관은 헤세드하우스가 제공하는 본 서비스의 이용 조건을 규정합니다."
    >
      <p style={{ fontSize: 11, color: "#7c6f95", fontWeight: 700, marginBottom: 16 }}>
        시행일: 2026년 4월 15일
      </p>

      <h2 style={styles.h2}>제1조 (목적)</h2>
      <p style={styles.p}>
        본 약관은 헤세드하우스(이하 '회사')가 운영하는 '개팔자' 서비스(이하 '서비스')의 이용과 관련하여
        회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
      </p>

      <h2 style={styles.h2}>제2조 (서비스의 성격)</h2>
      <ol style={styles.ol}>
        <li style={styles.li}>
          본 서비스는 반려견의 정보를 바탕으로 사주풀이 콘텐츠를 제공하는 <strong>엔터테인먼트 목적</strong>의
          서비스입니다.
        </li>
        <li style={styles.li}>
          본 서비스에서 제공되는 사주 풀이, 운세, 궁합 등의 콘텐츠는 재미를 위한 것으로,
          실제 미래·성격·건강 등을 예측하거나 보장하지 않습니다.
        </li>
        <li style={styles.li}>
          본 서비스의 콘텐츠는 반려견 의료·훈련 전문가의 진단이나 자문을 대체할 수 없습니다.
          반려견의 건강 이상 시에는 반드시 수의사의 진료를 받으시기 바랍니다.
        </li>
      </ol>

      <h2 style={styles.h2}>제3조 (이용료)</h2>
      <p style={styles.p}>
        본 서비스는 <strong>전면 무료</strong>로 제공됩니다. 회사는 운영을 위해 카카오 AdFit 광고와
        쿠팡 파트너스 제휴 링크를 통해 수익을 얻습니다.
      </p>

      <h2 style={styles.h2}>제4조 (저작권)</h2>
      <ol style={styles.ol}>
        <li style={styles.li}>
          본 서비스의 모든 콘텐츠(풀이 텍스트, 디자인, 로고, 이미지 등)에 대한 저작권은 회사에 귀속됩니다.
        </li>
        <li style={styles.li}>
          이용자는 개인적이고 비상업적인 용도로 서비스 결과를 SNS·메신저 등에 공유할 수 있습니다.
        </li>
        <li style={styles.li}>
          회사의 사전 서면 동의 없이 서비스의 전부 또는 일부를 상업적 목적으로 복제·배포·가공할 수 없습니다.
        </li>
      </ol>

      <h2 style={styles.h2}>제5조 (책임의 제한)</h2>
      <p style={styles.p}>
        회사는 본 서비스가 엔터테인먼트 목적임을 명시하며, 이용자가 서비스 결과를 바탕으로 내린 판단·행동에
        대해 법적 책임을 지지 않습니다.
      </p>
      <p style={styles.p}>
        회사는 천재지변, 서버 장애, 제3자의 귀책사유 등으로 인한 서비스 중단에 대해 책임을 지지 않으며,
        이용자의 단말기·네트워크 환경에서 발생하는 문제는 이용자 본인의 책임입니다.
      </p>

      <h2 style={styles.h2}>제6조 (광고 및 제휴 링크)</h2>
      <ol style={styles.ol}>
        <li style={styles.li}>
          본 서비스는 카카오 AdFit을 통해 광고를 게재합니다. 광고 내용에 대한 책임은 해당 광고주에게 있습니다.
        </li>
        <li style={styles.li}>
          본 서비스의 쿠팡 제휴 링크는 쿠팡 파트너스 활동의 일환이며, 링크를 통한 구매 시 회사가
          일정 수수료를 지급받을 수 있습니다.
        </li>
      </ol>

      <h2 style={styles.h2}>제7조 (약관의 변경)</h2>
      <p style={styles.p}>
        회사는 필요시 약관을 개정할 수 있으며, 개정된 약관은 본 페이지 공지와 동시에 효력이 발생합니다.
      </p>

      <h2 style={styles.h2}>제8조 (문의처)</h2>
      <p style={styles.p}>
        본 약관에 관한 문의는 <strong>hesed@hesedhouse.net</strong>으로 연락주시기 바랍니다.
      </p>
    </DocPage>
  );
}
