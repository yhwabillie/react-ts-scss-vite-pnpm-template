import type { Meta, StoryObj } from '@storybook/react-vite';
import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'number', min: 1, max: 6 },
      description: '시맨틱 헤딩 수준을 결정합니다 (h1~h6).',
      table: { category: 'Accessibility' },
    },
    title: { control: 'text', description: '아코디언 헤더에 표시될 제목입니다.' },
    content: { control: 'text', description: '아코디언 패널 내부의 기본 텍스트 내용입니다.' },
    isNested: { table: { disable: true } }, // 내부 로직용이므로 숨김
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

/**
 * 💡 Base: 가장 기본적인 아코디언 형태입니다.
 * - 단일 항목의 개폐 동작과 aria-expanded 상태 변화를 테스트합니다.
 */
export const Base: Story = {
  args: {
    title: '아코디언 제목',
    content: '아코디언의 상세 내용이 여기에 표시됩니다.',
    level: 3,
  },
};

/**
 * 🌲 Nested: 재귀적 렌더링을 통한 다중 뎁스(2depth 이상) 구조를 테스트합니다.
 * - [가려짐 방지] 중첩된 아코디언이 열릴 때 부모의 높이가 유연하게 늘어나는지 확인합니다.
 * - 하위 수준으로 갈수록 HeadingTag(h3 -> h4)가 올바르게 변하는지 검증합니다.
 */
export const Nested: Story = {
  args: {
    title: '1뎁스 메뉴 (h3)',
    content: '첫 번째 수준의 콘텐츠입니다.',
    level: 3,
    items: [
      {
        title: '2뎁스 서브 메뉴 A (h4)',
        content: '두 번째 수준의 상세 내용입니다.',
      },
      {
        title: '2뎁스 서브 메뉴 B (h4)',
        content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
        items: [
          {
            title: '3뎁스 상세 메뉴 (h5)',
            content: '깊은 단계의 중첩도 지원합니다.',
          },
        ],
      },
    ],
  },
};

/**
 * 🛠 States: 다양한 시각적 상태를 시뮬레이션합니다.
 * - [중요] 아코디언 트리거 버튼에 title 속성을 넣지 마세요.
 * - 호버 시 나타나는 툴팁이 아코디언의 제목이나 개폐 아이콘을 가려버릴(Obscured) 수 있습니다.
 */
export const States: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>[Normal State]</p>
        <Accordion {...args} title='기본 상태' />
      </div>
      <div className='pseudo-hover'>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          [Hover State - Simulated]
        </p>
        <Accordion {...args} title='호버 상태 (스타일 확인용)' />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>[Long Content Test]</p>
        <Accordion
          {...args}
          title='매우 긴 제목의 아코디언일 경우 레이아웃이 깨지거나 아이콘을 가리지 않는지 확인합니다.'
          content='내용이 매우 길어질 경우에도 부모 요소의 높이가 정상적으로 계산되어야 합니다.'
        />
      </div>
    </div>
  ),
  args: {
    ...Base.args,
  },
};
