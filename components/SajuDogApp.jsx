"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  천간, 지지, 오행명, 오행색, 오행이모지, 견종데이터, 견종목록,
  calcSaju, get오행of, get신살, calc합충, calc대운, calc세운, calc월운,
  dog2human, hexRgb,
} from "../lib/saju";
import { generateFortune, calcOwnerCompat, getCoupangRecs } from "../lib/fortune";
import coupangCache from "../public/coupang-recs.json";
import AdBanner from "./AdBanner";

// ─── DESIGN TOKENS (90s POP) ────────────────────────────────
const C = {
  bg: "linear-gradient(180deg,#ffe6f0 0%,#ffe9c2 35%,#c2f0ff 100%)",
  cardBg: "#ffffff",
  cardBorder: "#1a0033",
  text: "#1a0033",
  textMid: "#4b3b6b",
  textLight: "#7c6f95",
  pink: "#ff3e9d",
  pinkDark: "#d61b75",
  cyan: "#00cfff",
  yellow: "#ffd400",
  green: "#3ddc84",
  red: "#ff5252",
  shadow: "4px 4px 0 #1a0033",
  shadowLarge: "6px 6px 0 #1a0033",
};

const FONT = "'Cafe24Ssurround','Pretendard Variable','Pretendard',sans-serif";

// ─── UI HELPERS ─────────────────────────────────────────────
function PopParticles(){
  const s=["★","✦","♥","✧","●","▲","■","◆"];
  const cs=[C.pink, C.cyan, C.yellow, C.green];
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    {Array.from({length:18}).map((_,i)=>(<div key={i} style={{position:"absolute",left:`${(i*7.3)%100}%`,top:`${(i*13.7)%100}%`,fontSize:`${14+((i*3)%18)}px`,opacity:0.25+((i%4)*0.05),color:cs[i%cs.length],animation:`fp ${10+(i%8)*2}s ease-in-out infinite`,animationDelay:`${-(i*1.3)}s`,fontWeight:900}}>{s[i%s.length]}</div>))}
  </div>);
}

function Header({ showBack, onBack, onHome }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 4px 18px"}}>
      <button
        onClick={onBack}
        disabled={!showBack}
        style={{
          display:"flex",alignItems:"center",gap:6,
          background:showBack?C.cyan:"transparent",
          border:showBack?`3px solid ${C.cardBorder}`:"3px solid transparent",
          borderRadius:50,padding:showBack?"8px 16px":"8px 0",
          fontSize:13,fontWeight:900,fontFamily:FONT,color:C.text,
          cursor:showBack?"pointer":"default",
          boxShadow:showBack?C.shadow:"none",
          transition:"transform 0.15s",
        }}
        onMouseEnter={e=>{if(showBack)e.currentTarget.style.transform="translate(-2px,-2px)"}}
        onMouseLeave={e=>{if(showBack)e.currentTarget.style.transform="translate(0,0)"}}
      >
        {showBack && <><span style={{fontSize:18,lineHeight:1}}>←</span><span>BACK</span></>}
      </button>
      <button
        onClick={onHome}
        style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}
      >
        <Image src="/logo.png" alt="개팔자" width={40} height={40} style={{borderRadius:10,border:`2px solid ${C.cardBorder}`,boxShadow:"2px 2px 0 #1a0033"}}/>
        <span style={{fontSize:18,fontWeight:900,color:C.text,fontFamily:FONT,letterSpacing:-0.5}}>개팔자</span>
      </button>
    </div>
  );
}

