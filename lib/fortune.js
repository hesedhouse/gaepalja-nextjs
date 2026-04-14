import { get오행of, get음양of, 오행명, 견종데이터 } from "./saju";

// ─── FORTUNE TEXT ────────────────────────────────────────────
export function generateFortune(name,saju,breed){
  const el=get오행of(saju.day.간);
  const 총운={
    木:[`丙火生木 萬物皆榮`,`병화생목 만물개영`,`봄바람이 불어오니 ${name}에게 새로운 기운이 가득하도다. 나무가 뿌리를 깊이 내리듯 가정에서의 유대가 더욱 깊어지는 해이니, 주인과의 산책길에 좋은 기운을 만나리라.`],
    火:[`火旺之年 精力充沛`,`화왕지년 정력충패`,`${name}의 기운이 하늘을 찌르니 올해는 그 어느 때보다 활력이 넘치는 한 해로다. 불의 기운이 강하니 새로운 놀이와 훈련에서 빛나는 재능을 보이리라.`],
    土:[`厚德載物 安居樂業`,`후덕재물 안거낙업`,`대지의 기운을 타고난 ${name}이여, 올해는 안정과 평화의 해로다. 집안에 귀한 기운이 머무니 가족 모두에게 행복을 가져다주리라.`],
    金:[`金氣凜冽 聰慧過人`,`금기름렬 총혜과인`,`쇠의 기운이 맑고 날카로우니 ${name}의 지혜가 빛나는 해로다. 훈련에서 놀라운 진보를 보이며 주인의 마음을 꿰뚫어 보는 영특함이 돋보이리라.`],
    水:[`水流不息 智慧無窮`,`수류불식 지혜무궁`,`물의 기운이 도도히 흐르니 ${name}에게 지혜와 직감이 극대화되는 해로다. 주인의 감정을 누구보다 잘 읽어내며 깊은 유대감을 형성하리라.`],
  };
  const 월별={
    1:{한자:"歲首迎春 萬象更新",한글:"새해의 시작이라 새로운 기운이 감도니 산책길에 좋은 인연을 만나리라."},
    2:{한자:"寒盡春來 生氣勃發",한글:"추위가 물러가고 봄기운이 오니 활력이 넘치고 식욕이 왕성하리라."},
    3:{한자:"桃李滿開 喜氣洋洋",한글:"꽃이 피는 계절에 기분이 좋아지니 다른 강아지와의 만남이 즐거우리라."},
    4:{한자:"春雨如膏 潤澤萬物",한글:"봄비가 내리듯 좋은 기운이 스며드니 건강이 특히 좋은 달이로다."},
    5:{한자:"薰風南來 花繁葉茂",한글:"따뜻한 바람에 기운이 충만하니 야외 활동에서 큰 기쁨을 얻으리라."},
    6:{한자:"炎陽高照 宜靜不宜動",한글:"더위가 극심하니 무리한 활동을 삼가고 시원한 곳에서 쉬는 것이 좋으리라."},
    7:{한자:"流火漸退 涼意初生",한글:"더위가 조금 누그러지니 저녁 산책에서 좋은 에너지를 얻으리라."},
    8:{한자:"秋高氣爽 萬里無雲",한글:"가을 하늘이 맑으니 건강운이 상승하고 모든 일이 순조로우리라."},
    9:{한자:"丹楓映水 景色如畫",한글:"단풍이 물드는 계절에 주인과 특별한 추억을 만들리라."},
    10:{한자:"霜降水清 精神煥發",한글:"서리가 내리는 시기에 정신이 맑아지니 훈련 성과가 빛나리라."},
    11:{한자:"初冬微寒 宜養精蓄銳",한글:"초겨울 추위에 건강관리가 중요하니 따뜻한 잠자리를 마련해주라."},
    12:{한자:"歲暮將至 福壽雙全",한글:"한 해를 마무리하며 가족의 사랑이 깊어지니 복된 한 해였도다."},
  };
  const 건강={木:"간장(肝)과 근육 건강에 유의하라. 충분한 산책으로 기를 순환시키고 초록색 채소가 들어간 간식이 기운을 북돋우리라.",火:"심장(心)과 체온 조절에 주의하라. 한여름 무더위를 피하고 심장에 좋은 연어나 생선 기름을 보충하면 좋으리라.",土:"비장(脾)과 소화기관을 살피라. 과식을 삼가고 규칙적인 식사 시간을 지키면 소화가 편안하고 기운이 넘치리라.",金:"폐(肺)와 피부 건강에 신경 쓰라. 건조한 환경을 피하고 오메가-3가 풍부한 음식으로 피모 건강을 지키라.",水:"신장(腎)과 비뇨기 건강에 주의하라. 항상 깨끗한 물을 충분히 제공하고 몸을 따뜻하게 유지하는 것이 건강의 비결이니라."};
  const 성격={
    木:{title:"자유로운 영혼의 산책왕",traits:["인자하고 측은지심이 깊어 작은 동물에게도 다정함","호기심이 많아 새로운 환경에 흥미를 보이며 탐험을 즐김","고집이 있으나 그 속에 올곧은 성품이 깃들어 있음","봄과 새벽의 기운을 타고나 아침 산책에서 가장 활발함"]},
    火:{title:"열정 넘치는 충성의 화신",traits:["예절 바르고 활발하여 주변을 밝게 비추는 존재","주인에 대한 충성심이 하늘을 찌르며 보호 본능이 강함","감정 표현이 풍부하여 기쁨과 슬픔을 온몸으로 나타냄","여름과 낮의 기운이 강하여 해가 떠 있을 때 가장 활기참"]},
    土:{title:"듬직한 대지의 수호자",traits:["신의가 두텁고 한결같아 한 번 맺은 인연을 소중히 함","인내심이 강하고 어린아이와 잘 어울리는 다정한 성품","규칙적인 생활을 좋아하며 자기 자리를 잘 지키는 의젓함","환절기의 기운을 타고나 사계절 내내 안정적인 컨디션 유지"]},
    金:{title:"기품 있는 귀족 강아지",traits:["결단력이 있고 판단력이 뛰어나 훈련 성과가 탁월함","깔끔하고 정돈된 것을 좋아하는 세련된 취향의 소유자","의리가 강하되 쉽게 마음을 열지 않는 도도한 매력","가을과 저녁의 기운을 타고나 해질녘 산책에서 가장 돋보임"]},
    水:{title:"지혜로운 영특한 강아지",traits:["머리가 비상하고 상황 판단이 빨라 눈치가 탁월함","물놀이를 좋아하며 유연하고 적응력이 뛰어남","주인의 감정을 귀신같이 읽어내는 공감 능력의 소유자","겨울과 밤의 기운을 타고나 고요한 시간에 더욱 깊은 교감을 나눔"]},
  };
  const 궁합={
    木:{best:"水",worst:"金",desc:"물 기운의 반려인이 나무 기운을 키워주니 서로 성장하는 최고의 궁합이로다."},
    火:{best:"木",worst:"水",desc:"나무 기운의 반려인이 불꽃을 지펴주니 서로에게 활력을 주는 환상의 조합이로다."},
    土:{best:"火",worst:"木",desc:"불 기운의 반려인이 대지를 따뜻하게 하니 든든하고 포근한 관계를 이루리라."},
    金:{best:"土",worst:"火",desc:"흙 기운의 반려인이 쇠를 품어주니 안정적이고 신뢰 깊은 관계를 형성하리라."},
    水:{best:"金",worst:"土",desc:"쇠 기운의 반려인이 물을 맑게 하니 서로의 지혜를 나누는 깊은 유대를 맺으리라."},
  };
  return{총운:총운[el],월별,건강:건강[el],성격:성격[el],궁합:궁합[el]};
}

