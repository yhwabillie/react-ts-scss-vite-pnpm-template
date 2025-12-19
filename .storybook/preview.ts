import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '@/styles/_index.scss';

// 1. MSW 초기화
initialize();

const preview: Preview = {
  // 2. 로더 추가 (v8+ 방식)
  loaders: [mswLoader],
  parameters: {
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
