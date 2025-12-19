// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.resolve(__dirname, '.storybook'),
    }),
  ],
  resolve: {
    alias: {
      // ✅ 프로젝트의 src 폴더를 '@'로 인식하게 만듭니다.
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
    // ✅ 아까 만든 setup 파일이 있는지 확인하세요!
    setupFiles: ['.storybook/vitest.setup.ts'],
  },
});
