/** 1. CSS 변수용 포맷 (기존 유지) */
const themedVariablesFormat = ({ dictionary, platform }) => {
  const { allTokens } = dictionary;
  const theme = platform.theme || 'root';

  const lightVars = allTokens
    .filter(t => t.path.includes('light'))
    .map(t => `  --${t.path.filter(p => p !== 'light').join('-')}: ${t.value};`)
    .join('\n');

  const darkVars = allTokens
    .filter(t => t.path.includes('dark'))
    .map(t => `    --${t.path.filter(p => p !== 'dark').join('-')}: ${t.value};`)
    .join('\n');

  if (theme === 'root') {
    return `:root {\n${lightVars}\n}\n\n.mode-dark {\n${darkVars}\n}`;
  }
  return `[data-theme='${theme}'] {\n${lightVars}\n\n  &.mode-dark {\n${darkVars}\n  }\n}`;
};

/** 2. Color 전용 TS 데이터 포맷 (기존 유지) */
const typescriptMetaObjectFormat = ({ dictionary }) => {
  const tokens = dictionary.allTokens.reduce((acc, token) => {
    if (token.path.includes('light')) {
      const key = token.path.filter(p => p !== 'light').join('-');
      const darkToken = dictionary.allTokens.find(
        t => t.path.join('-') === token.path.join('-').replace('light', 'dark'),
      );

      acc.push({
        id: `--${key}`,
        lightValue: token.value,
        darkValue: darkToken ? darkToken.value : token.value,
        usage: token.usage || '',
        description: token.comment || '',
      });
    }
    return acc;
  }, []);

  return `export const TokenData = ${JSON.stringify(tokens, null, 2)};`;
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
      'css/themed-variables': themedVariablesFormat,
      'typescript/meta-object': typescriptMetaObjectFormat,
      'scss/typography-map': scssTypographyMapFormat,
      'typescript/typography-meta': typescriptTypographyMetaObjectFormat,
    },
  },
  platforms: {
    /** 1. 공통 컬러 시스템 */
    scss: {
      theme: 'root',
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_variables.scss',
          format: 'css/themed-variables',
          filter: t => t.filePath.includes('colors.json'),
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/meta-object',
          filter: t => t.filePath.includes('colors.json'),
        },
      ],
    },

    /** 2. TECH 테마 컬러 */
    scssTech: {
      theme: 'tech',
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_theme-tech.scss',
          format: 'css/themed-variables',
          filter: t => t.filePath.includes('tech.json'),
        },
      ],
    },
    tsTech: {
      transformGroup: 'js',
      buildPath: 'src/constants/generated/',
      files: [
        {
          destination: 'tech-tokens.ts',
          format: 'typescript/meta-object',
          filter: t => t.filePath.includes('tech.json'),
        },
      ],
    },

    /** 3. 타이포그래피 시스템 */
    scssTypography: {
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
    tsTypography: {
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
  },
};
