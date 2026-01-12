import fs from 'fs';
import path from 'path';

const sourceFiles = ['./tokens/colors.json', './tokens/themes/tech.json'];
const outputPath = './tokens/primitive-color.json';

const allColors = new Set();

// 정규식 개선: rgba 내부의 다양한 공백과 소수점 형태를 더 유연하게 매칭
const colorRegex = /#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba\s*\([^)]+\)/g;

/** 1. 파일 전체를 텍스트로 읽어 모든 컬러 추출 */
sourceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(colorRegex);
    if (matches) {
      matches.forEach(color => {
        // [업데이트] 공백을 완전히 제거하고 소문자로 통일하여 저장
        // rgba(251, 191, 36, 0.12) -> rgba(251,191,36,0.12)
        let normalized = color.toLowerCase().replace(/\s+/g, '');

        // #ddd -> #dddddd 변환 (비교 및 변수 생성을 위해)
        if (normalized.startsWith('#') && normalized.length === 4) {
          normalized =
            '#' +
            normalized[1] +
            normalized[1] +
            normalized[2] +
            normalized[2] +
            normalized[3] +
            normalized[3];
        }
        allColors.add(normalized);
      });
    }
  }
});

/** 2. 색상 그룹 판별 함수 */
function getGroup(color) {
  if (color.startsWith('rgba')) return 'alpha';

  let hex = color;
  // 3자리 처리는 위에서 끝냈으므로 바로 슬라이스 가능
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if (diff < 20) return 'gray';

  // Hue 판별 로직 보강
  if (b > r && b > g) return 'blue';
  if (r > g && r > b) {
    if (b > g * 1.5) return 'purple'; // R과 B가 강하면 purple (보라색 판별 강화)
    return 'red';
  }
  if (g > r && g > b) return 'green';
  if (r > b && g > b) return 'yellow';

  return 'etc';
}

const result = {
  primitive: { gray: {}, blue: {}, red: {}, green: {}, yellow: {}, purple: {}, alpha: {}, etc: {} },
};

// 3. 분류 및 저장 (정렬 후 인덱싱)
Array.from(allColors)
  .sort()
  .forEach((color, i) => {
    const group = getGroup(color);
    const targetGroup = result.primitive[group] ? group : 'etc';
    result.primitive[targetGroup][`color-${i}`] = { value: color };
  });

// 백업 생성 (작성하신 bak 명칭 활용)
if (fs.existsSync(outputPath)) {
  fs.copyFileSync(outputPath, `${outputPath}.bak`);
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`✅ 총 ${allColors.size}개의 고유 컬러 추출 및 분류 완료 (백업 생성됨)`);
