/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { decodeShareData } from "../../../lib/shareCodec";
import { calcSaju, get오행of, 오행명, 오행이모지, 오행색 } from "../../../lib/saju";
import { generateFortune } from "../../../lib/fortune";

export const runtime = "edge";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gaepalja-nextjs.vercel.app";

// Google Fonts CSS2 API에서 TTF/OTF 폰트 데이터 추출
// 구형 Android UA를 보내면 woff2/woff 대신 truetype URL을 돌려줌 — satori가 요구하는 포맷
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
      },
    })
  ).text();
  const m = css.match(/src:\s*url\((.+?)\)\s*format\('(opentype|truetype)'\)/);
  if (!m) throw new Error("Google Font TTF/OTF URL not found in CSS");
  const fontBuf = await fetch(m[1]).then((r) => r.arrayBuffer());
  return fontBuf;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const d = searchParams.get("d");
    const decoded = d ? decodeShareData(d) : null;

    if (!decoded) {
      // fallback — 파라미터 없을 때는 로고 중심의 기본 브랜드 카드
      const fallbackText = "개팔자우리강아지사주풀이천간지지오행";
      const fallbackBold = await loadGoogleFont("Noto+Sans+KR", 900, fallbackText);
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(180deg,#ffe6f0 0%,#ffe9c2 35%,#c2f0ff 100%)",
              padding: "60px 80px",
              fontFamily: "NotoKR",
            }}
          >
            {/* 좌: 로고 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={`${SITE_URL}/logo.png`}
                width={420}
                height={420}
                alt="개팔자"
                style={{
                  borderRadius: 36,
                  border: "8px solid #1a0033",
                  boxShadow: "12px 12px 0 #1a0033",
                }}
              />
            </div>
            {/* 우: 브랜드 텍스트 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 60,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 96,
                  fontWeight: 900,
                  color: "#1a0033",
                  lineHeight: 1.1,
                  letterSpacing: -2,
                }}
              >
                🐾 개팔자
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#ff3e9d",
                  marginTop: 16,
                }}
              >
                우리 강아지 사주풀이
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#4b3b6b",
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                천간지지 · 음양오행으로 풀어보는
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#4b3b6b",
                  lineHeight: 1.5,
                }}
              >
                반려견 사주팔자 · 토정비결
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            { name: "NotoKR", data: fallbackBold, weight: 900, style: "normal" },
          ],
        }
      );
    }

    // 사주 계산
    const hr = decoded.knowTime ? parseInt(decoded.birthHour) : 12;
    const saju = calcSaju(
      parseInt(decoded.birthYear),
      parseInt(decoded.birthMonth),
      parseInt(decoded.birthDay),
      hr
    );
    const el = get오행of(saju.day.간);
    const fortune = generateFortune(decoded.name, saju, decoded.breed);
    const elName = 오행명[el];
    const elEmoji = 오행이모지[el];
    const elColor = 오행색[el];
    const personaTitle = fortune.성격.title;
    const 총운요약 = fortune.총운[0];

    // 이미지에서 쓸 모든 한글 텍스트를 모아 Google Fonts 서브셋 요청
    const textForSubset = [
      "개팔자",
      "우리 강아지 사주",
      "나도 보러가기",
      "기운",
      decoded.name,
      decoded.breed,
      decoded.gender,
      elName,
      personaTitle,
      총운요약,
      el,
    ].join("");

    const [regular, bold] = await Promise.all([
      loadGoogleFont("Noto+Sans+KR", 500, textForSubset),
      loadGoogleFont("Noto+Sans+KR", 900, textForSubset),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(180deg,#ffe6f0 0%,#ffe9c2 35%,#c2f0ff 100%)",
            padding: "50px 60px 40px",
            fontFamily: "NotoKR",
          }}
        >
          {/* 상단 브랜드 바 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 36,
                fontWeight: 900,
                color: "#1a0033",
              }}
            >
              🐾 개팔자
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 500,
                color: "#7c6f95",
              }}
            >
              gaepalja.vercel.app
            </div>
          </div>

          {/* 메인 카드 */}
          <div
            style={{
              flex: 1,
              marginTop: 28,
              display: "flex",
              background: "#ffffff",
              border: "6px solid #1a0033",
              borderRadius: 32,
              padding: "36px 44px",
              boxShadow: "8px 8px 0 #1a0033",
            }}
          >
            {/* 왼쪽: 이름·견종·페르소나 */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#ff3e9d",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                우리 강아지 사주풀이
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 92,
                  fontWeight: 900,
                  color: "#1a0033",
                  lineHeight: 1.05,
                  marginBottom: 10,
                }}
              >
                {decoded.name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#4b3b6b",
                  marginBottom: 22,
                }}
              >
                {decoded.breed} · {decoded.gender}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 900,
                  color: elColor,
                  lineHeight: 1.25,
                }}
              >
                “{personaTitle}”
              </div>
            </div>

            {/* 오른쪽: 오행 원 */}
            <div
              style={{
                width: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  background: `${elColor}22`,
                  border: `6px solid ${elColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 140,
                  boxShadow: "6px 6px 0 #1a0033",
                }}
              >
                {elEmoji}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 34,
                  fontWeight: 900,
                  color: elColor,
                  display: "flex",
                }}
              >
                {elName}({el}) 기운
              </div>
            </div>
          </div>

          {/* 하단 CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
              padding: "14px 28px",
              background: "#ff3e9d",
              border: "5px solid #1a0033",
              borderRadius: 60,
              fontSize: 28,
              fontWeight: 900,
              color: "#ffffff",
              alignSelf: "center",
              boxShadow: "5px 5px 0 #1a0033",
            }}
          >
            🔮 나도 우리 강아지 사주 보러가기
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "NotoKR", data: regular, weight: 500, style: "normal" },
          { name: "NotoKR", data: bold, weight: 900, style: "normal" },
        ],
      }
    );
  } catch (e) {
    console.error("[og] error:", e);
    return new Response(`OG generation failed: ${(e as Error).message}`, {
      status: 500,
    });
  }
}
