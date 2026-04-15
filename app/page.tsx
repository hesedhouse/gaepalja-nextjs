import type { Metadata } from "next";
import SajuDogApp from "../components/SajuDogApp";
import { decodeShareData } from "../lib/shareCodec";
import { calcSaju, get오행of, 오행명, 오행이모지 } from "../lib/saju";
import { generateFortune } from "../lib/fortune";

type Props = { searchParams: { d?: string } };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gaepalja-nextjs.vercel.app";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const d = searchParams?.d;
  const decoded = d ? decodeShareData(d) : null;
  if (!decoded) {
    return {};
  }

  const hr = decoded.knowTime ? parseInt(decoded.birthHour) : 12;
  const saju = calcSaju(
    parseInt(decoded.birthYear),
    parseInt(decoded.birthMonth),
    parseInt(decoded.birthDay),
    hr
  );
  const el = get오행of(saju.day.간);
  const fortune = generateFortune(decoded.name, saju, decoded.breed);
  const title = `🐾 ${decoded.name}의 개팔자 — ${오행이모지[el]} ${fortune.성격.title}`;
  const description = `${decoded.breed} · ${오행명[el]}(${el}) 기운 · ${fortune.총운[0]} — 나도 우리 강아지 사주 보러가기`;
  const ogImage = `${SITE_URL}/api/og?d=${encodeURIComponent(d as string)}`;
  const pageUrl = `${SITE_URL}/?d=${encodeURIComponent(d as string)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: "ko_KR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Page() {
  return <SajuDogApp />;
}
