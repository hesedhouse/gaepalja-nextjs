# 사주개팔자 (Gaepalja)

반려견 사주풀이 웹앱 — 천간지지·음양오행·십성·신살·합충·대운·세운·월운·궁합 분석.

## 기술 스택

- **Next.js 14** (App Router) + React 18 + TypeScript
- 정적 SPA 빌드 (서버 의존성 없음, Vercel Edge에서 즉시 서빙)
- 카카오 애드핏 (광고)
- 향후: PortOne 결제(990원 궁합), 쿠팡 파트너스, 카카오 공유

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## 빌드

```bash
npm run build
npm start
```

## 환경변수

`.env.local.example` 복사해서 `.env.local` 생성:

```bash
# 카카오 애드핏 광고단위 (https://adfit.kakao.com 발급)
NEXT_PUBLIC_ADFIT_LOADING_UNIT=DAN-xxxxxxxxxx
NEXT_PUBLIC_ADFIT_RESULT_UNIT=DAN-xxxxxxxxxx
NEXT_PUBLIC_ADFIT_BOTTOM_UNIT=DAN-xxxxxxxxxx

# 카카오 JavaScript SDK (공유 기능)
NEXT_PUBLIC_KAKAO_JS_KEY=

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://gaepalja-nextjs.vercel.app
```

환경변수가 비어있으면 광고는 placeholder로 표시됩니다 (개발 모드).

## 폴더 구조

```
gaepalja-nextjs/
├── app/
│   ├── layout.tsx       메타데이터, viewport, AdFit SDK 로드
│   └── page.tsx         메인 페이지 진입점
├── components/
│   ├── SajuDogApp.jsx   메인 UI (intro/form/loading/result + 6개 탭)
│   └── AdBanner.jsx     카카오 애드핏 컴포넌트
├── lib/
│   ├── saju.js          사주 엔진 (천간지지·대운·세운·월운)
│   └── fortune.js       운세 텍스트, 궁합, 쿠팡 추천
└── public/
```

## 배포

GitHub repo에 push하면 Vercel이 자동 배포합니다.

## 라이선스

(주)헤세드 · 사주개팔자 v3
