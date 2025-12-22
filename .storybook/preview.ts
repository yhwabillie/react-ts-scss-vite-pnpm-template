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
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale || 'ko';
      const theme = context.globals.theme || 'tech';
      const mode = context.globals.mode || 'light';

      useEffect(() => {
        if (i18n.language !== locale) {
          i18n.changeLanguage(locale).catch(console.error);
        }

        const updateDOM = () => {
          const html = document.documentElement;

          if (html.lang !== locale) {
            html.lang = locale;
          }

          const validThemes = ['tech', 'warm'];
          const nextTheme = validThemes.includes(theme) ? theme : 'tech';

          if (html.getAttribute('data-theme') !== nextTheme) {
            html.setAttribute('data-theme', nextTheme);
          }

          const nextMode = `mode-${mode}`;
          html.classList.forEach(className => {
            if (className.startsWith('mode-')) html.classList.remove(className);
          });
          html.classList.add(nextMode);

          // [UPDATE] .docs-story 및 canvas 배경색 제어
          // Docs 모드와 Canvas 모드 모두를 대응하기 위해 여러 선택자를 활용합니다.
          const selectors =
            mode === 'dark' ? '.docs-story, .sb-show-main' : '.docs-story, .sb-show-main';

          const containers = document.querySelectorAll<HTMLElement>('.docs-story, .sb-show-main');

          containers.forEach(el => {
            if (mode === 'dark') {
              el.style.setProperty('background-color', '#121212', 'important');
              el.style.setProperty('color', '#ffffff', 'important');
            } else {
              el.style.setProperty('background-color', '#ffffff', 'important');
              el.style.setProperty('color', '#000000', 'important');
            }
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
