"use client";
import { useState, useEffect, useRef } from "react";
import {
  천간, 지지, 오행명, 오행색, 오행이모지, 견종데이터, 견종목록,
  calcSaju, get오행of, get신살, calc합충, calc대운, calc세운, calc월운,
  dog2human, hexRgb,
} from "../lib/saju";
import { generateFortune, calcOwnerCompat, getCoupangRecs } from "../lib/fortune";
import AdBanner from "./AdBanner";

// ─── UI HELPERS ─────────────────────────────────────────────
function Particles(){
  const s=["☯","✦","🐾","⭐","✧","🌙","卍","☰"];
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    {Array.from({length:16}).map((_,i)=>(<div key={i} style={{position:"absolute",left:`${(i*7.3)%100}%`,top:`${(i*13.7)%100}%`,fontSize:`${10+((i*3)%14)}px`,opacity:0.06+((i%5)*0.02),animation:`fp ${10+(i%8)*2}s ease-in-out infinite`,animationDelay:`${-(i*1.3)}s`}}>{s[i%s.length]}</div>))}
  </div>);
}

function SajuMiniTable({saju,일간,compact}){
  const cols=[{l:"시",d:saju.hour},{l:"일",d:saju.day},{l:"월",d:saju.month},{l:"년",d:saju.year}];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:compact?4:6,textAlign:"center"}}>
      {cols.map(c=><div key={c.l} style={{fontSize:compact?9:10,color:"#7a6e5e",padding:"2px 0"}}>{c.l}</div>)}
      {cols.map((c,i)=>{const el=get오행of(c.d.간);return(
        <div key={`g${i}`} style={{background:`rgba(${hexRgb(오행색[el])},0.1)`,border:`1px solid ${오행색[el]}20`,borderRadius:compact?6:8,padding:compact?"6px 0":"8px 0"}}>
          <div style={{fontSize:compact?18:24,fontWeight:900,color:오행색[el]}}>{c.d.간}</div>
          <div style={{fontSize:compact?18:24,fontWeight:900,color:"#c4b8a4",marginTop:2}}>{c.d.지}</div>
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

  const [showOwnerForm,setSOF] = useState(false);
  const [ownerPaid,setOP] = useState(false);
  const [ownerName,setON] = useState("");
  const [ownerBY,setOBY] = useState("");
  const [ownerBM,setOBM] = useState("");
  const [ownerBD,setOBD] = useState("");
  const [ownerBH,setOBH] = useState("12");
  const [ownerKT,setOKT] = useState(true);
  const [ownerResult,setOR] = useState(null);
  const [payStep,setPS] = useState("none");

  const [showShare,setSS] = useState(false);
  const [copied,setCopied] = useState(false);

  const resultRef = useRef(null);
  const shareRef = useRef(null);

  const loadMsgs = ["🔮 천간지지를 배열하고 있습니다...","☯ 음양오행의 균형을 살피는 중...","📜 십성과 신살을 분석하고 있습니다...","🐾 대운의 흐름을 읽는 중...","⭐ 2026년 토정비결을 작성하고 있습니다..."];

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
            const coupang=getCoupangRecs(el,missing,breed);
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
  const reset=()=>{setStep("intro");setName("");setBreed("");setGender("");setBY("");setBM("");setBD("");setBH("12");setKT(true);setResult(null);setTab("saju");setSOF(false);setOP(false);setOR(null);setPS("none");};

  const handleOwnerAnalysis = () => {
    if(!ownerName||!ownerBY||!ownerBM||!ownerBD) return;
    const hr=ownerKT?parseInt(ownerBH):12;
    const ownerSaju=calcSaju(parseInt(ownerBY),parseInt(ownerBM),parseInt(ownerBD),hr);
    // BUG FIX: dogName 인자 전달
    const compat=calcOwnerCompat(result.saju,ownerSaju,result.name);
    setOR({saju:ownerSaju,compat,name:ownerName});
    setPS("paid");
    setOP(true);
  };

  const years=Array.from({length:100},(_,i)=>2026-i);
  const dogYears=Array.from({length:30},(_,i)=>2026-i);
  const months=Array.from({length:12},(_,i)=>i+1);
  const days=Array.from({length:31},(_,i)=>i+1);
  const hours=Array.from({length:24},(_,i)=>i);
  const 시지명=["子","丑","丑","寅","寅","卯","卯","辰","辰","巳","巳","午","午","未","未","申","申","酉","酉","戌","戌","亥","亥","子"];

  const getShareText = () => {
    if(!result) return "";
    const el=result.el;
    return `🐾 사주개팔자 감정 결과\n\n🐕 ${result.name} (${result.breed})\n${오행이모지[el]} ${오행명[el]}(${el}) 기운의 "${result.fortune.성격.title}"\n\n📜 2026년 총운: ${result.fortune.총운[0]}\n${result.fortune.총운[2].slice(0,60)}...\n\n🔮 나도 우리 강아지 사주 보러가기 👇\n${process.env.NEXT_PUBLIC_SITE_URL || "https://sajugae.app"}`;
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#080810 0%,#10081e 25%,#0c1420 50%,#080810 100%)",color:"#e0d4c0",fontFamily:"'Noto Serif KR','Batang',Georgia,serif",position:"relative"}}>
      <style>{`
        @keyframes fp{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-25px) rotate(3deg)}66%{transform:translateY(-40px) rotate(-2deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(212,180,120,0.3)}50%{box-shadow:0 0 40px rgba(212,180,120,0.6)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes scoreCount{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select{font-family:'Noto Serif KR',serif}
        .anim{animation:fadeIn 0.55s ease-out both}
        .anim-d1{animation-delay:0.08s}.anim-d2{animation-delay:0.16s}.anim-d3{animation-delay:0.24s}
        .anim-d4{animation-delay:0.32s}.anim-d5{animation-delay:0.40s}.anim-d6{animation-delay:0.48s}
        .tab-btn{background:none;border:none;padding:10px 12px;font-size:12px;font-family:'Noto Serif KR',serif;cursor:pointer;border-radius:8px 8px 0 0;transition:all 0.2s;color:#7a6e5e;white-space:nowrap}
        .tab-btn.active{background:rgba(212,180,120,0.1);color:#d4b478;border-bottom:2px solid #d4b478}
        .premium-glow{animation:pulse 2s ease-in-out infinite}
      `}</style>

      <Particles/>

      <div style={{position:"relative",zIndex:1,maxWidth:540,margin:"0 auto",padding:"20px 16px 60px"}}>

        {step==="intro"&&(
          <div style={{textAlign:"center",animation:"fadeIn 0.7s ease-out"}}>
            <div style={{width:80,height:80,margin:"0 auto 16px",borderRadius:"50%",background:"radial-gradient(circle at 30% 30%,#2a1a0a,#0a0808)",border:"2px solid #d4b47833",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 0 30px rgba(212,180,120,0.2)"}}>🐕</div>
            <div style={{fontSize:12,letterSpacing:8,color:"#d4b478",marginBottom:8}}>四 柱 犬 八 字</div>
            <h1 style={{fontSize:38,fontWeight:900,lineHeight:1.3,marginBottom:16,background:"linear-gradient(135deg,#d4b478,#e8c88a,#c49a5c,#d4b478)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite"}}>사주개팔자</h1>
            <p style={{fontSize:14,lineHeight:1.9,color:"#a0937f",marginBottom:8}}>천간지지 · 음양오행 · 십성 · 신살</p>
            <p style={{fontSize:12,color:"#6a5f53",marginBottom:32,lineHeight:1.7}}>반려견의 타고난 기질과 운명을 풀어드립니다</p>

            <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:40}}>
              {["木","火","土","金","水"].map((el,i)=>(
                <div key={el} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:`fadeIn 0.5s ease-out ${0.4+i*0.1}s both`}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:`radial-gradient(circle,${오행색[el]}22,transparent)`,border:`1px solid ${오행색[el]}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{오행이모지[el]}</div>
                  <span style={{fontSize:9,color:오행색[el]}}>{오행명[el]}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>setStep("form")} style={{background:"linear-gradient(135deg,#d4b478,#c49a5c)",color:"#1a0a08",border:"none",borderRadius:50,padding:"16px 52px",fontSize:16,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:"pointer",animation:"glow 2.5s ease-in-out infinite",transition:"transform 0.2s"}}
              onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
              onMouseLeave={e=>e.target.style.transform="scale(1)"}
            >🔮 무료 사주 감정</button>

            <div style={{marginTop:24,padding:"12px 18px",borderRadius:12,background:"linear-gradient(135deg,rgba(239,68,68,0.06),rgba(212,180,120,0.06))",border:"1px solid rgba(239,68,68,0.15)"}}>
              <div style={{fontSize:12,color:"#ef4444",fontWeight:700,marginBottom:4}}>💕 PREMIUM — 주인+강아지 궁합 분석</div>
              <div style={{fontSize:11,color:"#8a7e6e"}}>사주팔자로 보는 반려인과 반려견의 궁합 · <span style={{color:"#d4b478",fontWeight:700}}>990원</span></div>
            </div>

            <div style={{marginTop:28,padding:"14px 18px",borderRadius:12,background:"rgba(212,180,120,0.03)",border:"1px solid rgba(212,180,120,0.06)",fontSize:11,color:"#5a5549",lineHeight:1.7,textAlign:"left"}}>
              ✦ 사주 원국 · 오행 · 십성 · 신살 · 합충<br/>
              ✦ 견종별 수명 반영 대운 · 월운<br/>
              ✦ 2026년 토정비결 운세<br/>
              ✦ 성격 · 건강 · 반려인 궁합<br/>
              ✦ 오행 맞춤 펫용품 추천
            </div>
          </div>
        )}

        {step==="form"&&(
          <div style={{animation:"fadeIn 0.5s ease-out"}}>
            <button onClick={()=>setStep("intro")} style={{background:"none",border:"none",color:"#d4b478",fontSize:13,cursor:"pointer",fontFamily:"'Noto Serif KR',serif",marginBottom:20,padding:0}}>← 뒤로</button>
            <h2 style={{fontSize:22,fontWeight:700,color:"#d4b478",textAlign:"center",marginBottom:6}}>🐾 반려견 정보</h2>
            <p style={{fontSize:12,color:"#7a6e5e",textAlign:"center",marginBottom:28}}>정확한 사주를 위해 생년월일을 입력해주세요</p>

            <div style={{marginBottom:20}}>
              <label style={lbl}>이름</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="강아지 이름" style={inp} maxLength={20}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={lbl}>견종</label>
              <select value={breed} onChange={e=>setBreed(e.target.value)} style={inp}>
                <option value="">견종 선택</option>
                {견종목록.map(b=><option key={b} value={b}>{b} (평균 {견종데이터[b].수명}세)</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={lbl}>성별</label>
              <div style={{display:"flex",gap:10}}>
                {["수컷 ♂","암컷 ♀"].map(g=>(
                  <button key={g} onClick={()=>setGender(g)} style={{flex:1,padding:"12px 0",borderRadius:10,fontSize:14,fontFamily:"'Noto Serif KR',serif",fontWeight:gender===g?700:400,cursor:"pointer",border:gender===g?"2px solid #d4b478":"1px solid rgba(212,180,120,0.15)",background:gender===g?"rgba(212,180,120,0.1)":"rgba(255,255,255,0.02)",color:gender===g?"#d4b478":"#7a6e5e",transition:"all 0.2s"}}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={lbl}>생년월일</label>
              <div style={{display:"flex",gap:6}}>
                <select value={birthYear} onChange={e=>setBY(e.target.value)} style={{...inp,flex:1.2}}><option value="">년</option>{dogYears.map(y=><option key={y} value={y}>{y}년</option>)}</select>
                <select value={birthMonth} onChange={e=>setBM(e.target.value)} style={{...inp,flex:1}}><option value="">월</option>{months.map(m=><option key={m} value={m}>{m}월</option>)}</select>
                <select value={birthDay} onChange={e=>setBD(e.target.value)} style={{...inp,flex:1}}><option value="">일</option>{days.map(d=><option key={d} value={d}>{d}일</option>)}</select>
              </div>
            </div>
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <label style={{...lbl,marginBottom:0}}>태어난 시간</label>
                <button onClick={()=>setKT(!knowTime)} style={{background:"none",border:"none",color:"#7a6e5e",fontSize:11,cursor:"pointer",fontFamily:"'Noto Serif KR',serif",textDecoration:"underline"}}>{knowTime?"모르겠어요":"알아요"}</button>
              </div>
              {knowTime?(<select value={birthHour} onChange={e=>setBH(e.target.value)} style={inp}>{hours.map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}시 ({시지명[h]}시)</option>)}</select>):(<p style={{fontSize:11,color:"#5a5549",padding:"6px 0"}}>※ 시간 미상 시 午시(정오)로 계산</p>)}
            </div>
            <button onClick={handleSubmit} disabled={!canSubmit} style={{width:"100%",background:canSubmit?"linear-gradient(135deg,#d4b478,#c49a5c)":"rgba(255,255,255,0.06)",color:canSubmit?"#1a0a08":"#444",border:"none",borderRadius:50,padding:"15px",fontSize:16,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:canSubmit?"pointer":"not-allowed",transition:"all 0.3s"}}>🔮 사주개팔자 감정하기</button>
          </div>
        )}

        {step==="loading"&&(
          <div style={{textAlign:"center",paddingTop:40,animation:"fadeIn 0.4s ease-out"}}>
            <div style={{fontSize:56,animation:"spin 4s linear infinite",marginBottom:28}}>☯</div>
            <p style={{fontSize:15,color:"#d4b478",marginBottom:16,minHeight:48}}>{loadMsgs[loadIdx]}</p>
            <div style={{width:220,height:3,background:"rgba(212,180,120,0.15)",borderRadius:2,margin:"0 auto",overflow:"hidden"}}>
              <div style={{width:`${((loadIdx+1)/loadMsgs.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#d4b478,#c49a5c)",borderRadius:2,transition:"width 0.7s ease"}}/>
            </div>
            <AdBanner type="loading"/>
            <p style={{fontSize:10,color:"#4a453f",marginTop:8}}>사주 감정 중 잠시만 기다려주세요...</p>
          </div>
        )}

        {step==="result"&&result&&(
          <div ref={resultRef} style={{animation:"fadeIn 0.5s ease-out"}}>
            <div className="anim" style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:11,letterSpacing:6,color:"#7a6e5e",marginBottom:8}}>四 柱 犬 八 字 鑑 定</div>
              <h2 style={{fontSize:24,fontWeight:900,color:"#d4b478",marginBottom:4}}>{result.name}</h2>
              <p style={{fontSize:12,color:"#7a6e5e"}}>{result.breed} · {result.gender} · {birthYear}년 {birthMonth}월 {birthDay}일생</p>
              <div style={{width:48,height:2,background:"linear-gradient(90deg,transparent,#d4b478,transparent)",margin:"12px auto 0"}}/>
            </div>

            <AdBanner type="result"/>

            <div className="anim anim-d1" style={{display:"flex",borderBottom:"1px solid rgba(212,180,120,0.1)",marginBottom:16,overflowX:"auto",whiteSpace:"nowrap"}}>
              {[
                {id:"saju",label:"사주원국"},
                {id:"fortune",label:"토정비결"},
                {id:"monthly",label:"월운"},
                {id:"daewoon",label:"대운"},
                {id:"compat",label:"💕궁합",premium:true},
                {id:"shop",label:"🛒추천"},
              ].map(t=>(
                <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)} style={t.premium&&!ownerPaid?{color:"#ef4444"}:{}}>
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
                      {result.합충.map((r,i)=>(<span key={i} style={{padding:"5px 10px",borderRadius:8,fontSize:11,background:r.type==="합"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${r.type==="합"?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,color:r.type==="합"?"#22c55e":"#ef4444"}}>{r.detail}</span>))}
                    </div>
                  </div>
                )}
                <div className="anim anim-d3" style={card}>
                  <h3 style={secT}>☯ 오행 분석</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {["木","火","土","金","水"].map(el=>{const c=result.counts[el]||0;return(
                      <div key={el} style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:56,fontSize:11,color:오행색[el]}}>{오행이모지[el]} {오행명[el]}</span>
                        <div style={{flex:1,height:18,background:"rgba(255,255,255,0.04)",borderRadius:9,overflow:"hidden"}}>
                          <div style={{width:`${(c/4)*100}%`,minWidth:c>0?"12%":"0%",height:"100%",background:`linear-gradient(90deg,${오행색[el]}66,${오행색[el]})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{c>0?c:""}</div>
                        </div>
                      </div>
                    );})}
                  </div>
                  {result.missing.length>0&&<p style={{fontSize:11,color:"#ff8a65",marginTop:10}}>⚠️ 부족: {result.missing.map(e=>`${오행명[e]}(${e})`).join(", ")}</p>}
                </div>
                <div className="anim anim-d4" style={card}>
                  <h3 style={secT}>⭐ 신살</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{result.신살.map((s,i)=>(<span key={i} style={{padding:"5px 12px",borderRadius:20,fontSize:11,background:"rgba(212,180,120,0.06)",border:"1px solid rgba(212,180,120,0.12)",color:"#d4b478"}}>✦ {s}</span>))}</div>
                </div>
                <div className="anim anim-d5" style={card}>
                  <h3 style={secT}>🐾 타고난 기질</h3>
                  <p style={{fontSize:15,fontWeight:700,color:오행색[result.el],marginBottom:10}}>"{result.fortune.성격.title}"</p>
                  {result.fortune.성격.traits.map((t,i)=><p key={i} style={{fontSize:12,color:"#b0a490",lineHeight:1.8,marginBottom:2}}>• {t}</p>)}
                </div>
                <div className="anim anim-d6" style={card}>
                  <h3 style={secT}>💊 건강운</h3>
                  <p style={{fontSize:12,color:"#b0a490",lineHeight:1.9}}>{result.fortune.건강}</p>
                </div>
              </div>
            )}

            {tab==="fortune"&&(
              <div>
                <div className="anim" style={card}>
                  <h3 style={secT}>📖 2026년 토정비결</h3>
                  <div style={{textAlign:"center",marginBottom:16}}>
                    <div style={{fontSize:18,fontWeight:700,color:"#d4b478",letterSpacing:2,marginBottom:4}}>{result.fortune.총운[0]}</div>
                    <div style={{fontSize:12,color:"#8a7e6e",marginBottom:12}}>{result.fortune.총운[1]}</div>
                    <div style={{width:50,height:1,background:"linear-gradient(90deg,transparent,#d4b47855,transparent)",margin:"0 auto"}}/>
                  </div>
                  <p style={{fontSize:13,color:"#c0b4a0",lineHeight:2.0,textAlign:"justify"}}>{result.fortune.총운[2]}</p>
                </div>
              </div>
            )}

            {tab==="monthly"&&(
              <div>
                {result.월운.map((m,i)=>{const f=result.fortune.월별[m.month];return(
                  <div key={m.month} className="anim" style={{...card,animationDelay:`${i*0.04}s`}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <div style={{minWidth:40,textAlign:"center",background:"rgba(212,180,120,0.06)",borderRadius:8,padding:"6px 4px"}}>
                        <div style={{fontSize:16,fontWeight:900,color:"#d4b478"}}>{m.month}</div>
                        <div style={{fontSize:8,color:"#7a6e5e"}}>월</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                          <span style={{fontSize:14,fontWeight:700,color:오행색[m.오행]}}>{m.간}{m.지}</span>
                          <span style={{fontSize:10,color:"#8a7e6e"}}>{m.십성}·{m.운성}</span>
                        </div>
                        <div style={{fontSize:11,color:"#d4b478",marginBottom:2,letterSpacing:1}}>{f.한자}</div>
                        <p style={{fontSize:11,color:"#a09484",lineHeight:1.7}}>{f.한글}</p>
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            )}

            {tab==="daewoon"&&(
              <div>
                <div className="anim" style={{...card,background:"rgba(212,180,120,0.03)"}}>
                  <h3 style={secT}>🐾 {result.breed} 생애 정보</h3>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {[{l:"평균 수명",v:`${result.평균수명}세`},{l:"체급",v:result.체급},{l:"대운 주기",v:`${result.대운주기}년`}].map(x=>(
                      <div key={x.l} style={{flex:1,padding:"8px 0",borderRadius:8,textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(212,180,120,0.08)"}}>
                        <div style={{fontSize:9,color:"#7a6e5e",marginBottom:2}}>{x.l}</div>
                        <div style={{fontSize:16,fontWeight:700,color:"#d4b478"}}>{x.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#7a6e5e",marginBottom:3}}>
                      <span>출생</span><span>현재 {result.currentDogAge}세 (인간 약 {dog2human(result.currentDogAge,result.breed)}세)</span><span>{result.평균수명}세</span>
                    </div>
                    <div style={{height:6,background:"rgba(255,255,255,0.04)",borderRadius:3,overflow:"hidden",position:"relative"}}>
                      <div style={{width:`${Math.min(100,(result.currentDogAge/result.평균수명)*100)}%`,height:"100%",borderRadius:3,background:"linear-gradient(90deg,#22c55e,#eab308,#ef4444)"}}/>
                    </div>
                  </div>
                  <p style={{fontSize:10,color:"#5a5549"}}>※ 인간 대운 10년 주기 → {result.breed} 대운 <strong style={{color:"#d4b478"}}>{result.대운주기}년</strong> 주기</p>
                </div>
                <div className="anim anim-d1" style={card}>
                  <h3 style={secT}>🌊 대운 흐름</h3>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:18,top:0,bottom:0,width:2,background:"linear-gradient(to bottom,#d4b47844,#d4b47811)"}}/>
                    {result.대운.map((d,i)=>{const el=get오행of(d.간);const isCur=result.currentDogAge>=d.age&&result.currentDogAge<d.endAge;const isPast=result.currentDogAge>=d.endAge;return(
                      <div key={i} className="anim" style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12,animationDelay:`${i*0.05}s`,opacity:d.pastLifespan?0.3:isPast?0.55:1}}>
                        <div style={{minWidth:38,display:"flex",justifyContent:"center"}}>
                          <div style={{width:isCur?12:8,height:isCur?12:8,borderRadius:"50%",background:isCur?오행색[el]:"rgba(212,180,120,0.2)",border:isCur?`2px solid ${오행색[el]}`:"none",boxShadow:isCur?`0 0 8px ${오행색[el]}44`:"none",zIndex:1}}/>
                        </div>
                        <div style={{flex:1,padding:"8px 12px",borderRadius:8,background:isCur?"rgba(212,180,120,0.08)":"rgba(255,255,255,0.015)",border:isCur?"1px solid rgba(212,180,120,0.2)":"1px solid rgba(255,255,255,0.03)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                            <span style={{fontSize:16,fontWeight:900,color:오행색[el]}}>{d.간}{d.지}</span>
                            <span style={{fontSize:10,color:"#7a6e5e"}}>{d.age}~{d.endAge}세</span>
                          </div>
                          <div style={{fontSize:10,color:"#9a8e7e"}}>{d.십성}·{d.운성}·{오행명[el]} | {d.시기} | 인간 ~{d.humanAge}세</div>
                          {isCur&&<div style={{marginTop:5,fontSize:10,color:"#d4b478",padding:"3px 8px",borderRadius:4,background:"rgba(212,180,120,0.08)",display:"inline-block"}}>⭐ 현재 대운</div>}
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
                    <div className="anim premium-glow" style={{...card,background:"linear-gradient(135deg,rgba(239,68,68,0.04),rgba(212,180,120,0.06))",border:"1px solid rgba(239,68,68,0.15)"}}>
                      <div style={{textAlign:"center",marginBottom:16}}>
                        <div style={{fontSize:40,marginBottom:8}}>💕</div>
                        <h3 style={{fontSize:18,fontWeight:900,color:"#ef4444",marginBottom:4}}>주인+강아지 사주 궁합</h3>
                        <p style={{fontSize:12,color:"#b0a490",lineHeight:1.7,marginBottom:12}}>
                          반려인과 {result.name}의 사주팔자를 심층 분석하여<br/>
                          천생연분인지 확인해보세요!
                        </p>
                        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
                          {["일간 오행 상생상극","음양 조화 분석","지지 합충 관계","오행 보완성 분석","종합 궁합 점수","맞춤 조언"].map(f=>(
                            <span key={f} style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.1)",color:"#c0937f"}}>✓ {f}</span>
                          ))}
                        </div>
                        <div style={{fontSize:28,fontWeight:900,color:"#d4b478",marginBottom:4}}>
                          990<span style={{fontSize:14,fontWeight:400}}>원</span>
                        </div>
                        <p style={{fontSize:10,color:"#6a5f53"}}>일회성 결제 · 무제한 재확인</p>
                      </div>
                    </div>

                    {payStep==="none"&&(
                      <button onClick={()=>setPS("confirm")} style={{width:"100%",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",border:"none",borderRadius:50,padding:"15px",fontSize:16,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:"pointer",marginTop:8,transition:"transform 0.2s"}}
                        onMouseEnter={e=>e.target.style.transform="scale(1.02)"}
                        onMouseLeave={e=>e.target.style.transform="scale(1)"}
                      >💕 990원 결제하고 궁합 보기</button>
                    )}

                    {payStep==="confirm"&&(
                      <div className="anim" style={{...card,marginTop:12,border:"1px solid rgba(239,68,68,0.2)"}}>
                        <h4 style={{fontSize:14,fontWeight:700,color:"#d4b478",marginBottom:12}}>반려인 정보 입력</h4>
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
                            <button onClick={()=>setOKT(!ownerKT)} style={{background:"none",border:"none",color:"#7a6e5e",fontSize:10,cursor:"pointer",fontFamily:"'Noto Serif KR',serif",textDecoration:"underline"}}>{ownerKT?"몰라요":"알아요"}</button>
                          </div>
                          {ownerKT?(<select value={ownerBH} onChange={e=>setOBH(e.target.value)} style={inp}>{hours.map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}시</option>)}</select>):(<p style={{fontSize:10,color:"#5a5549"}}>※ 午시(정오)로 계산</p>)}
                        </div>

                        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"12px 14px",marginBottom:14,border:"1px solid rgba(255,255,255,0.06)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#e0d4c0",marginBottom:8}}>
                            <span>주인+강아지 궁합 분석</span><span style={{fontWeight:700}}>990원</span>
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            {["카카오페이","네이버페이","카드결제"].map(m=>(
                              <div key={m} style={{flex:1,padding:"8px 0",borderRadius:6,textAlign:"center",fontSize:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#b0a490",cursor:"pointer"}}>{m}</div>
                            ))}
                          </div>
                        </div>

                        <button onClick={handleOwnerAnalysis} disabled={!ownerName||!ownerBY||!ownerBM||!ownerBD} style={{
                          width:"100%",padding:"14px",borderRadius:50,fontSize:15,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:ownerName&&ownerBY&&ownerBM&&ownerBD?"pointer":"not-allowed",border:"none",
                          background:ownerName&&ownerBY&&ownerBM&&ownerBD?"linear-gradient(135deg,#ef4444,#dc2626)":"rgba(255,255,255,0.06)",
                          color:ownerName&&ownerBY&&ownerBM&&ownerBD?"#fff":"#555",
                        }}>💕 결제 및 궁합 감정하기</button>
                        <p style={{textAlign:"center",fontSize:9,color:"#4a453f",marginTop:8}}>※ 데모 버전으로 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    )}
                  </div>
                ) : ownerResult && (
                  <div>
                    <div className="anim" style={{...card,textAlign:"center",background:"linear-gradient(135deg,rgba(239,68,68,0.04),rgba(212,180,120,0.04))",border:"1px solid rgba(239,68,68,0.12)"}}>
                      <div style={{fontSize:13,color:"#8a7e6e",marginBottom:8}}>{ownerResult.name} ✕ {result.name}</div>
                      <div style={{animation:"scoreCount 0.8s ease-out"}}>
                        <div style={{fontSize:64,fontWeight:900,color:ownerResult.compat.gradeColor,lineHeight:1}}>{ownerResult.compat.score}</div>
                        <div style={{fontSize:12,color:"#7a6e5e",marginTop:2}}>/ 100</div>
                      </div>
                      <div style={{fontSize:20,fontWeight:900,color:ownerResult.compat.gradeColor,margin:"8px 0 4px"}}>{ownerResult.compat.grade}</div>
                      <p style={{fontSize:12,color:"#b0a490",lineHeight:1.7}}>{ownerResult.compat.gradeDesc}</p>

                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginTop:16,marginBottom:8}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:28}}>{오행이모지[ownerResult.compat.ownerEl]}</div>
                          <div style={{fontSize:11,color:오행색[ownerResult.compat.ownerEl],fontWeight:700}}>{ownerResult.name}</div>
                          <div style={{fontSize:10,color:"#7a6e5e"}}>{오행명[ownerResult.compat.ownerEl]}({ownerResult.compat.ownerEl})</div>
                        </div>
                        <div style={{fontSize:24,color:"#d4b478"}}>♥</div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:28}}>{오행이모지[ownerResult.compat.dogEl]}</div>
                          <div style={{fontSize:11,color:오행색[ownerResult.compat.dogEl],fontWeight:700}}>{result.name}</div>
                          <div style={{fontSize:10,color:"#7a6e5e"}}>{오행명[ownerResult.compat.dogEl]}({ownerResult.compat.dogEl})</div>
                        </div>
                      </div>
                    </div>

                    {ownerResult.compat.details.map((d,i)=>(
                      <div key={i} className="anim" style={{...card,animationDelay:`${(i+1)*0.1}s`,borderLeft:`3px solid ${d.type==="great"?"#22c55e":d.type==="good"?"#3b82f6":d.type==="caution"?"#eab308":"#94a3b8"}`}}>
                        <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                          <span style={{fontSize:20}}>{d.icon}</span>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,color:"#d4b478",marginBottom:4}}>{d.title}</div>
                            <p style={{fontSize:12,color:"#a09484",lineHeight:1.7}}>{d.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="anim anim-d5" style={{...card,background:"rgba(212,180,120,0.03)"}}>
                      <h3 style={secT}>💡 궁합 향상 조언</h3>
                      {ownerResult.compat.tips.map((t,i)=><p key={i} style={{fontSize:12,color:"#b0a490",lineHeight:1.8,marginBottom:6}}>• {t}</p>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab==="shop"&&(
              <div>
                <div className="anim" style={{...card,background:"rgba(212,180,120,0.03)"}}>
                  <h3 style={secT}>{오행이모지[result.el]} {result.name}의 오행 맞춤 추천</h3>
                  <p style={{fontSize:11,color:"#7a6e5e",marginBottom:4}}>
                    {오행명[result.el]}({result.el}) 기운의 {result.name}에게 꼭 필요한 아이템
                    {result.missing.length>0 && ` · 부족한 ${result.missing.map(e=>오행명[e]).join(",")} 기운 보완`}
                  </p>
                </div>

                {result.coupang.map((item,i)=>(
                  <div key={i} className="anim" style={{...card,animationDelay:`${i*0.06}s`,cursor:"pointer",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,180,120,0.06)";e.currentTarget.style.borderColor="rgba(212,180,120,0.2)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(212,180,120,0.08)";}}
                  >
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:item.tag.includes("보완")?"rgba(239,68,68,0.1)":"rgba(212,180,120,0.08)",color:item.tag.includes("보완")?"#ef4444":"#d4b478",border:`1px solid ${item.tag.includes("보완")?"rgba(239,68,68,0.15)":"rgba(212,180,120,0.12)"}`}}>{item.tag}</span>
                        </div>
                        <div style={{fontSize:14,fontWeight:700,color:"#e0d4c0",marginBottom:3}}>{item.name}</div>
                        <p style={{fontSize:11,color:"#8a7e6e"}}>{item.desc}</p>
                      </div>
                      <div style={{textAlign:"right",minWidth:70}}>
                        <div style={{fontSize:15,fontWeight:900,color:"#d4b478"}}>{item.price}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4}}>
                      <span style={{fontSize:10,color:"#c49a5c"}}>쿠팡에서 보기 →</span>
                      <span style={{fontSize:8,padding:"1px 4px",borderRadius:2,background:"rgba(255,255,255,0.06)",color:"#6a5f53"}}>쿠팡파트너스</span>
                    </div>
                  </div>
                ))}

                <p style={{fontSize:9,color:"#3a3530",textAlign:"center",marginTop:8,lineHeight:1.5}}>
                  이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </p>
              </div>
            )}

            <div style={{marginTop:20}}>
              <button onClick={()=>setSS(true)} style={{
                width:"100%",padding:"14px",borderRadius:12,fontSize:14,fontWeight:700,
                fontFamily:"'Noto Serif KR',serif",cursor:"pointer",
                background:"linear-gradient(135deg,#fee500,#f0d800)",color:"#1a1a1a",
                border:"none",marginBottom:10,transition:"transform 0.2s",
              }}
                onMouseEnter={e=>e.target.style.transform="scale(1.02)"}
                onMouseLeave={e=>e.target.style.transform="scale(1)"}
              >📤 카카오톡으로 공유하기</button>

              <button onClick={()=>{navigator.clipboard?.writeText(getShareText());setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{
                width:"100%",padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,
                fontFamily:"'Noto Serif KR',serif",cursor:"pointer",
                background:"rgba(255,255,255,0.04)",color:"#b0a490",
                border:"1px solid rgba(212,180,120,0.1)",marginBottom:10,
              }}>{copied ? "✅ 복사되었습니다!" : "📋 결과 텍스트 복사"}</button>

              <AdBanner type="bottom"/>
            </div>

            {showShare&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSS(false)}>
                <div onClick={e=>e.stopPropagation()} ref={shareRef} style={{background:"linear-gradient(170deg,#1a1028,#0c1420)",borderRadius:20,padding:24,maxWidth:340,width:"100%",border:"1px solid rgba(212,180,120,0.15)"}}>
                  <div style={{background:"linear-gradient(135deg,#1a0a2e,#0d1b2a)",borderRadius:16,padding:20,textAlign:"center",border:"1px solid rgba(212,180,120,0.1)",marginBottom:16}}>
                    <div style={{fontSize:10,letterSpacing:4,color:"#7a6e5e",marginBottom:8}}>사주개팔자</div>
                    <div style={{fontSize:32,marginBottom:4}}>🐕</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#d4b478",marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:12,color:"#7a6e5e",marginBottom:12}}>{result.breed}</div>
                    <div style={{display:"inline-block",padding:"6px 16px",borderRadius:20,background:`rgba(${hexRgb(오행색[result.el])},0.15)`,border:`1px solid ${오행색[result.el]}33`}}>
                      <span style={{fontSize:14,fontWeight:700,color:오행색[result.el]}}>{오행이모지[result.el]} {오행명[result.el]} 기운</span>
                    </div>
                    <p style={{fontSize:13,fontWeight:700,color:"#c0b4a0",marginTop:10}}>"{result.fortune.성격.title}"</p>
                    <p style={{fontSize:10,color:"#6a5f53",marginTop:10}}>sajugae.app</p>
                  </div>

                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{navigator.clipboard?.writeText(getShareText());setCopied(true);setTimeout(()=>{setCopied(false);setSS(false);},1500);}} style={{flex:1,padding:"12px",borderRadius:10,background:"linear-gradient(135deg,#fee500,#f0d800)",color:"#1a1a1a",border:"none",fontSize:13,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:"pointer"}}>
                      {copied?"✅ 복사됨!":"📋 텍스트 복사"}
                    </button>
                    <button onClick={()=>setSS(false)} style={{padding:"12px 20px",borderRadius:10,background:"rgba(255,255,255,0.06)",color:"#8a7e6e",border:"1px solid rgba(255,255,255,0.08)",fontSize:13,fontFamily:"'Noto Serif KR',serif",cursor:"pointer"}}>닫기</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{textAlign:"center",marginTop:12,paddingBottom:20}}>
              <button onClick={reset} style={{background:"rgba(212,180,120,0.06)",color:"#d4b478",border:"1px solid rgba(212,180,120,0.15)",borderRadius:50,padding:"12px 32px",fontSize:13,fontWeight:700,fontFamily:"'Noto Serif KR',serif",cursor:"pointer"}}>🔄 다시 감정하기</button>
              <p style={{fontSize:9,color:"#3a3530",marginTop:12}}>※ 본 사주풀이는 재미를 위한 것으로, 실제 역학 감정과는 차이가 있습니다 🐶</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const lbl={display:"block",fontSize:12,fontWeight:700,color:"#b0a490",marginBottom:6};
const inp={width:"100%",padding:"11px 13px",borderRadius:10,border:"1px solid rgba(212,180,120,0.15)",background:"rgba(255,255,255,0.03)",color:"#e0d4c0",fontSize:14,outline:"none",appearance:"none",WebkitAppearance:"none"};
const card={background:"rgba(255,255,255,0.02)",border:"1px solid rgba(212,180,120,0.08)",borderRadius:14,padding:16,marginBottom:10};
const secT={fontSize:14,fontWeight:700,color:"#d4b478",marginBottom:12};
