// URL 공유용 인코더 — 브라우저/Node/Edge 공통 동작
// 입력 데이터는 사주 계산에 필요한 최소 필드만 담아 base64url로 짧게 만든다.

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url) {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeShareData(data) {
  const compact = {
    n: data.name,
    b: data.breed,
    g: data.gender,
    y: Number(data.birthYear),
    m: Number(data.birthMonth),
    d: Number(data.birthDay),
    h: Number(data.birthHour),
    kt: data.knowTime ? 1 : 0,
  };
  return toBase64Url(JSON.stringify(compact));
}

export function decodeShareData(encoded) {
  if (!encoded || typeof encoded !== "string") return null;
  try {
    const c = JSON.parse(fromBase64Url(encoded));
    if (!c || !c.n || !c.b || !c.y || !c.m || !c.d) return null;
    return {
      name: String(c.n),
      breed: String(c.b),
      gender: String(c.g || ""),
      birthYear: String(c.y),
      birthMonth: String(c.m),
      birthDay: String(c.d),
      birthHour: String(c.h ?? 12),
      knowTime: c.kt === 1 || c.kt === true,
    };
  } catch {
    return null;
  }
}
