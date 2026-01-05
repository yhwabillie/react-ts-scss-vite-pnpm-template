import type { Meta, StoryObj } from '@storybook/react-vite';
import Accordion from './Accordion';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    // --- Style 카테고리 ---
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '아코디언의 테마 색상을 설정합니다.',
      table: {
        category: 'Style',
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '아코디언의 크기를 결정합니다.',
      table: {
        category: 'Style',
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },

    // --- Content 카테고리 ---
    title: {
      control: 'text',
      description:
        '헤더 제목. HTML `title` 속성이 아니므로 접근성 이슈(partially obscured)로부터 안전합니다.',
      table: {
        category: 'Content',
        type: { summary: 'string', detail: '텍스트 노드로 렌더링됨' },
      },
    },
    content: {
      control: 'text',
      description: '패널 내부의 본문 내용입니다.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    items: {
      control: 'object',
      description: '하위 아코디언 아이템 배열 (재귀적 구조).',
      table: {
        category: 'Content',
        type: {
          summary: 'AccordionProps[]',
          detail: 'Array<{ title: string, content: string, items?: ... }>',
        },
      },
    },

    // --- Logic / State 카테고리 ---
    defaultOpen: {
      control: 'boolean',
      description: '초기 렌더링 시 아코디언의 펼침 상태를 결정합니다.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // --- Accessibility 카테고리 ---
    level: {
      control: { type: 'number', min: 1, max: 6 },
      description: '시맨틱 헤딩 수준 (h1 ~ h6). 중첩 시 자동으로 1씩 증가합니다.',
      table: {
        category: 'Accessibility',
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },

    // --- Internal (사용자에게 노출하지 않음) ---
    isNested: {
      control: false, // 컨트롤 비활성화
      table: {
        category: 'Internal',
        disable: true,
      },
    },
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
    defaultOpen: true,
  },
};

export const Multiple: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Accordion {...args} title='첫 번째 아코디언' defaultOpen={true} />
      <Accordion {...args} title='두 번째 아코디언' />
      <Accordion {...args} title='세 번째 아코디언' />
    </div>
  ),
  args: {
    content: '모두 펼쳐진 상태를 확인하기 위한 상세 내용입니다.',
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
    defaultOpen: true,
    items: [
      {
        title: '2뎁스 서브 메뉴 A (h4)',
        content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
        defaultOpen: true,
        items: [
          {
            title: '3뎁스 서브 메뉴 A (h5)',
            content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
            defaultOpen: true,
          },
          {
            title: '3뎁스 서브 메뉴 A (h5)',
            content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
            defaultOpen: true,
          },
        ],
      },
      {
        title: '2뎁스 서브 메뉴 B (h4)',
        content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
        defaultOpen: true,
        items: [
          {
            title: '3뎁스 서브 메뉴 B (h5)',
            content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
          },
          {
            title: '3뎁스 서브 메뉴 B (h5)',
            content: '중첩된 구조에서도 레이아웃이 깨지지 않는지 확인하세요.',
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
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell style={{ width: '100%' }}>
          <Accordion {...args} title='기본 상태' />
        </GuideCell>
      </GuideGroup>
      <GuideGroup direction='column'>
        <GuideCell style={{ width: '100%' }}>
          <Accordion {...args} title='호버 상태 (스타일 확인용)' />
        </GuideCell>
      </GuideGroup>
      <GuideGroup direction='column'>
        <GuideCell style={{ width: '100%' }}>
          <Accordion
            {...args}
            title='매우 긴 제목의 아코디언일 경우 레이아웃이 깨지거나 아이콘을 가리지 않는지 확인합니다. 매우 긴 제목의 아코디언일 경우 레이아웃이 깨지거나 아이콘을 가리지 않는지 확인합니다. 매우 긴 제목의 아코디언일 경우 레이아웃이 깨지거나 아이콘을 가리지 않는지 확인합니다.'
            content='내용이 매우 길어질 경우에도 부모 요소의 높이가 정상적으로 계산되어야 합니다.'
          />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
    // <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    //   <div>
    //     <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>[Normal State]</p>
    //     <Accordion {...args} title='기본 상태' />
    //   </div>
    //   <div className='pseudo-hover'>
    //     <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
    //       [Hover State - Simulated]
    //     </p>
    //     <Accordion {...args} title='호버 상태 (스타일 확인용)' />
    //   </div>
    //   <div>
    //     <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>[Long Content Test]</p>
    // <Accordion
    //   {...args}
    //   title='매우 긴 제목의 아코디언일 경우 레이아웃이 깨지거나 아이콘을 가리지 않는지 확인합니다.'
    //   content='내용이 매우 길어질 경우에도 부모 요소의 높이가 정상적으로 계산되어야 합니다.'
    // />
    //   </div>
    // </div>
  ),
  args: {
    ...Base.args,
  },
};