// ─── OWNER COMPATIBILITY (BUG FIX: name 인자 추가) ──────────
export function calcOwnerCompat(dogSaju, ownerSaju, dogName) {
  const name = dogName || "강아지";
  const dogEl = get오행of(dogSaju.day.간);
  const ownerEl = get오행of(ownerSaju.day.간);

  const 상생 = {木:"火",火:"土",土:"金",金:"水",水:"木"};
  const 상극 = {木:"土",火:"金",土:"水",金:"木",水:"火"};

  let score = 60;
  let details = [];

  if (dogEl === ownerEl) {
    score += 20;
    details.push({icon:"☯",title:"비화(比和) 관계",desc:"같은 오행끼리 만나 서로 공감하고 이해하는 관계입니다. 말 없이도 통하는 깊은 유대가 형성됩니다.",type:"good"});
  } else if (상생[ownerEl] === dogEl) {
    score += 35;
    details.push({icon:"💝",title:"상생(相生) 관계 — 주인이 키워주는 기운",desc:`반려인의 ${오행명[ownerEl]}(${ownerEl}) 기운이 ${name}의 ${오행명[dogEl]}(${dogEl}) 기운을 생(生)해주니, 반려인이 자연스럽게 돌봄과 사랑을 주는 천생의 인연입니다.`,type:"great"});
  } else if (상생[dogEl] === ownerEl) {
    score += 25;
    details.push({icon:"🌟",title:"상생(相生) 관계 — 강아지가 빛나게 하는 기운",desc:`${name}의 ${오행명[dogEl]}(${dogEl}) 기운이 반려인의 ${오행명[ownerEl]}(${ownerEl}) 기운을 생(生)해주니, 함께 있으면 반려인에게 활력과 행복을 주는 관계입니다.`,type:"good"});
  } else if (상극[ownerEl] === dogEl) {
    score -= 5;
    details.push({icon:"⚡",title:"상극(相剋) 관계 — 긴장의 기운",desc:`반려인의 ${오행명[ownerEl]}(${ownerEl}) 기운이 ${name}의 ${오행명[dogEl]}(${dogEl}) 기운을 극(剋)하니, 훈련 시 인내심이 필요합니다. 하지만 이 긴장감이 오히려 서로를 성장시키는 원동력이 됩니다.`,type:"caution"});
  } else {
    score -= 10;
    details.push({icon:"🔥",title:"상극(相剋) 관계 — 도전의 기운",desc:`${name}의 ${오행명[dogEl]}(${dogEl}) 기운이 반려인의 ${오행명[ownerEl]}(${ownerEl}) 기운을 극(剋)하니, 때로 의견 충돌이 있을 수 있으나 깊은 사랑으로 극복할 수 있습니다.`,type:"caution"});
  }

  const dogYY = get음양of(dogSaju.day.간);
  const ownerYY = get음양of(ownerSaju.day.간);
  if (dogYY !== ownerYY) {
    score += 15;
    details.push({icon:"☯",title:"음양 조화",desc:`반려인은 ${ownerYY}, ${name}은 ${dogYY} — 음양이 서로 보완하여 조화로운 관계를 이룹니다.`,type:"good"});
  } else {
    score += 5;
    details.push({icon:"⚖️",title:"음양 동일",desc:`둘 다 ${dogYY}의 기운이라 성격이 비슷합니다. 서로의 장단점이 겹치므로 의식적인 배려가 필요합니다.`,type:"neutral"});
  }

  const dogDayBranch = dogSaju.day.지;
  const ownerDayBranch = ownerSaju.day.지;
  const 육합 = [["子","丑"],["寅","亥"],["卯","戌"],["辰","酉"],["巳","申"],["午","未"]];
  const 충pairs = [["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]];
  let found합 = false, found충 = false;
  육합.forEach(([x,y])=>{if((dogDayBranch===x&&ownerDayBranch===y)||(dogDayBranch===y&&ownerDayBranch===x))found합=true;});
  충pairs.forEach(([x,y])=>{if((dogDayBranch===x&&ownerDayBranch===y)||(dogDayBranch===y&&ownerDayBranch===x))found충=true;});

  if (found합) {
    score += 15;
    details.push({icon:"🔗",title:`일지 육합 (${dogDayBranch}${ownerDayBranch})`,desc:"일지끼리 육합이 되니 이보다 더 좋은 인연은 없습니다! 전생에 맺은 특별한 인연이로다.",type:"great"});
  } else if (found충) {
    score -= 5;
    details.push({icon:"💥",title:`일지 충 (${dogDayBranch}${ownerDayBranch})`,desc:"일지끼리 충이 되니 가끔 마찰이 있을 수 있으나, 이는 서로를 더 깊이 이해하게 되는 과정입니다.",type:"caution"});
  }

  const dogEls = [get오행of(dogSaju.year.간),get오행of(dogSaju.month.간),get오행of(dogSaju.day.간),get오행of(dogSaju.hour.간)];
  const ownerEls = [get오행of(ownerSaju.year.간),get오행of(ownerSaju.month.간),get오행of(ownerSaju.day.간),get오행of(ownerSaju.hour.간)];
  const dogCounts = {}, ownerCounts = {};
  dogEls.forEach(e=>dogCounts[e]=(dogCounts[e]||0)+1);
  ownerEls.forEach(e=>ownerCounts[e]=(ownerCounts[e]||0)+1);
  const dogMissing = ["木","火","土","金","水"].filter(e=>!dogCounts[e]);
  const ownerHas = dogMissing.filter(e=>ownerCounts[e]);
  if (ownerHas.length > 0) {
    score += 10;
    details.push({icon:"🧩",title:"오행 보완",desc:`${name}에게 부족한 ${ownerHas.map(e=>오행명[e]).join(", ")} 기운을 반려인이 채워주니, 함께 있으면 ${name}이 더 건강하고 안정적입니다.`,type:"good"});
  }

  score = Math.min(100, Math.max(30, score));

  let grade, gradeColor, gradeDesc;
  if (score >= 90) { grade = "천생연분"; gradeColor = "#ef4444"; gradeDesc = "하늘이 맺어준 인연! 전생에 약속한 반려 관계입니다."; }
  else if (score >= 80) { grade = "최상의 궁합"; gradeColor = "#f97316"; gradeDesc = "서로에게 큰 행복을 주는 아주 좋은 인연입니다."; }
  else if (score >= 70) { grade = "좋은 궁합"; gradeColor = "#22c55e"; gradeDesc = "자연스럽게 잘 맞는 편안한 관계입니다."; }
  else if (score >= 55) { grade = "보통 궁합"; gradeColor = "#eab308"; gradeDesc = "노력하면 더 좋아질 수 있는 발전 가능성이 있는 관계입니다."; }
  else { grade = "노력의 궁합"; gradeColor = "#94a3b8"; gradeDesc = "서로를 이해하려는 노력이 필요하지만, 그만큼 깊어지는 관계입니다."; }

  const tips = [];
  if (score >= 80) tips.push(`${name}과(와) 함께하는 시간이 많을수록 서로의 기운이 상승합니다. 매일 산책을 빠뜨리지 마세요.`);
  if (dogMissing.length > 0) tips.push(`${name}에게 부족한 ${dogMissing.map(e=>오행명[e]).join(",")} 기운을 보완하는 간식이나 장난감을 활용해보세요.`);
  if (found충) tips.push("충의 기운이 있으니, 훈련 시 부드러운 목소리와 인내심을 갖는 것이 중요합니다.");
  tips.push("매주 함께하는 특별한 루틴(산책 코스, 놀이 시간)을 만들면 유대감이 크게 깊어집니다.");

  return { score, grade, gradeColor, gradeDesc, details, tips, dogEl, ownerEl };
}

// ─── COUPANG PRODUCT RECOMMENDATIONS ────────────────────────
// 빌드 타임에 scripts/fetch-coupang.mjs가 생성한 정적 JSON 사용
// 캐시가 없거나 fetch 실패 시 빈 배열 반환
export function getCoupangRecs(coupangCache, el, missing, breed) {
  if (!coupangCache) return [];
  const recs = [];

  const elRecs = coupangCache?.오행?.[el] || [];
  recs.push(...elRecs);

  for (const m of missing) {
    const rec = coupangCache?.보완?.[m];
    if (rec) recs.push(rec);
  }

  const 체급 = (견종데이터[breed] || 견종데이터["기타"]).체급;
  const sizeKey = (체급 === "소형" || 체급 === "초소형") ? "소형" : "대형";
  const sizeRec = coupangCache?.체급?.[sizeKey];
  if (sizeRec) recs.push(sizeRec);

  return recs.slice(0, 6);
}
