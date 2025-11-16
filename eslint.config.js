import jsPlugin from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import storybookPlugin from "eslint-plugin-storybook";
import prettierPlugin from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // 전역 무시
  globalIgnores(["dist", "node_modules"]),

  // 모든 JS/TS/JSX/TSX 파일 적용
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser, // TypeScript 파서 사용
      parserOptions: {
        ecmaVersion: "latest", // 최신 ECMAScript 문법 사용
        sourceType: "module", // ES 모듈 사용
        ecmaFeatures: {
          jsx: true, // JSX 문법 사용 가능 (tsParser로 TSX 지원)
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      react: reactPlugin, // React 플러그인
      "@typescript-eslint": tsPlugin, // TypeScript 플러그인
      storybook: storybookPlugin, // Storybook 플러그인
      prettier: prettierPlugin, // Prettier 플러그인
    },
    settings: {
      react: {
        version: "detect", // React 버전 자동 감지
      },
    },
    rules: {
      ...jsPlugin.configs.recommended.rules, // 기본 JS 권장 규칙 적용
      ...reactPlugin.configs.recommended.rules, // React 권장 규칙 적용
      ...tsPlugin.configs.recommended.rules, // TypeScript 권장 규칙 적용
      ...storybookPlugin.configs.recommended.rules, // Storybook 권장 규칙 적용
      ...prettierPlugin.rules, // Prettier와 충돌하는 규칙 비활성화

      // 커스텀 규칙
      "react/jsx-uses-react": "error", // JSX를 쓸 때 React가 필요함을 체크
      "react/jsx-uses-vars": "error", // JSX 내에서 사용된 변수를 체크
      "react/react-in-jsx-scope": "off", // React 17 이후에는 import React 안 해도 되니까 꺼줌
      "no-unused-vars": [
        // 쓰지 않는 변수 금지(단, _로 시작하면 "일부러 안 쓰는 변수"로 취급)
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": "off", // 콘솔 사용 허용
      "no-empty": ["error", { allowEmptyCatch: true }], // 빈 블록 금지, 단 빈 catch는 허용
      "no-empty-function": ["error", { allow: ["arrowFunctions"] }], // 빈 함수 금지, 단 arrow function(=>) 예외 허용
    },
  },
]);
