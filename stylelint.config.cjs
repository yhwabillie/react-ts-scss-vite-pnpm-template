module.exports = {
  customSyntax: "postcss-scss",

  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier", // prettier와 충돌 방지
  ],

  plugins: ["stylelint-order", "stylelint-scss"],

  rules: {
    /* ===========================
      1. 한 줄에 하나의 선언
    ============================ */
    "declaration-block-single-line-max-declarations": 1,

    /* ===========================
      2. CSS 속성 순서 (너의 커스텀 그대로)
    ============================ */
    "order/properties-order": [
      [
        "all",
        "content",
        "position",
        "inset",
        "top",
        "right",
        "bottom",
        "left",
        "z-index",

        "flex",
        "flex-grow",
        "flex-shrink",
        "flex-basis",
        "display",
        "flex-direction",
        "flex-flow",
        "flex-wrap",
        "justify-content",
        "align-items",
        "align-content",
        "align-self",
        "order",
        "gap",
        "row-gap",
        "column-gap",

        "visibility",
        "float",
        "clear",
        "overflow",
        "overflow-x",
        "overflow-y",

        "grid",
        "grid-template",
        "grid-template-rows",
        "grid-template-columns",
        "grid-template-areas",
        "grid-auto-rows",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-row",
        "grid-row-start",
        "grid-row-end",
        "grid-column",
        "grid-column-start",
        "grid-column-end",
        "grid-area",
        "justify-items",
        "justify-self",
        "place-items",
        "place-self",

        "box-sizing",
        "width",
        "min-width",
        "max-width",
        "height",
        "min-height",
        "max-height",
        "margin",
        "padding",

        "border",
        "border-radius",
        "outline",
        "box-shadow",

        "background",
        "background-color",
        "background-image",
        "background-position",
        "background-size",
        "background-repeat",
        "background-origin",
        "background-clip",

        "color",
        "font",
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "letter-spacing",
        "text-align",
        "text-decoration",
        "text-overflow",
        "white-space",

        "transform",
        "transition",
        "animation",

        "cursor",
        "opacity",
        "pointer-events",
        "user-select",
        "will-change",
      ],
      { unspecified: "bottomAlphabetical" },
    ],

    /* ===========================
      3. 프로젝트 특성상 꺼두는 규칙들
    ============================ */

    "selector-no-vendor-prefix": null,
    "property-no-vendor-prefix": null,
    "value-no-vendor-prefix": null,
    "media-feature-name-no-vendor-prefix": null,
    "at-rule-no-vendor-prefix": null,

    // JSX에서 종종 발생하는 false-positive 방지
    "no-descending-specificity": null,
    "selector-type-no-unknown": null,

    /* ===========================
      4. SCSS 관련 규칙
    ============================ */

    // 믹스인/함수 네이밍
    "scss/at-mixin-pattern": ["^[a-z0-9_-]+$"],
    "scss/at-function-pattern": ["^[a-z0-9_-]+$"],

    // 불필요한 중첩 방지
    "scss/no-duplicate-mixins": true,
    "block-no-redundant-nested-style-rules": true,

    // 연산자 주변 공백
    "scss/operator-no-unspaced": true,

    // @use / @import 시 언더스코어 생략
    "scss/load-no-partial-leading-underscore": true,

    /* ===========================
      5. 클래스/변수 네이밍
    ============================ */
    "selector-class-pattern": [
      "^[a-z0-9-]+$",
      {
        message: "⚠️ 클래스명은 kebab-case만 사용하세요.",
      },
    ],

    "custom-property-pattern": [
      "^[a-z0-9-]+$",
      {
        message: "⚠️ CSS 변수(--*)는 kebab-case만 사용하세요.",
      },
    ],

    /* ===========================
      6. 기타 안정적인 규칙 유지
    ============================ */
    "block-no-empty": true,
    "declaration-no-important": true,
    "font-family-no-duplicate-names": true,
    "keyframes-name-pattern": "^[a-z0-9-]+$",

    /* ===========================
      7. WebKit 마스크 속성 허용
    ============================ */
    "property-no-unknown": [
      true,
      {
        ignoreProperties: [
          "-webkit-mask",
          "-webkit-mask-image",
          "-webkit-mask-position",
          "-webkit-mask-size",
          "-webkit-mask-repeat",
        ],
      },
    ],
  },
};
