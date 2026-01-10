import StyleDictionary from 'style-dictionary';

// 1. CSS 변수용 포맷 (동일)
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

// 2. TS 데이터용 포맷 (동일)
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

export default {
  // 1. 일단 모든 JSON 파일을 다 읽어옵니다.
  source: ['tokens/**/*.json'],
  hooks: {
    formats: {
      'css/themed-variables': themedVariablesFormat,
      'typescript/meta-object': typescriptMetaObjectFormat,
    },
  },
  platforms: {
    // 2. 공통 시스템 (colors.json의 데이터만 필터링)
    scss: {
      theme: 'root',
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_variables.scss',
          format: 'css/themed-variables',
          filter: token => token.filePath.includes('colors.json'), // 파일명 필터링
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
          filter: token => token.filePath.includes('colors.json'),
        },
      ],
    },

    // 3. TECH 테마 (tech.json의 데이터만 필터링)
    scssTech: {
      theme: 'tech',
      transformGroup: 'scss',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: '_theme-tech.scss',
          format: 'css/themed-variables',
          filter: token => token.filePath.includes('tech.json'),
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
          filter: token => token.filePath.includes('tech.json'),
        },
      ],
    },
  },
};
