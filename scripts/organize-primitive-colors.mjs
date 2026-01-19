/**
 * primitive-color.json 정리 흐름
 * - normalize → HSL/alpha → tint 분류 → 정렬
 * - 기존 group/key 유지, 충돌 시만 key 재배치
 */
import fs from 'fs';

const PATH = './tokens/color/primitive-color.json';

if (!fs.existsSync(PATH)) {
  console.error('❌ 파일을 찾을 수 없습니다.');
  process.exit(1);
}
const rawData = JSON.parse(fs.readFileSync(PATH, 'utf-8'));

// ========== Utility: normalize ==========
// #rgb/#rgba/rgba 등 입력을 비교 가능한 형태로 통일
function normalizeColor(val) {
  let color = val.toLowerCase().replace(/\s+/g, '');
  if (color.startsWith('#')) {
    if (color.length === 4)
      return '#' + color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2);
    if (color.length === 5)
      return '#' + color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2) + 'ff';
  }
  return color;
}

// ========== Utility: convert ==========
// RGB -> HSL 변환 (tint 분류/정렬용)
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// ========== Rule: tint ==========
// hue/채도/명도 기준으로 색상군 결정
function getTintName(h, s, l) {
  // 1. Gray: 채도 2.5% 이하
  if (s <= 2.5 || l >= 99.5 || l <= 0.5) return 'gray';

  // 2. Slate Blue: 탁한 블루/그레이 계열 (채도 45% 미만)
  if (h >= 170 && h < 260 && s < 45) return 'slate-blue';

  // 3. Hue 기반 정밀 분류
  if (h >= 345 || h < 11) return 'red';
  if (h >= 11 && h < 45) return 'orange';
  if (h >= 45 && h < 65) return 'yellow';

  // ✅ Green: 65~170
  if (h >= 65 && h < 170) return 'green';

  // ✅ Cyan: 170~205
  if (h >= 170 && h < 205) return 'cyan';

  // ✅ Sky: 205~225
  if (h >= 205 && h < 225) return 'sky';

  // ✅ Blue: 225~245
  if (h >= 225 && h < 245) return 'blue';

  // ✅ Indigo: 245~270
  if (h >= 245 && h < 270) return 'indigo';
  if (h >= 270 && h < 310) return 'purple';
  if (h >= 310 && h < 345) return 'pink';

  return 'etc';
}

// ========== Utility: alpha ==========
// rgba/#rrggbbaa 에서 알파값 추출
function getAlpha(color) {
  if (color.startsWith('rgba')) {
    const m = color.match(/[\d.]+/g);
    return m && m[3] ? parseFloat(m[3]) : 1;
  }
  if (color.startsWith('#') && color.length === 9) return parseInt(color.slice(7, 9), 16) / 255;
  return 1;
}

// ========== Step 1: collect ==========
// 토큰 수집 + 기존 group/key 메타 보존
const allTokens = [];
function collect(groupName, obj) {
  for (const k in obj) {
    if (obj[k].value) {
      const val = normalizeColor(obj[k].value);
      try {
        let r, g, b;
        if (val.startsWith('#')) {
          r = parseInt(val.slice(1, 3), 16);
          g = parseInt(val.slice(3, 5), 16);
          b = parseInt(val.slice(5, 7), 16);
        } else {
          const m = val.match(/[\d.]+/g);
          [r, g, b] = m.slice(0, 3).map(Number);
        }
        const { h, s, l } = rgbToHsl(r, g, b);
        allTokens.push({
          value: val,
          h,
          s,
          l,
          a: getAlpha(val),
          tint: getTintName(h, s, l),
          existingGroup: groupName,
          existingKey: k,
        });
      } catch (e) {
        console.warn(`⚠️ 무시됨: ${obj[k].value}`);
      }
    } else if (typeof obj[k] === 'object') {
      collect(groupName, obj[k]);
    }
  }
}
Object.entries(rawData.primitive).forEach(([groupName, groupTokens]) => {
  collect(groupName, groupTokens);
});

// ========== Step 2: sort ==========
// alpha는 뒤로, tint/명도 기준으로 정렬
const groupOrder = [
  'gray',
  'slate-blue',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'etc',
];

allTokens.sort((a, b) => {
  const isAlphaA = a.a < 1;
  const isAlphaB = b.a < 1;
  if (isAlphaA !== isAlphaB) return isAlphaA ? 1 : -1;
  if (a.tint !== b.tint) return groupOrder.indexOf(a.tint) - groupOrder.indexOf(b.tint);

  // 같은 그룹 내에서는 명도(L) 내림차순 (밝은 것부터)
  if (Math.abs(b.l - a.l) > 0.01) return b.l - a.l;
  return a.a - b.a;
});

// ========== Step 3: write ==========
// 기존 key 유지, 충돌 시만 +10 스텝으로 회피
const organized = { primitive: {} };
allTokens.forEach(item => {
  const isAlpha = item.a < 1;
  const computedGroupName = isAlpha ? 'alpha' : item.tint;
  const groupName = item.existingGroup || computedGroupName;
  if (!organized.primitive[groupName]) organized.primitive[groupName] = {};

  let key = item.existingKey;
  if (!key) {
    if (!isAlpha && item.tint === 'gray') {
      if (item.l >= 99.9) key = 'white';
      else if (item.l <= 0.1) key = 'black';
    }
    if (!key) {
      let step = Math.round((100 - item.l) * 10);
      step = Math.max(50, Math.round(step / 10) * 10);
      key = isAlpha ? `${item.tint}-${step}` : `${step}`;
    }
  }
  let finalKey = key;
  let current = parseInt(key.split('-').pop(), 10) || 50;
  while (organized.primitive[groupName][finalKey]) {
    current += 10;
    finalKey = isAlpha ? `${item.tint}-${current}` : `${current}`;
  }
  if (item.existingKey && finalKey !== item.existingKey) {
    console.warn(`⚠️ 키 충돌로 변경됨: ${groupName}.${item.existingKey} -> ${finalKey}`);
  }
  organized.primitive[groupName][finalKey] = { value: item.value };
});

fs.writeFileSync(PATH, JSON.stringify(organized, null, 2));
console.log('✅ [세분화 정렬 완료] slate-blue, sky, blue 그룹이 분리되었습니다.');
