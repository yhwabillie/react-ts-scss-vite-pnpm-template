import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

// 테스트용 임시 컴포넌트
const I18nTestComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '10px' }}>🌐 i18n 연동 테스트</h2>

      <p>
        <strong>현재 선택된 언어:</strong> {i18n.language}
      </p>

      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '15px' }}>
        <p>
          <strong>번역 결과 (key: "hello"):</strong>
        </p>
        <h1 style={{ color: '#007bff' }}>{t('hello')}</h1>
      </div>

      <ul style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <li>툴바의 지구본 아이콘을 눌러 언어를 변경해 보세요.</li>
        <li>언어 변경 시 위 텍스트가 실시간으로 변해야 합니다.</li>
      </ul>
    </div>
  );
};

const meta = {
  title: 'System/I18nTest',
  component: I18nTestComponent,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof I18nTestComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
