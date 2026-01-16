import fs from 'fs';

const sourceFiles = ['./tokens/colors.json', './tokens/themes/tech.json'];
const outputPath = './tokens/primitive-color.json';
const colorRegex = /#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba\s*\([^)]+\)/g;

/** 1. 기존 데이터 로드 (원천 보호) */
let existingData = { primitive: {} };
if (fs.existsSync(outputPath)) {
  try {
    existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  } catch (e) {
    console.error('❌ 기존 파일을 읽는 중 오류 발생. 새 파일을 생성합니다.');
  }
}

/** 2. 색상 분석 유틸리티 */
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

function getGroup(color) {
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    const match = color.match(/\d+/g);
    [r, g, b] = match.slice(0, 3).map(Number);
  }
  const { h, s } = rgbToHsl(r, g, b);
  if (s < 18) return 'gray';
  if (h >= 165 && h < 205) return 'cyan';
  if (h >= 205 && h < 255) return 'blue';
  if (h >= 345 || h < 10) return 'red';
  if (h >= 10 && h < 45) return 'orange';
  if (h >= 45 && h < 65) return 'yellow';
  if (h >= 65 && h < 165) return 'green';
  if (h >= 250 && h < 315) return 'purple';
  return 'pink';
}

/** 3. 새로운 컬러 수집 및 필터링 */
const newRawColors = new Set();
sourceFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(colorRegex);
  if (matches) {
    matches.forEach(color => {
      let normalized = color.toLowerCase().replace(/\s+/g, '');
      if (normalized.startsWith('#') && normalized.length === 4) {
        normalized =
          '#' + normalized[1].repeat(2) + normalized[2].repeat(2) + normalized[3].repeat(2);
      }
      newRawColors.add(normalized);
    });
  }
});

// 기존에 이미 등록된 값 추출
const registeredValues = new Set();
Object.values(existingData.primitive).forEach(group => {
  Object.values(group).forEach(token =>
    registeredValues.add(token.value.toLowerCase().replace(/\s+/g, '')),
  );
});

/** 4. 미등록 컬러만 분류 및 추가 */
const groupsToAdd = {
  gray: [],
  blue: [],
  cyan: [],
  purple: [],
  red: [],
  orange: [],
  yellow: [],
  green: [],
  pink: [],
  alpha: [],
};

newRawColors.forEach(color => {
  if (registeredValues.has(color)) return; // 이미 있으면 건너뜀

  const isAlpha = color.startsWith('rgba') || (color.startsWith('#') && color.length === 9);
  const tintName = getGroup(color);
  const groupName = isAlpha ? 'alpha' : tintName;

  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    const m = color.match(/[\d.]+/g);
    [r, g, b] = m.slice(0, 3).map(Number);
  }
  const { l } = rgbToHsl(r, g, b);
  groupsToAdd[groupName].push({ value: color, l, tintName });
});

/** 5. 기존 데이터에 새 컬러 병합 */
Object.keys(groupsToAdd).forEach(groupName => {
  if (groupsToAdd[groupName].length === 0) return;

  // 그룹이 없으면 생성
  if (!existingData.primitive[groupName]) existingData.primitive[groupName] = {};

  // 새 컬러들 정렬 (명도순)
  groupsToAdd[groupName].sort((a, b) => b.l - a.l);

  groupsToAdd[groupName].forEach(item => {
    let step = Math.round((100 - item.l) * 10);
    step = Math.max(50, Math.round(step / 10) * 10);

    let key = groupName === 'alpha' ? `${item.tintName}-${step}` : `${step}`;
    let current = step;

    // 키 중복 방지 (기존 키와도 대조)
    while (existingData.primitive[groupName][key]) {
      current += 10;
      key = groupName === 'alpha' ? `${item.tintName}-${current}` : `${current}`;
    }

    existingData.primitive[groupName][key] = { value: item.value };
    console.log(`✨ 새 컬러 추가: [${groupName}] ${key} (${item.value})`);
  });
});

/** 6. 최종 저장 */
fs.writeFileSync(outputPath, JSON.stringify(existingData, null, 2));
console.log(`✅ 업데이트 완료. 기존 원천 데이터 보존 및 신규 컬러 병합됨.`);
