/** Primitive 전용 SCSS Map 포맷 */
const scssPrimitiveMapFormat = ({ dictionary }) => {
  const { tokens } = dictionary;
  let output = '$g_primitive_colors: (\n';

  // tokens.primitive 아래에 새로 생성된 그룹(sky, indigo 등)이 들어있어야 합니다.
  Object.entries(tokens.primitive).forEach(([category, colorTokens]) => {
    output += `  "${category}": (\n`;
    Object.entries(colorTokens).forEach(([name, token]) => {
      const cleanName = name.replace('color-', '');
      output += `    "${cleanName}": ${token.value},\n`;
    });
    output += `  ),\n`;
  });

  output += ');';
  return output;
};

/** Primitive 전용 TS 데이터 포맷 수정 */
const typescriptPrimitiveMetaFormat = ({ dictionary }) => {
  const { tokens } = dictionary;

  // tokens.primitive 안에 'blue', 'sky', 'slate-blue' 등이 각각 존재해야 함
  const result = Object.entries(tokens.primitive).map(([category, colorTokens]) => ({
    category: category.toUpperCase(), // ✅ 'BLUE', 'SKY', 'SLATE-BLUE' 등으로 표시됨
    colors: Object.entries(colorTokens).map(([key, token]) => {
      // name이 '50', '100' 등일 수도 있고 'color-50'일 수도 있음
      const cleanKey = key.replace('color-', '');

      return {
        id: `primitive-${category}-${cleanKey}`,
        name: cleanKey,
        value: token.value,
        // ✅ 여기서 변수명이 CSS 변수와 일치하는지 확인 (예: --color-primitive-sky-50)
        variable: `--color-primitive-${category}-${cleanKey}`,
      };
    }),
  }));

  return `export const PrimitiveTokensData = ${JSON.stringify(result, null, 2)};`;
};

/** 1. Color 전용 SCSS Map 포맷 (Light/Dark 테마 지원) */
const scssColorMapFormat = ({ dictionary }) => {
  const { allTokens } = dictionary;

  const lightTokens = allTokens.filter(t => t.path.includes('light'));
  const darkTokens = allTokens.filter(t => t.path.includes('dark'));

  const generateMapContent = (tokens, filterOut) => {
    return tokens
      .map(t => {
        // --color- 접두사를 제외한 나머지 경로를 키로 사용
        const key = t.path.filter(p => p !== filterOut).join('-');
        return `    "${key}": ${t.value},`;
      })
      .join('\n');
  };

  let output = '$g_colors: (\n';
  output += '  "light": (\n';
  output += generateMapContent(lightTokens, 'light');
  output += '\n  ),\n';
  output += '  "dark": (\n';
  output += generateMapContent(darkTokens, 'dark');
  output += '\n  )\n';
  output += ');';

  return output;
};

/** 5. 테마 전용 SCSS Map 포맷 수정 */
const scssThemeColorMapFormat = ({ dictionary }) => {
  const { allTokens } = dictionary;
  const lightTokens = allTokens.filter(t => t.path.includes('light'));
  const darkTokens = allTokens.filter(t => t.path.includes('dark'));

  const generateMapContent = tokens => {
    return tokens
      .map(t => {
        // ✅ 'color'는 필터링에서 제외하여 Key에 포함되도록 수정!
        const keyParts = t.path.filter(
          p => p !== 'light' && p !== 'dark' && p !== 'value',
          // p !== 'color' 를 지웠습니다.
        );
        const key = keyParts.join('-');
        return `    "${key}": ${t.value},`;
      })
      .join('\n');
  };

  let output = '$g_theme_colors: (\n';
  output += '  "light": (\n' + generateMapContent(lightTokens) + '\n  ),\n';
  output += '  "dark": (\n' + generateMapContent(darkTokens) + '\n  )\n';
  output += ');';

  return output;
};

/** 6. 테마 전용 TS 데이터 포맷 (Storybook용) */
const typescriptThemeMetaObjectFormat = ({ dictionary }) => {
  const tokens = dictionary.allTokens.reduce((acc, token) => {
    // 1. 'light' 테마를 기준으로 데이터를 생성 (dark와 병합하기 위함)
    if (token.path.includes('light')) {
      // 2. 경로 정제: 'light', 'dark', 'value' 등 불필요한 키워드 제거
      // 'color'는 접두사로 쓸 것이므로 경로에서 제거하여 중복 방지
      const keyParts = token.path.filter(
        p => p !== 'light' && p !== 'dark' && p !== 'color' && p !== 'value',
      );

      // 3. ID 생성: --color- 접두사를 붙여 공통 토큰과 형식을 맞춤
      const key = keyParts.join('-');
      const id = `--color-${key}`;

      // 4. 동일한 경로의 dark 버전 값을 찾아 매칭
      const darkToken = dictionary.allTokens.find(
        t => t.path.join('-') === token.path.join('-').replace('light', 'dark'),
      );

      acc.push({
        id: id, // ✅ 결과 예시: --color-primary-breadcrumb-current-text
        lightValue: token.value,
        darkValue: darkToken ? darkToken.value : token.value,
        usage: token.usage || key,
        description: token.comment || '',
      });
    }
    return acc;
  }, []);

  return `export const TokenData = ${JSON.stringify(tokens, null, 2)};`;
};

