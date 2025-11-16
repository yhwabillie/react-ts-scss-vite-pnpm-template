module.exports = {
  // 문장 끝에 세미콜론 찍기
  semi: true,

  // 문자열은 single quote
  singleQuote: true,

  // 객체/배열 마지막에도 쉼표 (깊은 diff 방지)
  trailingComma: "all",

  // 한 줄 최대 길이
  printWidth: 100,

  // 들여쓰기
  tabWidth: 2,

  // 화살표 함수 매개변수 1개면 괄호 생략
  arrowParens: "avoid",

  // JSX에서도 따옴표를 single로
  jsxSingleQuote: true,

  // JSX에서 속성이 줄바꿈되면 closing `>`도 줄바꿈
  bracketSameLine: false,

  // 객체 중괄호 안에 공백
  bracketSpacing: true,

  // Prettier + TSX에 가장 자연스러운 설정
  proseWrap: "preserve",

  // End of line 설정 (Windows 혼용 대비)
  endOfLine: "lf",
};
