/**
 * sync-primitive-colors.mjs
 * - colors.json/tech.json을 스캔해 Raw Hex를 Primitive 토큰으로 치환
 * - primitive-color.json에 없는 색상은 자동 추가
 * - 사용되지 않는 primitive는 정리
 */
import fs from 'fs';

const PROJECT_NAME = 'project';
const PRIMITIVE_PATH = './tokens/color/primitive-color.json';
const SOURCE_FILES = ['./tokens/color/colors.json', './tokens/color/themes/tech.json'];

if (!fs.existsSync(PRIMITIVE_PATH)) {
  console.error('❌ primitive-color.json 파일이 없습니다.');
  process.exit(1);
}

const primitiveData = JSON.parse(fs.readFileSync(PRIMITIVE_PATH, 'utf-8'));
const hexToVarMap = {};
let primitiveDirty = false;
const usedPrimitiveVars = new Set();

// ========== Utility: collect ==========
// Primitive 맵 빌드 (Value -> CSS Var Name)
function buildVarMap(obj, currentPath = []) {
  for (const key in obj) {
      if (obj[key].value) {
        const category = currentPath[currentPath.length - 1];
        const varName = `var(--${PROJECT_NAME}-color-primitive-${category}-${key})`;

        const normalizedValue = normalizeColor(obj[key].value);
        hexToVarMap[normalizedValue] = varName;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      buildVarMap(obj[key], [...currentPath, key]);
    }
  }
}
buildVarMap(primitiveData.primitive);

// ========== Utility: collect ==========
// 소스 파일에서 사용된 primitive var 수집
function collectUsedVars(node) {
  for (const k in node) {
    if (typeof node[k] === 'object' && node[k] !== null) {
      if (node[k].value && typeof node[k].value === 'string') {
        const v = node[k].value.trim();
        if (v.startsWith('var(--project-color-primitive-')) {
          usedPrimitiveVars.add(v);
        }
      } else {
        collectUsedVars(node[k]);
      }
    }
  }
}

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
// RGB -> HSL 변환 (tint 분류/스텝 계산용)
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;
  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
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
  if (s <= 2.5 || l >= 99.5 || l <= 0.5) return 'gray';
  if (h >= 170 && h < 260 && s < 45) return 'slate-blue';
  if (h >= 345 || h < 11) return 'red';
  if (h >= 11 && h < 45) return 'orange';
  if (h >= 45 && h < 65) return 'yellow';
  if (h >= 65 && h < 170) return 'green';
  if (h >= 170 && h < 205) return 'cyan';
  if (h >= 205 && h < 225) return 'sky';
  if (h >= 225 && h < 245) return 'blue';
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

// ========== Step 1: ensure ==========
// primitive에 없으면 새 key를 생성하고 var 반환
function ensurePrimitiveToken(rawValue) {
  const normalized = normalizeColor(rawValue);
  if (hexToVarMap[normalized]) return hexToVarMap[normalized];

  let r;
  let g;
  let b;
  try {
    if (normalized.startsWith('#')) {
      r = parseInt(normalized.slice(1, 3), 16);
      g = parseInt(normalized.slice(3, 5), 16);
      b = parseInt(normalized.slice(5, 7), 16);
    } else {
      const m = normalized.match(/[\d.]+/g);
      [r, g, b] = m.slice(0, 3).map(Number);
    }
  } catch (e) {
    return null;
  }

  const { h, s, l } = rgbToHsl(r, g, b);
  const tint = getTintName(h, s, l);
  const alpha = getAlpha(normalized);
  const groupName = alpha < 1 ? 'alpha' : tint;

  if (!primitiveData.primitive[groupName]) primitiveData.primitive[groupName] = {};

  let key;
  if (alpha === 1 && tint === 'gray') {
    if (l >= 99.9) key = 'white';
    else if (l <= 0.1) key = 'black';
  }
  if (!key) {
    let step = Math.round((100 - l) * 10);
    step = Math.max(50, Math.round(step / 10) * 10);
    key = alpha < 1 ? `${tint}-${step}` : `${step}`;
  }
  let finalKey = key;
  let current = parseInt(key.split('-').pop(), 10) || 50;
  while (primitiveData.primitive[groupName][finalKey]) {
    current += 10;
    finalKey = alpha < 1 ? `${tint}-${current}` : `${current}`;
  }

  primitiveData.primitive[groupName][finalKey] = { value: normalized };
  primitiveDirty = true;

  const varName = `var(--${PROJECT_NAME}-color-primitive-${groupName}-${finalKey})`;
  hexToVarMap[normalized] = varName;
  return varName;
}

// ========== Step 2: replace ==========
// 소스 파일 치환 및 미등록 컬러 감지
SOURCE_FILES.forEach(file => {
  if (!fs.existsSync(file)) return;
  const rawContent = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(rawContent);
  let replaceCount = 0;
  let addedColors = new Set();
  let unresolvedColors = new Set();

  function recurse(node) {
    for (const k in node) {
      if (typeof node[k] === 'object' && node[k] !== null) {
        if (
          node[k].value &&
          typeof node[k].value === 'string' &&
          !node[k].value.startsWith('var(')
        ) {
          let val = normalizeColor(node[k].value);
          if (val === 'transparent') continue;

          if (hexToVarMap[val]) {
            node[k].value = hexToVarMap[val];
            replaceCount++;
          } else {
            const varName = ensurePrimitiveToken(node[k].value);
            if (varName) {
              node[k].value = varName;
              replaceCount++;
              addedColors.add(node[k].value);
            } else {
              unresolvedColors.add(node[k].value);
            }
          }
        } else {
          recurse(node[k]);
        }
      }
    }
  }

  recurse(data);
  collectUsedVars(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  console.log(`✅ [${file}] ${replaceCount}개 토큰 치환 완료.`);

  if (addedColors.size > 0) {
    console.log(`➕ [${file}] primitive-color.json에 ${addedColors.size}개 컬러 추가.`);
  }
  if (unresolvedColors.size > 0) {
    console.warn(`⚠️ [${file}] 변환 실패 컬러:`, Array.from(unresolvedColors));
  }
});

// ========== Step 3: cleanup ==========
// 사용되지 않는 primitive 정리
let removedCount = 0;
for (const [category, colorTokens] of Object.entries(primitiveData.primitive)) {
  for (const key of Object.keys(colorTokens)) {
    const varName = `var(--${PROJECT_NAME}-color-primitive-${category}-${key})`;
    if (!usedPrimitiveVars.has(varName)) {
      delete colorTokens[key];
      removedCount++;
    }
  }
  if (Object.keys(colorTokens).length === 0) delete primitiveData.primitive[category];
}

if (primitiveDirty || removedCount > 0) {
  fs.writeFileSync(PRIMITIVE_PATH, JSON.stringify(primitiveData, null, 2));
  console.log('✅ primitive-color.json 업데이트 완료.');
  if (removedCount > 0) {
    console.log(`🧹 primitive-color.json 미사용 ${removedCount}개 정리.`);
  }
}