/** 2. Color 전용 TS 데이터 포맷 (Storybook Meta용) */
const typescriptMetaObjectFormat = ({ dictionary }) => {
  const tokens = dictionary.allTokens.reduce((acc, token) => {
    if (token.path.includes('light')) {
      // 1. 경로에서 'light'를 제외하고 'color' 중복도 제거
      const keyParts = token.path.filter(p => p !== 'light');

      // 2. 만약 첫 번째 경로가 이미 'color'라면 중복해서 붙이지 않음
      const prefix = keyParts[0] === 'color' ? '--' : '--color-';
      const key = keyParts.join('-');

      const darkToken = dictionary.allTokens.find(
        t => t.path.join('-') === token.path.join('-').replace('light', 'dark'),
      );

      acc.push({
        id: `${prefix}${key}`, // ✅ 중복 방지 로직 적용
        lightValue: token.value,
        darkValue: darkToken ? darkToken.value : token.value,
        usage: token.usage || '',
        description: token.comment || '',
      });
    }
    return acc;
  }, []);

  return `export const ColorTokensData = ${JSON.stringify(tokens, null, 2)};`;
};

/** 3. Typography SCSS Map 포맷 (대소문자 일관성 확보) */
const scssTypographyMapFormat = ({ dictionary }) => {
  const typoData = dictionary.tokens.typography;
  let output = '$g_typography: (\n';

  Object.keys(typoData).forEach(scale => {
    // ✅ scale.toLowerCase()를 사용하여 "Code"를 "code"로 맵에 기록
    output += `  "${scale.toLowerCase()}": (\n`;
    Object.keys(typoData[scale]).forEach(lang => {
      const props = typoData[scale][lang];
      const weights = Array.isArray(props.fontWeight.value)
        ? `(${props.fontWeight.value.join(', ')})`
        : `(${props.fontWeight.value})`;

      output += `    ${lang}: (\n`;
      output += `      font-size: ${props.fontSize.value},\n`;
      output += `      tablet-size: ${props.tabletSize.value},\n`;
      output += `      mobile-size: ${props.mobileSize.value},\n`;
      output += `      font-weight: ${weights},\n`;
      output += `      line-height: ${props.lineHeight.value},\n`;
      output += `      font-family: ${props.fontFamily.value},\n`;
      output += `    ),\n`;
    });
    output += `  ),\n`;
  });

  output += ');';
  return output;
};

/** 4. Typography Storybook TS 포맷 */
const typescriptTypographyMetaObjectFormat = ({ dictionary }) => {
  const typoData = dictionary.tokens.typography;
  const tokens = [];

  Object.keys(typoData).forEach(scale => {
    Object.keys(typoData[scale]).forEach(lang => {
      const props = typoData[scale][lang];
      const weightValue = props.fontWeight.value;

      // ✅ weights: 항상 배열로 변환 [600, 700]
      const weights = Array.isArray(weightValue) ? weightValue : [weightValue];

      tokens.push({
        id: `typo-${scale}-${lang}`,
        usage: `${scale.toUpperCase()} / ${lang.toUpperCase()}`,
        fontSize: props.fontSize.value,
        weights: weights, // ✅ 배열 그대로 전달
        lineHeight: props.lineHeight.value,
        fontFamily: props.fontFamily.value,
        description: props.description?.value || `${lang.toUpperCase()} 가이드`,
      });
    });
  });

  return `export const TypographyTokensData = ${JSON.stringify(tokens, null, 2)};`;
};

export default {
  source: ['tokens/**/*.json'],
  hooks: {
    formats: {
      'typescript/primitive-meta': typescriptPrimitiveMetaFormat,
      'scss/primitive-map': scssPrimitiveMapFormat,
      'scss/color-map': scssColorMapFormat,
      'typescript/color-meta': typescriptMetaObjectFormat,
      'scss/typography-map': scssTypographyMapFormat,
      'typescript/typography-meta': typescriptTypographyMetaObjectFormat,
      'scss/theme-color-map': scssThemeColorMapFormat,
      'typescript/theme-meta': typescriptThemeMetaObjectFormat,
    },
  },
  platforms: {
    /** 🎨 1. 컬러 시스템 (SCSS Map & TS Meta) */
    colorSystem: {
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_color-map.scss',
          format: 'scss/color-map',
          filter: t => t.filePath.includes('colors.json'),
        },
      ],
    },
    colorMeta: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'color-tokens.ts',
          format: 'typescript/color-meta',
          filter: t => t.filePath.includes('colors.json'),
        },
      ],
    },

    /** 🖋️ 2. 타이포그래피 시스템 (SCSS Map & TS Meta) */
    typographySystem: {
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_typography-map.scss',
          format: 'scss/typography-map',
          filter: t => t.filePath.includes('typography.json'),
        },
      ],
    },
    typographyMeta: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'typography-tokens.ts',
          format: 'typescript/typography-meta',
          filter: t => t.filePath.includes('typography.json'),
        },
      ],
    },

    /** 🎨 3. 테마 시스템 (Tech 전용 추가) */
    themeTech: {
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_theme-tech-map.scss',
          format: 'scss/theme-color-map',
          filter: t => t.filePath.includes('tech.json'),
        },
      ],
    },
    themeTechMeta: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'tech-tokens.ts',
          format: 'typescript/theme-meta',
          filter: t => t.filePath.includes('tech.json'),
        },
      ],
    },
    primitiveMeta: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'primitive-tokens.ts',
          format: 'typescript/primitive-meta',
          filter: t => t.filePath.includes('primitive-color.json'),
        },
      ],
    },
    primitiveSystem: {
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_primitive-map.scss',
          format: 'scss/primitive-map',
          filter: t => t.filePath.includes('primitive-color.json'),
        },
      ],
    },
  },
};
