import fs from 'fs';

const PROJECT_NAME = 'project'; // 프로젝트 이름
const PRIMITIVE_PATH = './tokens/primitive-color.json';
const SOURCE_FILES = ['./tokens/colors.json', './tokens/themes/tech.json'];

// 1. Primitive 맵 생성 (Hex -> CSS Variable)
// 결과 예: { "#000000": "var(--project-color-primitive-gray-0)" }
const primitiveData = JSON.parse(fs.readFileSync(PRIMITIVE_PATH, 'utf-8'));
const hexToVarMap = {};

function buildVarMap(obj, currentPath = []) {
  for (const key in obj) {
    if (obj[key].value) {
      // 'color-0'에서 'color-'를 제거하여 숫자만 남기거나 그대로 사용
      const colorName = key.replace('color-', '');
      const groupName = currentPath[currentPath.length - 1]; // gray, blue 등

      const varName = `var(--${PROJECT_NAME}-color-primitive-${groupName}-${colorName})`;
      hexToVarMap[obj[key].value.toLowerCase()] = varName;
    } else if (typeof obj[key] === 'object') {
      buildVarMap(obj[key], [...currentPath, key]);
    }
  }
}

// primitive.gray, primitive.blue 구조를 순회
buildVarMap(primitiveData.primitive);

// 2. 소스 파일 치환 함수
function applyCssVar(obj) {
  let count = 0;
  function recurse(currentObj) {
    for (const key in currentObj) {
      if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
        if (currentObj[key].value && typeof currentObj[key].value === 'string') {
          // ✅ 비교 대상의 공백을 제거하고 소문자로 변환
          const originalValue = currentObj[key].value.toLowerCase().replace(/\s+/g, '');

          if (hexToVarMap[originalValue]) {
            currentObj[key].value = hexToVarMap[originalValue];
            count++;
          }
        } else {
          recurse(currentObj[key]);
        }
      }
    }
  }
  recurse(obj);
  return count;
}

// 3. 실행 및 저장
SOURCE_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    applyCssVar(data);

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`✅ CSS 변수 치환 완료: ${file}`);
  }
});
