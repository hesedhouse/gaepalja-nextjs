// ─── DATA ───────────────────────────────────────────────────
export const 천간 = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
export const 지지 = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
export const 오행 = ["木","木","火","火","土","土","金","金","水","水"];
export const 오행명 = {木:"나무",火:"불",土:"흙",金:"쇠",水:"물"};
export const 오행색 = {木:"#22c55e",火:"#ef4444",土:"#eab308",金:"#94a3b8",水:"#3b82f6"};
export const 오행이모지 = {木:"🌳",火:"🔥",土:"🏔️",金:"⚔️",水:"🌊"};
export const 음양 = ["양","음","양","음","양","음","양","음","양","음"];
export const 십성명 = ["비견","겁재","식신","상관","편재","정재","편관","정관","편인","정인"];
export const 운성12 = ["절","태","양","장생","목욕","관대","건록","제왕","쇠","병","사","묘"];
export const 신살목록 = ["천을귀인","천덕귀인","월덕귀인","문창귀인","학당귀인","역마살","도화살","화개살","복성귀인","천복귀인","괴강살","망신살","지살","겁살","백호살","반안살","현침살","천의성","장성살"];

export const 견종데이터 = {
  "골든 리트리버":{수명:11,체급:"대형"},"래브라도 리트리버":{수명:12,체급:"대형"},
  "시바견":{수명:14,체급:"중형"},"푸들":{수명:14,체급:"중형"},
  "비숑 프리제":{수명:15,체급:"소형"},"포메라니안":{수명:15,체급:"소형"},
  "말티즈":{수명:14,체급:"소형"},"치와와":{수명:17,체급:"초소형"},
  "시츄":{수명:14,체급:"소형"},"요크셔테리어":{수명:15,체급:"소형"},
  "진돗개":{수명:13,체급:"중형"},"웰시코기":{수명:13,체급:"중형"},
  "불독":{수명:9,체급:"중형"},"비글":{수명:13,체급:"중형"},
  "사모예드":{수명:13,체급:"대형"},"허스키":{수명:13,체급:"대형"},
  "보더콜리":{수명:13,체급:"중형"},"닥스훈트":{수명:14,체급:"소형"},
  "도베르만":{수명:11,체급:"대형"},"기타":{수명:13,체급:"중형"},
};
export const 견종목록 = Object.keys(견종데이터);

// ─── SAJU ENGINE ─────────────────────────────────────────────
export function calcSaju(year, month, day, hour) {
  const ys=천간[(year-4)%10], yb=지지[(year-4)%12];
  const mIdx=((year%5)*2+month+1)%10, ms=천간[mIdx], mb=지지[(month+1)%12];
  const base=Math.floor((year-1900)*365.2422+(month-1)*30.4375+day-0.5);
  const ds=천간[((base%10)+10)%10], db=지지[((base%12)+12)%12];
  const hIdx=Math.floor(((hour+1)%24)/2);
  const hs=천간[(천간.indexOf(ds)*2+hIdx)%10], hb=지지[hIdx];
  return { year:{간:ys,지:yb}, month:{간:ms,지:mb}, day:{간:ds,지:db}, hour:{간:hs,지:hb} };
}
export function get오행of(간){return 오행[천간.indexOf(간)];}
export function get음양of(간){return 음양[천간.indexOf(간)];}
export function get십성(일간,t){const a=천간.indexOf(일간),b=천간.indexOf(t);return 십성명[((b-a)%10+10)%10];}
export function get운성(일간,지){const i=천간.indexOf(일간),j=지지.indexOf(지);const s=[1,6,10,9,10,9,7,0,4,3];return 운성12[(j-s[i]+12)%12];}
export function get신살(saju){
  const seed=(천간.indexOf(saju.day.간)*7+지지.indexOf(saju.year.지)*3+지지.indexOf(saju.month.지)*5+지지.indexOf(saju.day.지)*2);
  const r=[];for(let i=0;i<3+(seed%4)&&i<신살목록.length;i++)r.push(신살목록[(seed+i*3)%신살목록.length]);
  return[...new Set(r)];
}
export function calc합충(saju){
  const r=[];
  const ps=[[saju.year.지,saju.month.지,"년-월"],[saju.month.지,saju.day.지,"월-일"],[saju.day.지,saju.hour.지,"일-시"]];
  const 합=[["子","丑"],["寅","亥"],["卯","戌"],["辰","酉"],["巳","申"],["午","未"]];
  const 충=[["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]];
  ps.forEach(([a,b,l])=>{합.forEach(([x,y])=>{if((a===x&&b===y)||(a===y&&b===x))r.push({type:"합",label:l,detail:`${a}${b} 육합`});});충.forEach(([x,y])=>{if((a===x&&b===y)||(a===y&&b===x))r.push({type:"충",label:l,detail:`${a}${b} 충`});});});
  return r;
}
export function get대운주기(breed){const i=견종데이터[breed]||견종데이터["기타"];return{주기:Math.max(1,Math.round((i.수명/8)*10)/10),수명:i.수명,체급:i.체급};}
export function dog2human(a,b){const s=(견종데이터[b]||견종데이터["기타"]).체급;if(a<=1)return Math.round(a*15);if(a<=2)return 15+Math.round((a-1)*9);const r=s==="초소형"?4:s==="소형"?5:s==="중형"?5.5:6.5;return 24+Math.round((a-2)*r);}
export function get생애시기(a,l){const r=a/l;if(r<0.08)return"🍼 유아기";if(r<0.18)return"🐶 유년기";if(r<0.30)return"🌱 청년기";if(r<0.50)return"💪 장년기";if(r<0.70)return"🏡 중년기";if(r<0.85)return"🍂 장년후기";return"🤍 노년기";}

export function calc대운(saju,birthYear,breed){
  const r=[],di=천간.indexOf(saju.day.간),mi=천간.indexOf(saju.month.간),mbi=지지.indexOf(saju.month.지),fw=di%2===0;
  const{주기,수명,체급}=get대운주기(breed);const n=Math.min(10,Math.max(6,Math.ceil(수명/주기)));
  for(let i=0;i<n;i++){const o=fw?i+1:-(i+1);const si=((mi+o)%10+10)%10,bi=((mbi+o)%12+12)%12;
  const sa=+(주기*i).toFixed(1),ea=+(주기*(i+1)).toFixed(1);
  r.push({간:천간[si],지:지지[bi],age:sa,endAge:ea,year:birthYear+Math.floor(sa),humanAge:dog2human(sa,breed),시기:get생애시기(sa,수명),pastLifespan:ea>수명,십성:get십성(saju.day.간,천간[si]),운성:get운성(saju.day.간,지지[bi])});}
  return{대운목록:r,주기,수명,체급};
}
export function calc세운(saju,y){const s=천간[(y-4)%10],b=지지[(y-4)%12];return{간:s,지:b,오행:get오행of(s),십성:get십성(saju.day.간,s),운성:get운성(saju.day.간,b)};}
export function calc월운(saju,y){const r=[];for(let m=1;m<=12;m++){const mi=((y%5)*2+m+1)%10,ms=천간[mi],mb=지지[(m+1)%12];r.push({month:m,간:ms,지:mb,오행:get오행of(ms),십성:get십성(saju.day.간,ms),운성:get운성(saju.day.간,mb)});}return r;}

export function hexRgb(h){h=h.replace("#","");return`${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;}
