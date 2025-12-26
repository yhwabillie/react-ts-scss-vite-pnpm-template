import { useEffect } from 'react';
import { spyOn } from '@storybook/test';
import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '@/styles/_index.scss';
import i18n from '../src/i18n';

initialize({
  onUnhandledRequest: 'bypass',
});

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: '국제화 언어 설정',
    defaultValue: 'ko',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'ko', title: '한국어', right: '🇰🇷' },
        { value: 'en', title: 'English', right: '🇺🇸' },
        { value: 'ja', title: 'Japanese', right: '🇯🇵' },
      ],
    },
  },
  theme: {
    name: 'Theme',
    description: '컴포넌트 테마 설정',
    defaultValue: 'tech',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'tech', title: 'Tech', left: '🚀' },
        { value: 'warm', title: 'Warm', left: '🎨' },
      ],
    },
  },
  mode: {
    name: 'Mode',
    description: '화면 모드 설정',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
    },
  },
};

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    i18n,
    initialGlobals: {
      locale: 'ko',
      theme: 'tech',
      mode: 'light',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    docs: {
      codePanel: true,
    },
    options: {
      storySort: {
        order: [
          'UI',
          [
            'Atoms',
            [
              'Radio',
              'Checkbox',
              'Label',
              'Textarea',
              ['Solid', 'Outline'],
              'ValidationMsg',
              'Spinner',
              '*',
            ],
            'Molecules',
            [
              'Button',
              [
                'Solid',
                'Outline',
                'Ghost',
                'IconButton',
                ['Solid', 'Outline'],
                'LinkButton',
                'ButtonGroup',
              ],
              'Switch',
              'Input',
              ['Solid', 'Outline'],
              'FormField',
              'ControlGroup',
              'FormFieldset',
            ],
            'Organisms',
            '*',
          ],
          '*',
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale || 'ko';
      const theme = context.globals.theme || 'tech';
      const mode = context.globals.mode || 'light';

      useEffect(() => {
        // 1. i18n 언어 변경
        if (i18n.language !== locale) {
          i18n.changeLanguage(locale).catch(console.error);
        }

        const updateDOM = () => {
          const html = document.documentElement;

          // 2. 기본 속성 업데이트
          if (html.lang !== locale) html.lang = locale;

          const validThemes = ['tech', 'warm'];
          const nextTheme = validThemes.includes(theme) ? theme : 'tech';
          if (html.getAttribute('data-theme') !== nextTheme) {
            html.setAttribute('data-theme', nextTheme);
          }

          // 3. Mode 클래스 교체 (최적화 업데이트)
          const nextMode = `mode-${mode}`;
          if (!html.classList.contains(nextMode)) {
            html.classList.remove('mode-light', 'mode-dark'); // 명시적 제거로 성능 향상
            html.classList.add(nextMode);
          }

          // 4. 대상 영역 한정 (업데이트: .docs-story와 .sb-show-main만 타겟팅)
          const containers = document.querySelectorAll<HTMLElement>('.docs-story, .sb-show-main');

          containers.forEach(el => {
            // 인라인 스타일로 해당 영역의 배경과 글자색만 강제 (Docs 배경은 유지됨)
            el.style.setProperty('background-color', 'var(--color-surface-sunken)', 'important');
            el.style.setProperty('color', 'var(--color-text-primary)', 'important');
          });
        };

        const frameId = window.requestAnimationFrame(updateDOM);
        return () => window.cancelAnimationFrame(frameId);
      }, [locale, theme, mode]);

      return Story();
    },
  ],
};

export default preview;

export const beforeEach = function beforeEach() {
  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 'count', 'dir', 'assert'];
  methods.forEach(method => {
    // @ts-ignore
    spyOn(console, method).mockName(`console.${method}`);
  });
};