function SajuMiniTable({saju,일간,compact}){
  const cols=[{l:"시",d:saju.hour},{l:"일",d:saju.day},{l:"월",d:saju.month},{l:"년",d:saju.year}];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:compact?4:8,textAlign:"center"}}>
      {cols.map(c=><div key={c.l} style={{fontSize:compact?10:11,color:C.textLight,padding:"2px 0",fontWeight:700}}>{c.l}</div>)}
      {cols.map((c,i)=>{const el=get오행of(c.d.간);return(
        <div key={`g${i}`} style={{background:`${오행색[el]}22`,border:`3px solid ${C.cardBorder}`,borderRadius:compact?8:12,padding:compact?"8px 0":"12px 0",boxShadow:"3px 3px 0 #1a0033"}}>
          <div style={{fontSize:compact?20:28,fontWeight:900,color:오행색[el]}}>{c.d.간}</div>
          <div style={{fontSize:compact?20:28,fontWeight:900,color:C.text,marginTop:2}}>{c.d.지}</div>
        </div>
      );})}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function SajuDogApp() {
  const [step,setStep] = useState("intro");
  const [name,setName] = useState("");
  const [breed,setBreed] = useState("");
  const [gender,setGender] = useState("");
  const [birthYear,setBY] = useState("");
  const [birthMonth,setBM] = useState("");
  const [birthDay,setBD] = useState("");
  const [birthHour,setBH] = useState("12");
  const [knowTime,setKT] = useState(true);
  const [result,setResult] = useState(null);
  const [loadIdx,setLI] = useState(0);
  const [tab,setTab] = useState("saju");

  const [ownerPaid,setOP] = useState(false);
  const [ownerName,setON] = useState("");
  const [ownerBY,setOBY] = useState("");
  const [ownerBM,setOBM] = useState("");
  const [ownerBD,setOBD] = useState("");
  const [ownerBH,setOBH] = useState("12");
  const [ownerKT,setOKT] = useState(true);
  const [ownerResult,setOR] = useState(null);
  // 광고 보상형 궁합: idle → adWatching(카운트다운) → done(결과 표시)
  const [adStep,setAdStep] = useState("idle");
  const [adCountdown,setAdCountdown] = useState(3);

  const [showShare,setSS] = useState(false);
  const [copied,setCopied] = useState(false);
  const [capturing,setCapturing] = useState(false);
  const [saving,setSaving] = useState(false);

  const resultRef = useRef(null);
  const shareRef = useRef(null);

  const loadMsgs = ["🔮 천간지지를 배열하는 중...","☯ 음양오행의 균형을 살피는 중...","📜 십성과 신살을 분석하는 중...","🐾 대운의 흐름을 읽는 중...","⭐ 2026년 토정비결을 작성하는 중..."];

  useEffect(()=>{
    if(step==="loading"){
      const iv=setInterval(()=>{
        setLI(p=>{
          if(p>=loadMsgs.length-1){
            clearInterval(iv);
            const hr=knowTime?parseInt(birthHour):12;
            const saju=calcSaju(parseInt(birthYear),parseInt(birthMonth),parseInt(birthDay),hr);
            const 일간=saju.day.간,el=get오행of(일간);
            const els=[get오행of(saju.year.간),get오행of(saju.month.간),get오행of(saju.day.간),get오행of(saju.hour.간)];
            const counts={};els.forEach(e=>counts[e]=(counts[e]||0)+1);
            const missing=["木","火","土","金","水"].filter(e=>!counts[e]);
            const 신살=get신살(saju),합충=calc합충(saju);
            const dw=calc대운(saju,parseInt(birthYear),breed);
            const 세운=calc세운(saju,2026),월운=calc월운(saju,2026);
            const fortune=generateFortune(name,saju,breed);
            const coupang=getCoupangRecs(coupangCache,el,missing,breed);
            const currentDogAge=2026-parseInt(birthYear);
            setResult({saju,일간,el,counts,missing,신살,합충,대운:dw.대운목록,대운주기:dw.주기,평균수명:dw.수명,체급:dw.체급,currentDogAge,세운,월운,fortune,coupang,name,breed,gender});
            setStep("result");
            return p;
          }
          return p+1;
        });
      },800);
      return()=>clearInterval(iv);
    }
  },[step]);

  useEffect(()=>{if(step==="result"&&resultRef.current)resultRef.current.scrollIntoView({behavior:"smooth"});},[step]);

  const canSubmit=name&&breed&&gender&&birthYear&&birthMonth&&birthDay;
  const handleSubmit=()=>{if(canSubmit){setLI(0);setStep("loading");}};
  const reset=()=>{setStep("intro");setName("");setBreed("");setGender("");setBY("");setBM("");setBD("");setBH("12");setKT(true);setResult(null);setTab("saju");setOP(false);setOR(null);setAdStep("idle");setAdCountdown(3);};
  const goBack=()=>{
    if(step==="form")setStep("intro");
    else if(step==="loading")setStep("form");
    else if(step==="result")setStep("form");
  };
  const goCompat=()=>{setTab("compat");if(resultRef.current)resultRef.current.scrollIntoView({behavior:"smooth"});};

  const handleOwnerAnalysis = () => {
    if(!ownerName||!ownerBY||!ownerBM||!ownerBD) return;
    // 1. 광고 시청 시작 (3초 카운트다운)
    setAdStep("watching");
    setAdCountdown(3);
  };

  // 광고 카운트다운 타이머
  useEffect(()=>{
    if(adStep!=="watching") return;
    if(adCountdown<=0){
      // 카운트다운 끝 → 궁합 계산 + 결과 표시
      const hr=ownerKT?parseInt(ownerBH):12;
      const ownerSaju=calcSaju(parseInt(ownerBY),parseInt(ownerBM),parseInt(ownerBD),hr);
      const compat=calcOwnerCompat(result.saju,ownerSaju,result.name);
      setOR({saju:ownerSaju,compat,name:ownerName});
      setOP(true);
      setAdStep("done");
      return;
    }
    const t=setTimeout(()=>setAdCountdown(c=>c-1),1000);
    return ()=>clearTimeout(t);
  },[adStep,adCountdown]);

  const years=Array.from({length:100},(_,i)=>2026-i);
  const dogYears=Array.from({length:30},(_,i)=>2026-i);
  const months=Array.from({length:12},(_,i)=>i+1);
  const days=Array.from({length:31},(_,i)=>i+1);
  const hours=Array.from({length:24},(_,i)=>i);
  const 시지명=["子","丑","丑","寅","寅","卯","卯","辰","辰","巳","巳","午","午","未","未","申","申","酉","酉","戌","戌","亥","亥","子"];

  const getShareText = () => {
    if(!result) return "";
    const el=result.el;
    return `🐾 개팔자 감정 결과\n\n🐕 ${result.name} (${result.breed})\n${오행이모지[el]} ${오행명[el]}(${el}) 기운의 "${result.fortune.성격.title}"\n\n📜 2026년 총운: ${result.fortune.총운[0]}\n${result.fortune.총운[2].slice(0,60)}...\n\n🔮 우리 강아지 사주 보러가기 👇\n${process.env.NEXT_PUBLIC_SITE_URL || "https://gaepalja-nextjs.vercel.app"}`;
  };

  // 카카오톡 공유하기 — Kakao SDK가 로드되어 있으면 sendDefault 호출, 아니면 텍스트 복사 fallback
  const handleKakaoShare = () => {
    if(!result) return;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaepalja-nextjs.vercel.app";
    const el = result.el;
    const title = `🐾 ${result.name}의 개팔자 결과`;
    const description = `${오행이모지[el]} ${오행명[el]}(${el}) 기운의 "${result.fortune.성격.title}"\n${result.fortune.총운[0]}`;

    if (typeof window !== "undefined" && window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description,
            imageUrl: `${siteUrl}/logo.png`,
            link: { mobileWebUrl: siteUrl, webUrl: siteUrl },
          },
          buttons: [
            {
              title: "🔮 나도 우리 강아지 사주 보기",
              link: { mobileWebUrl: siteUrl, webUrl: siteUrl },
            },
          ],
        });
        return;
      } catch (e) {
        console.warn("Kakao Share failed, falling back to clipboard:", e);
      }
    }
    // Fallback: 텍스트 복사 + 모달
    setSS(true);
  };

  // 결과 화면을 PNG로 저장 — 워터마크 + iOS fallback 포함
  const handleDownloadImage = async () => {
    if(!result || !resultRef.current || saving) return;
    setSaving(true);
    setCapturing(true);
    // DOM 업데이트 대기 (capture-hide 적용)
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // 모든 자손 요소의 animation을 강제로 종료하고 opacity:1 인라인 주입
    // (CSS !important 규칙이 html2canvas 환경에서 무시되는 경우에 대한 강제 대응)
    const node0 = resultRef.current;
    const allDescendants = node0 ? node0.querySelectorAll("*") : [];
    const prevStyles = [];
    allDescendants.forEach((el) => {
      prevStyles.push({
        el,
        animation: el.style.animation,
        opacity: el.style.opacity,
        transform: el.style.transform,
      });
      el.style.animation = "none";
      el.style.opacity = "1";
      // transform은 레이아웃에 영향 있을 수 있으니 안 건드림
    });

    // 웹폰트 로딩 확인
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }
    // 레이아웃 안정화
    await new Promise(r => setTimeout(r, 150));

    try {
      const html2canvas = (await import("html2canvas")).default;
      const node = resultRef.current;
      const srcCanvas = await html2canvas(node, {
        backgroundColor: "#ffe6f0",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
        // html2canvas는 DOM을 clone해서 off-screen에서 렌더하므로
        // clone된 doc에 애니메이션 무효화 스타일을 주입해야 fadeIn 등이 초기 상태(opacity:0)로 찍히지 않음
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style");
          style.textContent = `
            *,*::before,*::after{animation:none !important;transition:none !important}
            *{opacity:1 !important}
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      console.log("[capture] src canvas:", srcCanvas.width, "x", srcCanvas.height);

      // 워터마크 바 높이: scale:2 감안해서 물리 픽셀 기준 120px
      const barH = 120;
      const w = srcCanvas.width;
      const h = srcCanvas.height + barH;

      // 원본 + 워터마크 합성용 새 캔버스
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // 배경 채우기 (원본 영역 밖 여백 방지)
      ctx.fillStyle = "#ffe6f0";
      ctx.fillRect(0, 0, w, h);

      // 원본 결과 캡처 복사
      ctx.drawImage(srcCanvas, 0, 0);

      // 워터마크 바: 흰 배경 + 상단 네이비 라인
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, srcCanvas.height, w, barH);
      ctx.fillStyle = "#1a0033";
      ctx.fillRect(0, srcCanvas.height, w, 6);

      // 워터마크 텍스트 (canvas-safe 폰트 사용)
      ctx.fillStyle = "#1a0033";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 34px 'Pretendard Variable', Pretendard, -apple-system, sans-serif";
      ctx.fillText("🐾 개팔자 · 우리 강아지 사주풀이", w/2, srcCanvas.height + 42);
      ctx.fillStyle = "#ff3e9d";
      ctx.font = "800 26px 'Pretendard Variable', Pretendard, -apple-system, sans-serif";
      ctx.fillText("gaepalja-nextjs.vercel.app", w/2, srcCanvas.height + 85);

      const filename = `개팔자_${result.name}_${Date.now()}.png`;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isIOS) {
        // iOS Safari는 download 속성 무시 → 새 탭에 이미지 띄우고 안내
        const dataUrl = canvas.toDataURL("image/png");
        const win = window.open();
        if (win) {
          win.document.write(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${filename}</title><style>body{margin:0;padding:16px;background:#ffe6f0;font-family:-apple-system,sans-serif;text-align:center}img{max-width:100%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15)}p{color:#1a0033;font-weight:700;margin-top:16px;font-size:14px;line-height:1.5}</style></head><body><img src="${dataUrl}" alt="개팔자 결과"/><p>👆 이미지를 <b>길게 눌러</b><br/>'사진에 저장'을 선택해주세요</p></body></html>`);
          win.document.close();
        } else {
          alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
        }
      } else {
        canvas.toBlob((blob) => {
          if(!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, "image/png");
      }
    } catch (e) {
      console.error("이미지 저장 실패:", e);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 인라인 스타일 원복
      prevStyles.forEach(({ el, animation, opacity }) => {
        el.style.animation = animation || "";
        el.style.opacity = opacity || "";
      });
      setCapturing(false);
      setSaving(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:FONT,position:"relative"}}>
      <style>{`
        @keyframes fp{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-25px) rotate(8deg)}66%{transform:translateY(-40px) rotate(-5deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes wiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
        @keyframes scoreCount{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,button{font-family:${FONT}}
        .anim{animation:fadeIn 0.55s ease-out both}
        .anim-d1{animation-delay:0.08s}.anim-d2{animation-delay:0.16s}.anim-d3{animation-delay:0.24s}
        .anim-d4{animation-delay:0.32s}.anim-d5{animation-delay:0.40s}.anim-d6{animation-delay:0.48s}
        .tab-btn{background:#fff;border:3px solid #1a0033;padding:9px 14px;font-size:12px;font-weight:900;font-family:${FONT};cursor:pointer;border-radius:50px;transition:all 0.15s;color:#1a0033;white-space:nowrap;box-shadow:3px 3px 0 #1a0033}
        .tab-btn:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #1a0033}
        .tab-btn.active{background:#ff3e9d;color:#fff}
        .premium-glow{animation:pulse 2s ease-in-out infinite}
        .pop-btn{transition:all 0.15s}
        .pop-btn:hover{transform:translate(-2px,-2px)}
        .pop-btn:active{transform:translate(0,0)}
        .capturing .capture-hide{display:none !important}
        .capturing .anim,.capturing [class*="anim-d"]{animation:none !important;opacity:1 !important;transform:none !important}
        .capturing *{animation-play-state:paused !important}
      `}</style>

      <PopParticles/>

      <div style={{position:"relative",zIndex:1,maxWidth:540,margin:"0 auto",padding:"0 16px 60px"}}>

        {/* HEADER (모든 페이지 공통) */}
        <Header showBack={step!=="intro"} onBack={goBack} onHome={reset}/>

        {/* ═══ INTRO ═══ */}
        {step==="intro"&&(
          <div style={{textAlign:"center",animation:"fadeIn 0.7s ease-out"}}>
            <div style={{margin:"8px auto 20px",display:"inline-block",animation:"wiggle 4s ease-in-out infinite"}}>
              <Image src="/logo.png" alt="개팔자" width={280} height={280} priority style={{borderRadius:24,border:`5px solid ${C.cardBorder}`,boxShadow:C.shadowLarge,maxWidth:"80vw",height:"auto"}}/>
            </div>

            <p style={{fontSize:14,fontWeight:700,color:C.pinkDark,marginBottom:6,letterSpacing:1}}>ZERO EFFORT, MAXIMUM COMFORT</p>
            <p style={{fontSize:13,color:C.textMid,marginBottom:24,lineHeight:1.7,fontWeight:700}}>천간지지·음양오행으로 풀어주는<br/>우리 강아지 사주풀이</p>

            <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:32}}>
              {["木","火","土","金","水"].map((el,i)=>(
                <div key={el} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,animation:`fadeIn 0.5s ease-out ${0.3+i*0.08}s both`}}>
                  <div style={{width:48,height:48,borderRadius:"50%",background:`${오행색[el]}33`,border:`3px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"2px 2px 0 #1a0033"}}>{오행이모지[el]}</div>
                  <span style={{fontSize:10,color:C.text,fontWeight:900}}>{오행명[el]}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>setStep("form")} className="pop-btn" style={{
              background:C.pink,color:"#fff",border:`4px solid ${C.cardBorder}`,
              borderRadius:50,padding:"18px 56px",fontSize:18,fontWeight:900,
              cursor:"pointer",boxShadow:C.shadowLarge,
            }}>🔮 무료 사주 감정</button>

            <button onClick={()=>setStep("form")} className="pop-btn" style={{display:"block",width:"100%",marginTop:24,padding:"14px 20px",borderRadius:18,background:C.yellow,border:`3px solid ${C.cardBorder}`,boxShadow:C.shadow,cursor:"pointer",fontFamily:FONT,textAlign:"left"}}>
              <div style={{fontSize:13,color:C.text,fontWeight:900,marginBottom:4}}>💕 PREMIUM — 주인+강아지 궁합</div>
              <div style={{fontSize:12,color:C.textMid,fontWeight:700}}>사주팔자로 보는 둘의 궁합 · <span style={{color:C.pinkDark,fontWeight:900}}>🎁 무료</span></div>
            </button>

            <div style={{marginTop:20,padding:"16px 20px",borderRadius:18,background:"#fff",border:`3px solid ${C.cardBorder}`,boxShadow:C.shadow,fontSize:12,color:C.textMid,lineHeight:1.9,textAlign:"left",fontWeight:700}}>
              ✦ 사주 원국 · 오행 · 십성 · 신살 · 합충<br/>
              ✦ 견종별 수명 반영 대운 · 월운<br/>
              ✦ 2026년 토정비결 운세<br/>
              ✦ 성격 · 건강 · 반려인 궁합<br/>
              ✦ 오행 맞춤 펫용품 추천
            </div>
          </div>
        )}

        {/* ═══ FORM ═══ */}
        {step==="form"&&(
          <div style={{animation:"fadeIn 0.5s ease-out"}}>
            <h2 style={{fontSize:26,fontWeight:900,color:C.text,textAlign:"center",marginBottom:6}}>🐾 반려견 정보</h2>
            <p style={{fontSize:13,color:C.textMid,textAlign:"center",marginBottom:24,fontWeight:700}}>정확한 사주를 위해 생년월일을 입력해주세요</p>

            <div style={{marginBottom:18}}>
              <label style={lbl}>이름</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="강아지 이름" style={inp} maxLength={20}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={lbl}>견종</label>
              <select value={breed} onChange={e=>setBreed(e.target.value)} style={inp}>
                <option value="">견종 선택</option>
                {견종목록.map(b=><option key={b} value={b}>{b} (평균 {견종데이터[b].수명}세)</option>)}
              </select>
            </div>
            <div style={{marginBottom:18}}>
              <label style={lbl}>성별</label>
              <div style={{display:"flex",gap:10}}>
                {["수컷 ♂","암컷 ♀"].map(g=>(
                  <button key={g} onClick={()=>setGender(g)} style={{flex:1,padding:"14px 0",borderRadius:50,fontSize:14,fontWeight:900,fontFamily:FONT,cursor:"pointer",border:`3px solid ${C.cardBorder}`,background:gender===g?C.cyan:"#fff",color:C.text,boxShadow:gender===g?C.shadow:"none",transition:"all 0.15s"}}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={lbl}>생년월일</label>
              <div style={{display:"flex",gap:6}}>
                <select value={birthYear} onChange={e=>setBY(e.target.value)} style={{...inp,flex:1.2}}><option value="">년</option>{dogYears.map(y=><option key={y} value={y}>{y}년</option>)}</select>
                <select value={birthMonth} onChange={e=>setBM(e.target.value)} style={{...inp,flex:1}}><option value="">월</option>{months.map(m=><option key={m} value={m}>{m}월</option>)}</select>
                <select value={birthDay} onChange={e=>setBD(e.target.value)} style={{...inp,flex:1}}><option value="">일</option>{days.map(d=><option key={d} value={d}>{d}일</option>)}</select>
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <label style={{...lbl,marginBottom:0}}>태어난 시간</label>
                <button onClick={()=>setKT(!knowTime)} style={{background:"none",border:"none",color:C.pinkDark,fontSize:11,cursor:"pointer",fontFamily:FONT,fontWeight:900,textDecoration:"underline"}}>{knowTime?"모르겠어요":"알아요"}</button>
              </div>
              {knowTime?(<select value={birthHour} onChange={e=>setBH(e.target.value)} style={inp}>{hours.map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}시 ({시지명[h]}시)</option>)}</select>):(<p style={{fontSize:11,color:C.textLight,padding:"6px 0",fontWeight:700}}>※ 시간 미상 시 午시(정오)로 계산</p>)}
            </div>
            <button onClick={handleSubmit} disabled={!canSubmit} className="pop-btn" style={{width:"100%",background:canSubmit?C.pink:"#e8e0ed",color:canSubmit?"#fff":"#aaa",border:`4px solid ${canSubmit?C.cardBorder:"#ccc"}`,borderRadius:50,padding:"16px",fontSize:17,fontWeight:900,fontFamily:FONT,cursor:canSubmit?"pointer":"not-allowed",boxShadow:canSubmit?C.shadowLarge:"none"}}>🔮 사주 감정하기</button>
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {step==="loading"&&(
          <div style={{textAlign:"center",paddingTop:40,animation:"fadeIn 0.4s ease-out"}}>
            <div style={{fontSize:64,animation:"spin 4s linear infinite",marginBottom:24,color:C.pink}}>☯</div>
            <p style={{fontSize:16,color:C.text,marginBottom:18,minHeight:48,fontWeight:900}}>{loadMsgs[loadIdx]}</p>
            <div style={{width:240,height:8,background:"#fff",borderRadius:50,margin:"0 auto",overflow:"hidden",border:`2px solid ${C.cardBorder}`}}>
              <div style={{width:`${((loadIdx+1)/loadMsgs.length)*100}%`,height:"100%",background:C.pink,transition:"width 0.7s ease"}}/>
            </div>
            <AdBanner type="loading"/>
            <p style={{fontSize:11,color:C.textLight,marginTop:8,fontWeight:700}}>잠시만 기다려주세요...</p>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {step==="result"&&result&&(
          <div ref={resultRef} className={capturing?"capturing":""} style={{animation:"fadeIn 0.5s ease-out"}}>
            <div className="anim" style={{textAlign:"center",marginBottom:18}}>
              <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:4}}>{result.name}</h2>
              <p style={{fontSize:12,color:C.textMid,fontWeight:700}}>{result.breed} · {result.gender} · {birthYear}.{birthMonth}.{birthDay}</p>
            </div>

            <div className="capture-hide"><AdBanner type="result"/></div>

            <div className="anim anim-d1 capture-hide" style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",whiteSpace:"nowrap",paddingBottom:6}}>
              {[
                {id:"saju",label:"사주원국"},
                {id:"fortune",label:"토정비결"},
                {id:"monthly",label:"월운"},
                {id:"daewoon",label:"대운"},
                {id:"compat",label:"💕궁합"},
                {id:"shop",label:"🛒추천"},
              ].map(t=>(
                <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab==="saju"&&(
              <div>
                <div className="anim anim-d2" style={card}>
                  <h3 style={secT}>📜 사주 원국</h3>
                  <SajuMiniTable saju={result.saju} 일간={result.일간}/>
                </div>
                {result.합충.length>0&&(
                  <div className="anim anim-d3" style={card}>
                    <h3 style={secT}>⚡ 합·충</h3>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {result.합충.map((r,i)=>(<span key={i} style={{padding:"6px 12px",borderRadius:50,fontSize:12,fontWeight:900,background:r.type==="합"?C.green:C.red,color:"#fff",border:`2px solid ${C.cardBorder}`}}>{r.detail}</span>))}
                    </div>
                  </div>
                )}
                <div className="anim anim-d3" style={card}>
                  <h3 style={secT}>☯ 오행 분석</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {["木","火","土","金","水"].map(el=>{const c=result.counts[el]||0;return(
                      <div key={el} style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{width:60,fontSize:12,color:C.text,fontWeight:900}}>{오행이모지[el]} {오행명[el]}</span>
                        <div style={{flex:1,height:22,background:"#fff",borderRadius:50,overflow:"hidden",border:`2px solid ${C.cardBorder}`}}>
                          <div style={{width:`${(c/4)*100}%`,minWidth:c>0?"15%":"0%",height:"100%",background:오행색[el],borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>{c>0?c:""}</div>
                        </div>
                      </div>
                    );})}
                  </div>
                  {result.missing.length>0&&<p style={{fontSize:12,color:C.pinkDark,marginTop:12,fontWeight:900}}>⚠️ 부족: {result.missing.map(e=>`${오행명[e]}(${e})`).join(", ")}</p>}
                </div>
                <div className="anim anim-d4" style={card}>
                  <h3 style={secT}>⭐ 신살</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{result.신살.map((s,i)=>(<span key={i} style={{padding:"6px 14px",borderRadius:50,fontSize:11,fontWeight:900,background:C.cyan,color:C.text,border:`2px solid ${C.cardBorder}`}}>✦ {s}</span>))}</div>
                </div>
                <div className="anim anim-d5" style={card}>
                  <h3 style={secT}>🐾 타고난 기질</h3>
                  <p style={{fontSize:16,fontWeight:900,color:오행색[result.el],marginBottom:12}}>"{result.fortune.성격.title}"</p>
                  {result.fortune.성격.traits.map((t,i)=><p key={i} style={{fontSize:13,color:C.textMid,lineHeight:1.8,marginBottom:4,fontWeight:700}}>• {t}</p>)}
                </div>
                <div className="anim anim-d6" style={card}>
                  <h3 style={secT}>💊 건강운</h3>
                  <p style={{fontSize:13,color:C.textMid,lineHeight:1.9,fontWeight:700}}>{result.fortune.건강}</p>
                </div>
              </div>
            )}

            {tab==="fortune"&&(
              <div>
                <div className="anim" style={card}>
                  <h3 style={secT}>📖 2026년 토정비결</h3>
                  <div style={{textAlign:"center",marginBottom:14,padding:16,background:C.yellow,borderRadius:12,border:`3px solid ${C.cardBorder}`}}>
                    <div style={{fontSize:18,fontWeight:900,color:C.text,letterSpacing:1,marginBottom:4}}>{result.fortune.총운[0]}</div>
                    <div style={{fontSize:12,color:C.textMid,fontWeight:700}}>{result.fortune.총운[1]}</div>
                  </div>
                  <p style={{fontSize:14,color:C.textMid,lineHeight:2.0,fontWeight:700}}>{result.fortune.총운[2]}</p>
                </div>
              </div>
            )}

            {tab==="monthly"&&(
              <div>
                {result.월운.map((m,i)=>{const f=result.fortune.월별[m.month];return(
                  <div key={m.month} className="anim" style={{...card,animationDelay:`${i*0.04}s`}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                      <div style={{minWidth:46,textAlign:"center",background:C.pink,borderRadius:12,padding:"8px 4px",border:`3px solid ${C.cardBorder}`,color:"#fff"}}>
                        <div style={{fontSize:18,fontWeight:900}}>{m.month}</div>
                        <div style={{fontSize:9,fontWeight:700}}>월</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:15,fontWeight:900,color:오행색[m.오행]}}>{m.간}{m.지}</span>
                          <span style={{fontSize:10,color:C.textLight,fontWeight:700}}>{m.십성}·{m.운성}</span>
                        </div>
                        <div style={{fontSize:12,color:C.text,marginBottom:3,letterSpacing:0.5,fontWeight:900}}>{f.한자}</div>
                        <p style={{fontSize:12,color:C.textMid,lineHeight:1.7,fontWeight:700}}>{f.한글}</p>
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            )}

            {tab==="daewoon"&&(
              <div>
                <div className="anim" style={{...card,background:C.cyan}}>
                  <h3 style={secT}>🐾 {result.breed} 생애 정보</h3>
                  <div style={{display:"flex",gap:8,marginBottom:14}}>
                    {[{l:"평균 수명",v:`${result.평균수명}세`},{l:"체급",v:result.체급},{l:"대운 주기",v:`${result.대운주기}년`}].map(x=>(
                      <div key={x.l} style={{flex:1,padding:"10px 0",borderRadius:12,textAlign:"center",background:"#fff",border:`3px solid ${C.cardBorder}`}}>
                        <div style={{fontSize:10,color:C.textLight,marginBottom:2,fontWeight:700}}>{x.l}</div>
                        <div style={{fontSize:17,fontWeight:900,color:C.text}}>{x.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.text,marginBottom:4,fontWeight:700}}>
                      <span>출생</span><span>현재 {result.currentDogAge}세 (인간 ~{dog2human(result.currentDogAge,result.breed)}세)</span><span>{result.평균수명}세</span>
                    </div>
                    <div style={{height:10,background:"#fff",borderRadius:50,overflow:"hidden",border:`2px solid ${C.cardBorder}`,position:"relative"}}>
                      <div style={{width:`${Math.min(100,(result.currentDogAge/result.평균수명)*100)}%`,height:"100%",borderRadius:50,background:`linear-gradient(90deg,${C.green},${C.yellow},${C.red})`}}/>
                    </div>
                  </div>
                  <p style={{fontSize:11,color:C.text,marginTop:8,fontWeight:700}}>※ 인간 대운 10년 → {result.breed} 대운 <strong>{result.대운주기}년</strong> 주기</p>
                </div>
                <div className="anim anim-d1" style={card}>
                  <h3 style={secT}>🌊 대운 흐름</h3>
                  <div style={{position:"relative"}}>
                    {result.대운.map((d,i)=>{const el=get오행of(d.간);const isCur=result.currentDogAge>=d.age&&result.currentDogAge<d.endAge;const isPast=result.currentDogAge>=d.endAge;return(
                      <div key={i} className="anim" style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,animationDelay:`${i*0.05}s`,opacity:d.pastLifespan?0.3:isPast?0.55:1}}>
                        <div style={{flex:1,padding:"10px 14px",borderRadius:12,background:isCur?C.yellow:"#fff",border:`3px solid ${C.cardBorder}`,boxShadow:isCur?C.shadow:"2px 2px 0 #1a0033"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:18,fontWeight:900,color:오행색[el]}}>{d.간}{d.지}</span>
                            <span style={{fontSize:11,color:C.text,fontWeight:700}}>{d.age}~{d.endAge}세</span>
                          </div>
                          <div style={{fontSize:11,color:C.textMid,fontWeight:700}}>{d.십성}·{d.운성}·{오행명[el]} | {d.시기} | 인간 ~{d.humanAge}세</div>
                          {isCur&&<div style={{marginTop:6,fontSize:11,color:"#fff",padding:"4px 10px",borderRadius:50,background:C.pink,display:"inline-block",fontWeight:900,border:`2px solid ${C.cardBorder}`}}>⭐ 현재 대운</div>}
                        </div>
                      </div>
                    );})}
                  </div>
                </div>
              </div>
            )}

            {tab==="compat"&&(
              <div>
                {!ownerPaid ? (
                  <div>
                    <div className="anim premium-glow" style={{...card,background:C.pink,color:"#fff"}}>
                      <div style={{textAlign:"center",marginBottom:14}}>
                        <div style={{fontSize:46,marginBottom:8}}>💕</div>
                        <h3 style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:6}}>주인+{result.name} 사주 궁합</h3>
                        <p style={{fontSize:13,color:"#fff",lineHeight:1.7,marginBottom:14,fontWeight:700,opacity:0.95}}>
                          반려인과 {result.name}의 사주팔자를 심층 분석<br/>천생연분인지 확인해보세요!
                        </p>
                        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
                          {["일간 오행","음양 조화","지지 합충","오행 보완성","종합 점수","맞춤 조언"].map(f=>(
                            <span key={f} style={{fontSize:11,padding:"5px 12px",borderRadius:50,background:"#fff",color:C.text,fontWeight:900,border:`2px solid ${C.cardBorder}`}}>✓ {f}</span>
                          ))}
                        </div>
                        <div style={{fontSize:24,fontWeight:900,color:C.yellow,marginBottom:4}}>
                          🎁 광고 보고 무료로 보기
                        </div>
                        <p style={{fontSize:11,color:"#fff",fontWeight:700,opacity:0.9}}>광고 시청 후 결과 확인</p>
                      </div>
                    </div>

                    {adStep==="watching" ? (
                      <div className="anim" style={{...card,background:C.text,color:"#fff",textAlign:"center",padding:"32px 18px"}}>
                        <div style={{fontSize:11,color:C.yellow,marginBottom:8,fontWeight:900,letterSpacing:2}}>ADVERTISEMENT</div>
                        <div style={{fontSize:14,color:"#fff",marginBottom:18,fontWeight:700,opacity:0.85}}>광고 시청 중입니다...</div>
                        <AdBanner type="result"/>
                        <div style={{marginTop:18,fontSize:48,fontWeight:900,color:C.yellow,lineHeight:1}}>
                          {adCountdown > 0 ? adCountdown : "🎉"}
                        </div>
                        <div style={{fontSize:12,color:"#fff",marginTop:8,fontWeight:700,opacity:0.7}}>
                          {adCountdown > 0 ? `${adCountdown}초 후 결과 확인 가능` : "결과 준비 완료!"}
                        </div>
                      </div>
                    ) : (
                      <div className="anim" style={{...card,marginTop:12}}>
                        <h4 style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:14}}>반려인 정보 입력</h4>
                        <div style={{marginBottom:14}}>
                          <label style={lbl}>반려인 이름</label>
                          <input type="text" value={ownerName} onChange={e=>setON(e.target.value)} placeholder="이름 입력" style={inp} maxLength={20}/>
                        </div>
                        <div style={{marginBottom:14}}>
                          <label style={lbl}>생년월일</label>
                          <div style={{display:"flex",gap:5}}>
                            <select value={ownerBY} onChange={e=>setOBY(e.target.value)} style={{...inp,flex:1.2}}><option value="">년</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>
                            <select value={ownerBM} onChange={e=>setOBM(e.target.value)} style={{...inp,flex:1}}><option value="">월</option>{months.map(m=><option key={m} value={m}>{m}</option>)}</select>
                            <select value={ownerBD} onChange={e=>setOBD(e.target.value)} style={{...inp,flex:1}}><option value="">일</option>{days.map(d=><option key={d} value={d}>{d}</option>)}</select>
                          </div>
                        </div>
                        <div style={{marginBottom:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <label style={{...lbl,marginBottom:0}}>태어난 시간</label>
                            <button onClick={()=>setOKT(!ownerKT)} style={{background:"none",border:"none",color:C.pinkDark,fontSize:11,cursor:"pointer",fontFamily:FONT,fontWeight:900,textDecoration:"underline"}}>{ownerKT?"몰라요":"알아요"}</button>
                          </div>
                          {ownerKT?(<select value={ownerBH} onChange={e=>setOBH(e.target.value)} style={inp}>{hours.map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}시</option>)}</select>):(<p style={{fontSize:11,color:C.textLight,fontWeight:700}}>※ 午시(정오)로 계산</p>)}
                        </div>

                        <button onClick={handleOwnerAnalysis} disabled={!ownerName||!ownerBY||!ownerBM||!ownerBD} className="pop-btn" style={{
                          width:"100%",padding:"16px",borderRadius:50,fontSize:15,fontWeight:900,fontFamily:FONT,
                          cursor:ownerName&&ownerBY&&ownerBM&&ownerBD?"pointer":"not-allowed",
                          border:`4px solid ${ownerName&&ownerBY&&ownerBM&&ownerBD?C.cardBorder:"#ccc"}`,
                          background:ownerName&&ownerBY&&ownerBM&&ownerBD?C.pink:"#e8e0ed",
                          color:ownerName&&ownerBY&&ownerBM&&ownerBD?"#fff":"#aaa",
                          boxShadow:ownerName&&ownerBY&&ownerBM&&ownerBD?C.shadowLarge:"none",
                        }}>🎁 광고 보고 무료로 확인하기</button>
                        <p style={{textAlign:"center",fontSize:10,color:C.textLight,marginTop:8,fontWeight:700}}>※ 광고 3초 시청 후 즉시 결과 확인</p>
                      </div>
                    )}
                  </div>
                ) : ownerResult && (
                  <div>
                    <div className="anim" style={{...card,textAlign:"center",background:C.yellow}}>
                      <div style={{fontSize:13,color:C.text,marginBottom:8,fontWeight:900}}>{ownerResult.name} ✕ {result.name}</div>
                      <div style={{animation:"scoreCount 0.8s ease-out"}}>
                        <div style={{fontSize:72,fontWeight:900,color:C.text,lineHeight:1}}>{ownerResult.compat.score}</div>
                        <div style={{fontSize:13,color:C.textMid,marginTop:2,fontWeight:700}}>/ 100</div>
                      </div>
                      <div style={{fontSize:22,fontWeight:900,color:ownerResult.compat.gradeColor,margin:"10px 0 6px"}}>{ownerResult.compat.grade}</div>
                      <p style={{fontSize:13,color:C.textMid,lineHeight:1.7,fontWeight:700}}>{ownerResult.compat.gradeDesc}</p>

                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:18,marginTop:18,marginBottom:8}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:32}}>{오행이모지[ownerResult.compat.ownerEl]}</div>
                          <div style={{fontSize:12,color:오행색[ownerResult.compat.ownerEl],fontWeight:900}}>{ownerResult.name}</div>
                          <div style={{fontSize:10,color:C.textMid,fontWeight:700}}>{오행명[ownerResult.compat.ownerEl]}({ownerResult.compat.ownerEl})</div>
                        </div>
                        <div style={{fontSize:28,color:C.pink}}>♥</div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:32}}>{오행이모지[ownerResult.compat.dogEl]}</div>
                          <div style={{fontSize:12,color:오행색[ownerResult.compat.dogEl],fontWeight:900}}>{result.name}</div>
                          <div style={{fontSize:10,color:C.textMid,fontWeight:700}}>{오행명[ownerResult.compat.dogEl]}({ownerResult.compat.dogEl})</div>
                        </div>
                      </div>
                    </div>

                    {ownerResult.compat.details.map((d,i)=>(
                      <div key={i} className="anim" style={{...card,animationDelay:`${(i+1)*0.1}s`}}>
                        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                          <span style={{fontSize:24}}>{d.icon}</span>
                          <div>
                            <div style={{fontSize:14,fontWeight:900,color:C.text,marginBottom:4}}>{d.title}</div>
                            <p style={{fontSize:12,color:C.textMid,lineHeight:1.7,fontWeight:700}}>{d.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="anim anim-d5" style={{...card,background:C.green}}>
                      <h3 style={secT}>💡 궁합 향상 조언</h3>
                      {ownerResult.compat.tips.map((t,i)=><p key={i} style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:6,fontWeight:700}}>• {t}</p>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab==="shop"&&(
              <div>
                <div className="anim" style={{...card,background:C.cyan}}>
                  <h3 style={secT}>{오행이모지[result.el]} {result.name}의 오행 맞춤 추천</h3>
                  <p style={{fontSize:12,color:C.text,fontWeight:700}}>
                    {오행명[result.el]}({result.el}) 기운의 {result.name}에게 꼭 필요한 아이템
                    {result.missing.length>0 && ` · 부족한 ${result.missing.map(e=>오행명[e]).join(",")} 기운 보완`}
                  </p>
                </div>

                {result.coupang.length === 0 && (
                  <div style={{...card,textAlign:"center",padding:24}}>
                    <p style={{fontSize:13,color:C.textMid,fontWeight:700}}>추천 상품 준비 중입니다 🐾</p>
                  </div>
                )}

                {result.coupang.map((item,i)=>(
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="anim pop-btn" style={{...card,animationDelay:`${i*0.06}s`,cursor:"pointer",textDecoration:"none",display:"block"}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      {item.image && (
                        <div style={{flexShrink:0,width:80,height:80,borderRadius:12,overflow:"hidden",border:`3px solid ${C.cardBorder}`,background:"#f5f5f5"}}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        </div>
                      )}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontSize:10,padding:"3px 10px",borderRadius:50,fontWeight:900,background:item.tag.includes("보완")?C.pink:C.yellow,color:item.tag.includes("보완")?"#fff":C.text,border:`2px solid ${C.cardBorder}`}}>{item.tag}</span>
                          {item.isRocket && <span style={{fontSize:9,padding:"3px 8px",borderRadius:50,fontWeight:900,background:C.cyan,color:C.text,border:`2px solid ${C.cardBorder}`}}>🚀 로켓</span>}
                        </div>
                        <div style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:6,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.name}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:15,fontWeight:900,color:C.pinkDark}}>{item.price}</span>
                          <span style={{fontSize:11,color:C.pinkDark,fontWeight:900}}>쿠팡에서 보기 →</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}

                <p style={{fontSize:10,color:C.textLight,textAlign:"center",marginTop:8,lineHeight:1.5,fontWeight:700}}>
                  이 포스팅은 쿠팡 파트너스 활동의 일환으로, 일정액의 수수료를 제공받습니다.
                </p>
              </div>
            )}

            <div className="capture-hide" style={{marginTop:20}}>
              <button onClick={handleDownloadImage} disabled={saving} className="pop-btn" style={{
                width:"100%",padding:"15px",borderRadius:50,fontSize:15,fontWeight:900,
                fontFamily:FONT,cursor:saving?"wait":"pointer",
                background:saving?"#e8e0ed":C.cyan,color:C.text,
                border:`4px solid ${C.cardBorder}`,marginBottom:10,boxShadow:C.shadow,
              }}>{saving?"⏳ 이미지 만드는 중...":"📸 결과 이미지로 저장하기"}</button>

              <button onClick={handleKakaoShare} className="pop-btn" style={{
                width:"100%",padding:"15px",borderRadius:50,fontSize:15,fontWeight:900,
                fontFamily:FONT,cursor:"pointer",
                background:"#fee500",color:"#1a1a1a",
                border:`4px solid ${C.cardBorder}`,marginBottom:10,boxShadow:C.shadow,
              }}>📤 카카오톡으로 공유하기</button>

              {!ownerPaid && tab!=="compat" && (
                <button onClick={goCompat} className="pop-btn premium-glow" style={{
                  width:"100%",padding:"16px",borderRadius:50,fontSize:15,fontWeight:900,
                  fontFamily:FONT,cursor:"pointer",
                  background:C.pink,color:"#fff",
                  border:`4px solid ${C.cardBorder}`,marginBottom:10,boxShadow:C.shadowLarge,
                }}>💕 주인+{result.name} 궁합 보기 · 🎁 무료</button>
              )}

              <button onClick={()=>{navigator.clipboard?.writeText(getShareText());setCopied(true);setTimeout(()=>setCopied(false),2000);}} className="pop-btn" style={{
                width:"100%",padding:"13px",borderRadius:50,fontSize:13,fontWeight:900,
                fontFamily:FONT,cursor:"pointer",
                background:"#fff",color:C.text,
                border:`3px solid ${C.cardBorder}`,marginBottom:10,boxShadow:"3px 3px 0 #1a0033",
              }}>{copied ? "✅ 복사되었습니다!" : "📋 결과 텍스트 복사"}</button>

              <AdBanner type="bottom"/>
            </div>

            {showShare&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSS(false)}>
                <div onClick={e=>e.stopPropagation()} ref={shareRef} style={{background:"#fff",borderRadius:24,padding:24,maxWidth:340,width:"100%",border:`4px solid ${C.cardBorder}`,boxShadow:C.shadowLarge}}>
                  <div style={{background:C.bg,borderRadius:18,padding:20,textAlign:"center",border:`3px solid ${C.cardBorder}`,marginBottom:16}}>
                    <Image src="/logo.png" alt="개팔자" width={80} height={80} style={{borderRadius:12,border:`2px solid ${C.cardBorder}`,marginBottom:8}}/>
                    <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:12,color:C.textMid,marginBottom:12,fontWeight:700}}>{result.breed}</div>
                    <div style={{display:"inline-block",padding:"7px 18px",borderRadius:50,background:오행색[result.el],border:`2px solid ${C.cardBorder}`}}>
                      <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{오행이모지[result.el]} {오행명[result.el]} 기운</span>
                    </div>
                    <p style={{fontSize:13,fontWeight:900,color:C.text,marginTop:12}}>"{result.fortune.성격.title}"</p>
                    <p style={{fontSize:11,color:C.textLight,marginTop:10,fontWeight:700}}>gaepalja-nextjs.vercel.app</p>
                  </div>

                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{navigator.clipboard?.writeText(getShareText());setCopied(true);setTimeout(()=>{setCopied(false);setSS(false);},1500);}} className="pop-btn" style={{flex:1,padding:"13px",borderRadius:50,background:"#fee500",color:"#1a1a1a",border:`3px solid ${C.cardBorder}`,fontSize:13,fontWeight:900,fontFamily:FONT,cursor:"pointer",boxShadow:"3px 3px 0 #1a0033"}}>
                      {copied?"✅ 복사됨!":"📋 텍스트 복사"}
                    </button>
                    <button onClick={()=>setSS(false)} style={{padding:"13px 22px",borderRadius:50,background:"#fff",color:C.text,border:`3px solid ${C.cardBorder}`,fontSize:13,fontWeight:900,fontFamily:FONT,cursor:"pointer"}}>닫기</button>
                  </div>
                </div>
              </div>
            )}

            <div className="capture-hide" style={{textAlign:"center",marginTop:14,paddingBottom:20}}>
              <button onClick={reset} className="pop-btn" style={{background:C.cyan,color:C.text,border:`3px solid ${C.cardBorder}`,borderRadius:50,padding:"13px 36px",fontSize:14,fontWeight:900,fontFamily:FONT,cursor:"pointer",boxShadow:C.shadow}}>🔄 다시 감정하기</button>
              <p style={{fontSize:10,color:C.textLight,marginTop:14,fontWeight:700}}>※ 본 사주풀이는 재미를 위한 것입니다 🐶</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const lbl={display:"block",fontSize:13,fontWeight:900,color:C.text,marginBottom:6};
const inp={width:"100%",padding:"13px 15px",borderRadius:12,border:`3px solid ${C.cardBorder}`,background:"#fff",color:C.text,fontSize:14,outline:"none",fontWeight:700,fontFamily:FONT,boxShadow:"3px 3px 0 #1a0033"};
const card={background:"#fff",border:`3px solid ${C.cardBorder}`,borderRadius:18,padding:18,marginBottom:14,boxShadow:C.shadow};
const secT={fontSize:15,fontWeight:900,color:C.text,marginBottom:14};
