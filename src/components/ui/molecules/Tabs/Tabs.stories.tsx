import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultIndex: {
      control: 'number',
      description: '초기 렌더링 시 활성화될 탭의 인덱스입니다.',
      table: { category: 'State' },
    },
    items: {
      description: '탭 제목과 콘텐츠를 담은 객체 배열입니다.',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

/**
 * 💡 Base: 기본적인 탭 동작을 확인합니다.
 * - 클릭 시 탭 전환 및 aria-selected 상태 변화를 테스트합니다.
 */
export const Base: Story = {
  args: {
    items: [
      { title: '메뉴 1', content: '첫 번째 탭의 콘텐츠입니다.' },
      { title: '메뉴 2', content: '두 번째 탭의 콘텐츠입니다.' },
      { title: '메뉴 3', content: '세 번째 탭의 콘텐츠입니다.' },
    ],
  },
};

/**
 * ↔️ Long Range (Scrollable): 탭 개수가 많아 스크롤이 발생하는 케이스입니다.
 * - [가려짐 방지] 양 끝의 화살표 버튼이 탭 제목을 가리지 않는지 확인합니다.
 * - 화살표 클릭 및 키보드 Arrow 키를 이용한 자동 스크롤을 테스트합니다.
 */
export const Scrollable: Story = {
  args: {
    items: Array.from({ length: 15 }, (_, i) => ({
      title: `카테고리 탭 ${i + 1}`,
      content: `${i + 1}번째 섹션의 상세 내용입니다.`,
    })),
  },
};

/**
 * 🛠 States: 인터랙션 상태를 시뮬레이션합니다.
 * - [중요] 탭 제목에 title 속성을 넣지 마세요.
 * - 호버 툴팁이 활성화 표시(Active Line)나 다음 탭 제목을 가려버릴(Obscured) 수 있습니다.
 */
export const States: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <p style={{ marginBottom: '12px', fontSize: '13px', color: '#888' }}>[Initial State]</p>
        <Tabs {...args} />
      </div>
      <div>
        <p style={{ marginBottom: '12px', fontSize: '13px', color: '#888' }}>[Default Index: 1]</p>
        <Tabs {...args} defaultIndex={1} />
      </div>
    </div>
  ),
  args: {
    ...Base.args,
  },
};
