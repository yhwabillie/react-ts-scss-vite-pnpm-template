import { spyOn } from 'storybook/test';
import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '@/styles/_index.scss';
import i18n from '../src/i18n';

// 1. MSW 초기화 설정 변경
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
};

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    i18n,
    initialGlobals: {
      locale: 'en',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      codePanel: true,
    },
  },
  decorators: [
    (Story, context) => {
      // 1. 현재 선택된 locale 값
      const { locale } = context.globals;

      // 2. 순수 자바스크립트로 <html> 태그의 lang 속성을 즉시 변경
      // 스토리북 미리보기(Canvas)의 <html> 요소에 접근
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale || 'ko';
      }

      return Story();
    },
    withThemeByClassName({
      themes: {
        'Sky Light': 'theme-sky mode-light',
        'Sky Dark': 'theme-sky mode-dark',
        'Yellow Light': 'theme-yellow mode-light',
        'Yellow Dark': 'theme-yellow mode-dark',
      },
      defaultTheme: 'Sky Light',
    }),
  ],
};

export default preview;

export const beforeEach = function beforeEach() {
  spyOn(console, 'log').mockName('console.log');
  spyOn(console, 'warn').mockName('console.warn');
  spyOn(console, 'error').mockName('console.error');
  spyOn(console, 'info').mockName('console.info');
  spyOn(console, 'debug').mockName('console.debug');
  spyOn(console, 'trace').mockName('console.trace');
  spyOn(console, 'count').mockName('console.count');
  spyOn(console, 'dir').mockName('console.dir');
  spyOn(console, 'assert').mockName('console.assert');
};
