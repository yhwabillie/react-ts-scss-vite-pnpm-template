import fs from 'fs';

const PROJECT_NAME = 'project';
const PRIMITIVE_PATH = './tokens/primitive-color.json';
const SOURCE_FILES = ['./tokens/colors.json', './tokens/themes/tech.json'];

if (!fs.existsSync(PRIMITIVE_PATH)) {
  console.error('❌ primitive-color.json 파일이 없습니다.');
  process.exit(1);
}

const primitiveData = JSON.parse(fs.readFileSync(PRIMITIVE_PATH, 'utf-8'));
const hexToVarMap = {};

/** 1. Primitive 맵 빌드 (Value -> CSS Var Name) */
function buildVarMap(obj, currentPath = []) {
  for (const key in obj) {
    // value가 있다는 것은 최종 토큰이라는 의미
    if (obj[key].value) {
      // 뎁스 예: ["primitive", "slate-blue"]
      // 우리는 카테고리 이름(slate-blue, sky 등)이 필요함
      const category = currentPath[currentPath.length - 1];
      const varName = `var(--${PROJECT_NAME}-color-primitive-${category}-${key})`;

      // 값 정규화 (공백 제거, 소문자)
      const normalizedValue = obj[key].value.toLowerCase().replace(/\s+/g, '');
      hexToVarMap[normalizedValue] = varName;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      buildVarMap(obj[key], [...currentPath, key]);
    }
  }
}
buildVarMap(primitiveData.primitive);

/** 2. 소스 파일 치환 및 미등록 컬러 감지 */
SOURCE_FILES.forEach(file => {
  if (!fs.existsSync(file)) return;
  const rawContent = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(rawContent);
  let replaceCount = 0;
  let missingColors = new Set();

  function recurse(node) {
    for (const k in node) {
      if (typeof node[k] === 'object' && node[k] !== null) {
        if (
          node[k].value &&
          typeof node[k].value === 'string' &&
          !node[k].value.startsWith('var(')
        ) {
          let val = node[k].value.toLowerCase().replace(/\s+/g, '');
          if (val === 'transparent') continue;

          // 3자리 HEX 보정
          if (val.startsWith('#') && val.length === 4) {
            val = '#' + val[1].repeat(2) + val[2].repeat(2) + val[3].repeat(2);
          }

          // 치환 진행
          if (hexToVarMap[val]) {
            node[k].value = hexToVarMap[val];
            replaceCount++;
          } else {
            missingColors.add(node[k].value);
          }
        } else {
          recurse(node[k]);
        }
      }
    }
  }

  recurse(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  console.log(`✅ [${file}] ${replaceCount}개 토큰 치환 완료.`);

  if (missingColors.size > 0) {
    console.warn(
      `⚠️ 미등록 컬러 발견 (primitive-color.json에 없는 색상):`,
      Array.from(missingColors),
    );
  }
});
