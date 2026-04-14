// 쿠팡 파트너스 Open API → 오행별 추천 상품 자동 수집
// 빌드 타임에 한 번 실행 → public/coupang-recs.json 생성
// 사용: node scripts/fetch-coupang.mjs

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY;
const SECRET_KEY = process.env.COUPANG_SECRET_KEY;
const HOST = "api-gateway.coupang.com";
const SUBID = "gaepalja"; // 트래킹용

if (!ACCESS_KEY || !SECRET_KEY) {
  console.warn("⚠️  COUPANG_ACCESS_KEY/SECRET_KEY 환경변수 없음 — fallback 데이터 사용");
  process.exit(0); // 빌드 깨뜨리지 않음
}

// HMAC-SHA256 서명 생성
function generateAuth(method, urlPath) {
  const datetime = new Date().toISOString().substr(2, 17).replace(/:/gi, "").replace(/-/gi, "") + "Z";
  // 형식: YYMMDDTHHmmssZ (예: 240315T143025Z)
  const formattedDate = datetime.substring(0, 8) + "T" + datetime.substring(9, 15) + "Z";
  // 더 정확하게: substr(2,17) 결과는 "YY-MM-DDTHH:mm:ss" (17자) → 정리 필요
  return signRequest(method, urlPath);
}

function signRequest(method, urlPath) {
  const now = new Date();
  // 형식: YYMMDD'T'HHmmss'Z' (예: 240315T143025Z)
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mi = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  const datetime = `${yy}${mm}${dd}T${hh}${mi}${ss}Z`;

  const [pathname, query] = urlPath.split("?");
  const message = datetime + method + pathname + (query || "");

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("hex");

  const authorization = `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
  return authorization;
}

async function searchCoupang(keyword, limit = 5) {
  const urlPath = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&subId=${SUBID}`;
  const authorization = signRequest("GET", urlPath);

  const url = `https://${HOST}${urlPath}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`  ⚠️  검색 실패 [${keyword}]: ${res.status} ${text.slice(0, 200)}`);
      return [];
    }
    const data = await res.json();
    return data?.data?.productData || [];
  } catch (e) {
    console.warn(`  ⚠️  검색 오류 [${keyword}]:`, e.message);
    return [];
  }
}

// 오행별 검색 키워드
const KEYWORDS = {
  木: [
    { key: "유기농 강아지 사료", tag: "건강사료" },
    { key: "강아지 원목 장난감", tag: "장난감" },
  ],
  火: [
    { key: "강아지 연어 오메가3", tag: "건강간식" },
    { key: "강아지 쿨매트", tag: "여름용품" },
  ],
  土: [
    { key: "강아지 유산균", tag: "건강보조" },
    { key: "강아지 메모리폼 침대", tag: "침구" },
  ],
  金: [
    { key: "강아지 피부 영양제", tag: "영양제" },
    { key: "강아지 스테인리스 급수기", tag: "급수용품" },
  ],
  水: [
    { key: "강아지 정수 급수대", tag: "급수용품" },
    { key: "강아지 방수 레인코트", tag: "의류" },
  ],
};

const MISSING_KEYWORDS = {
  木: { key: "강아지 사슴뿔 간식", tag: "木보완" },
  火: { key: "강아지 LED 산책줄", tag: "火보완" },
  土: { key: "강아지 양모 방석", tag: "土보완" },
  金: { key: "강아지 노즈워크 볼", tag: "金보완" },
  水: { key: "강아지 분수 장난감", tag: "水보완" },
};

const SIZE_KEYWORDS = {
  소형: { key: "소형견 덴탈껌", tag: "구강관리" },
  대형: { key: "대형견 관절 영양제", tag: "관절관리" },
};

function pickBest(products) {
  if (!products || products.length === 0) return null;
  // 카테고리 1순위 + rocket배송 우선
  const sorted = [...products].sort((a, b) => {
    if (a.isRocket && !b.isRocket) return -1;
    if (!a.isRocket && b.isRocket) return 1;
    return 0;
  });
  const p = sorted[0];
  return {
    name: p.productName,
    price: p.productPrice ? p.productPrice.toLocaleString() + "원" : "",
    image: p.productImage,
    url: p.productUrl,
    isRocket: !!p.isRocket,
  };
}

async function fetchAll() {
  console.log("🛒 쿠팡 Open API → 상품 수집 시작\n");

  const result = { 오행: {}, 보완: {}, 체급: {}, generated: new Date().toISOString() };

  for (const [el, items] of Object.entries(KEYWORDS)) {
    result.오행[el] = [];
    for (const { key, tag } of items) {
      console.log(`  [${el}] ${key}`);
      const products = await searchCoupang(key, 5);
      const best = pickBest(products);
      if (best) {
        result.오행[el].push({ ...best, tag });
        console.log(`    ✓ ${best.name.slice(0, 40)} ${best.price}`);
      }
      await new Promise(r => setTimeout(r, 200)); // rate limit 보호
    }
  }

  for (const [el, { key, tag }] of Object.entries(MISSING_KEYWORDS)) {
    console.log(`  [보완:${el}] ${key}`);
    const products = await searchCoupang(key, 5);
    const best = pickBest(products);
    if (best) {
      result.보완[el] = { ...best, tag };
      console.log(`    ✓ ${best.name.slice(0, 40)} ${best.price}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  for (const [size, { key, tag }] of Object.entries(SIZE_KEYWORDS)) {
    console.log(`  [체급:${size}] ${key}`);
    const products = await searchCoupang(key, 5);
    const best = pickBest(products);
    if (best) {
      result.체급[size] = { ...best, tag };
      console.log(`    ✓ ${best.name.slice(0, 40)} ${best.price}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  const outPath = path.join(process.cwd(), "public", "coupang-recs.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`\n✅ 저장 완료: ${outPath}`);
  console.log(`   오행 ${Object.values(result.오행).flat().length}개 + 보완 ${Object.keys(result.보완).length}개 + 체급 ${Object.keys(result.체급).length}개`);
}

fetchAll().catch(e => {
  console.error("쿠팡 수집 실패:", e);
  process.exit(0); // 실패해도 빌드는 계속 (fallback 데이터 사용)
});
