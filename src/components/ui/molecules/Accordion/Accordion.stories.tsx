import type { Meta, StoryObj } from '@storybook/react-vite';
import Accordion from './Accordion';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Accordion**은 수직으로 쌓인 헤더 리스트를 통해 콘텐츠 영역을 접고 펼치며 정보를 효율적으로 구성합니다. <br /><br />' +
          '• 재귀적 구조를 지원하여 1뎁스부터 n뎁스까지 깊이 있는 정보 구조를 시각적 위계와 함께 표현할 수 있습니다. <br />' +
          '• level 속성을 통해 `h1~h6` 태그를 적절히 배분하여 검색 엔진 최적화(SEO)와 스크린 리더 사용자의 탐색 편의성을 높였습니다. <br />' +
          '• 브라우저 기본 툴팁이 주변 요소를 가리는 문제를 방지하기 위해 `title` 속성 사용을 지양하고, 충분한 레이아웃 공간과 줄바꿈 로직을 사용합니다.',
      },
    },
  },
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
 * 아코디언의 가장 기본적인 단일 형태입니다.
 * - **Checklist**: 배경색과 경계선의 대비, 초기 열림 상태(`defaultOpen`)에서의 레이아웃 안정성을 확인합니다.
 */
export const Base: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell>
          <Accordion {...args} size='md' title='Medium 사이즈 아코디언' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    title: '아코디언 제목',
    content:
      '아코디언의 상세 내용이 여기에 표시됩니다. 대지가 흰색일 때 컴포넌트의 배경과 경계선 대비가 웹 접근성 기준을 충족하는지 확인하세요.',
    level: 3,
    defaultOpen: true,
  },
};

/**
 * 다양한 화면 너비(sm: 360px, md: 768px, lg: 1024px) 환경에서의 대응력을 검증합니다.
 * - **Ergonomics**: 작은 사이즈(`sm`)에서도 최소 터치 영역(44px)을 준수하여 조작 편의성을 확보하는지 확인합니다.
 * - **Scaling**: 크기 변화에 따라 텍스트와 아이콘의 비율이 조화롭게 유지되는지 검수합니다.
 */
export const Sizes: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='Small (sm)' style={{ width: '100%' }}>
          <Accordion {...args} size='sm' title='Small Size Accordion' />
        </GuideCell>
        <GuideCell caption='Medium (md)' style={{ width: '100%' }}>
          <Accordion {...args} size='md' title='Medium Size Accordion (Default)' />
        </GuideCell>
        <GuideCell caption='Large (lg)' style={{ width: '100%' }}>
          <Accordion {...args} size='lg' title='Large Size Accordion' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    content: '사이즈별 내부 여백과 텍스트 크기 변화를 확인하세요.',
    level: 3,
    defaultOpen: true,
    color: 'primary',
  },
};

/**
 * 브랜드 테마별(Primary, Secondary, Tertiary) 시각적 스타일을 확인합니다.
 * - **Contrast Check**: 모든 테마 색상에서 텍스트와의 명도 대비(WCAG AA 4.5:1 이상)가 유지되는지 점검합니다.
 * - 특히 고채도의 Tertiary 배경에서 가독성을 중점적으로 확인하세요.
 */
export const Colors: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='Primary' style={{ width: '100%' }}>
          <Accordion {...args} color='primary' title='Primary 아코디언' />
        </GuideCell>
        <GuideCell caption='Secondary' style={{ width: '100%' }}>
          <Accordion {...args} color='secondary' title='Secondary 아코디언' />
        </GuideCell>
        <GuideCell caption='Tertiary' style={{ width: '100%' }}>
          <Accordion {...args} color='tertiary' title='Tertiary 아코디언' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    content:
      '각 테마 색상에 따른 스타일 변화를 확인하세요. 대지가 흰색일 때 컴포넌트의 배경과 경계선 대비가 웹 접근성 기준(3:1 이상)을 충족하는지 점검하기 좋습니다.',
    level: 3,
    defaultOpen: true,
  },
};

/**
 * 여러 개의 아코디언이 나열된 리스트 형태를 점검합니다.
 * - **Spacing**: 아코디언 간의 간격(`gap: 10px`)이 개별 요소를 구분하기에 충분한지 확인합니다.
 * - **Focus Order**: 키보드 탭 이동 시 포커스 링이 인접한 다른 아코디언 요소에 의해 잘리거나 가려지지 않는지 체크합니다.
 */
export const Multiple: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='Multiple Accordions (768px)' style={{ width: '768px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Accordion {...args} title='첫 번째 아코디언' defaultOpen={true} />
            <Accordion {...args} title='두 번째 아코디언' />
            <Accordion {...args} title='세 번째 아코디언' />
          </div>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    content:
      '여러 아코디언이 나열되었을 때의 간격과 열림/닫힘 상태를 확인하세요. 각 아코디언 간의 여백이 시각적으로 명확한지 점검하기 좋습니다.',
    level: 3,
  },
};

/**
 * 다계층(1뎁스~3뎁스) 구조에서의 시각적 위계를 확인합니다.
 * - **Visual Hierarchy**: 깊이가 깊어짐에 따라 발생하는 배경색 변화와 들여쓰기(Padding)가 정보의 종속 관계를 명확히 나타내는지 검증합니다.
 * - **Auto Heading**: 중첩 시 헤딩 레벨(`h3` -> `h4` -> `h5`)이 시맨틱하게 자동 증가하는지 확인합니다.
 */
export const Nested: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        <GuideCell caption='Nested Accordion Hierarchy'>
          <Accordion {...args} />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    size: 'md',
    title: '1뎁스 메뉴 (h3)',
    content: '첫 번째 수준의 콘텐츠입니다. 최상위는 키 컬러(#0052cc)가 적용됩니다.',
    level: 3,
    defaultOpen: true,
    items: [
      {
        size: 'md',
        title: '2뎁스 서브 메뉴 A (h4)',
        content: '여기서부터는 추천드린 진한 회색(#dee2e6) 헤더가 적용됩니다.',
        defaultOpen: true,
        items: [
          {
            size: 'md',
            title: '3뎁스 서브 메뉴 A (h5)',
            content: '중첩이 깊어져도 텍스트가 아이콘을 가리지 않는지 확인하세요.',
            defaultOpen: true,
          },
          {
            size: 'md',
            title: '3뎁스 서브 메뉴 B (h5)',
            content: '텍스트가 길어질 경우 줄바꿈이 정상적으로 일어나는지 점검합니다.',
            defaultOpen: false,
          },
        ],
      },
      {
        size: 'md',
        title: '2뎁스 서브 메뉴 B (h4)',
        content: '계층 간의 들여쓰기와 경계선이 명확한지 확인하세요.',
        defaultOpen: false,
      },
    ],
  },
};

/**
 * 사용자 인터랙션(Hover, Active, Focus)에 따른 시각적 피드백을 검증합니다.
 * - **Feedback**: 마우스 오버 시의 톤업(Tone-up) 효과나 키보드 포커스 시의 Outline이 명확하게 노출되는지 확인합니다.
 */
export const States: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        {/* Hover 상태 확인 */}
        <GuideCell caption='Hover State' style={{ width: '100%' }}>
          <div className='pseudo-hover-wrapper'>
            <Accordion {...args} title='마우스 호버 상태 (Hover)' />
          </div>
        </GuideCell>

        {/* Active / Focus 상태 확인 */}
        <GuideCell caption='Active / Focus State' style={{ width: '100%' }}>
          <div className='pseudo-active-wrapper'>
            <Accordion {...args} title='클릭 또는 포커스 상태 (Active)' />
          </div>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  parameters: {
    pseudo: {
      hover: '.pseudo-hover-wrapper button',
      active: '.pseudo-active-wrapper button',
      focusVisible: '.pseudo-active-wrapper button', // 키보드 접근성 확인용
    },
  },
  args: {
    ...Base.args,
    defaultOpen: false, // 상태 확인을 위해 닫힌 상태를 기본으로 설정
  },
};

/**
 * 제목이나 본문이 매우 길어질 때의 대응력을 확인하는 스트레스 테스트입니다.
 * - **A11y Warning**: 저장하신 지침에 따라, 텍스트 가림 현상을 방지하기 위해 `title` 속성(Native Tooltip)을 사용하는 대신 자연스러운 줄바꿈과 유연한 높이 조절을 권장합니다.
 * - **Icon Safety**: 텍스트가 여러 줄이 되어도 우측의 열림/닫힘 아이콘과 겹치지 않는지 점검합니다.
 */
export const LongText: Story = {
  render: args => (
    <GuideWrapper>
      <GuideGroup direction='column'>
        {/* 케이스 1: 단일 구조에서 매우 긴 제목 */}
        <GuideCell caption='Single - Long Title' style={{ width: '100%' }}>
          <Accordion
            {...args}
            title='[단일] 이 제목은 매우 길게 작성되어 줄바꿈이 어떻게 일어나는지 확인합니다. 제목이 길어져도 우측의 아이콘과 겹치지 않고 레이아웃을 유지해야 하며, 텍스트가 잘릴 때 툴팁을 띄우기 위해 title 속성을 사용해서는 안 됩니다.'
          />
        </GuideCell>

        {/* 케이스 2: 중첩 구조에서 모든 단계의 텍스트가 긴 경우 */}
        <GuideCell caption='Nested - All Levels Long Text' style={{ width: '100%' }}>
          <Accordion
            {...args}
            title='[1뎁스] 상위 메뉴의 제목이 매우 길어서 여러 줄로 표시되는 경우입니다. 하위 메뉴들과의 구분감을 유지하는지 확인하세요.'
            level={3}
            defaultOpen={true}
            items={[
              {
                ...args,
                title:
                  '[2뎁스] 중첩된 메뉴에서 제목이 길어지면 왼쪽 여백 때문에 텍스트 가용 폭이 줄어듭니다. 이때도 가독성이 확보되는지 점검합니다.',
                level: 4,
                defaultOpen: true,
                items: [
                  {
                    ...args,
                    title:
                      '[3뎁스] 가장 깊은 단계입니다. 좁은 폭에서도 텍스트가 아이콘을 침범하지 않고 정상적으로 줄바꿈되어야 하며, 배경색(#dee2e6)과 텍스트(#212529)의 대비가 명확해야 합니다.',
                    content:
                      '내용 영역 또한 길어질 수 있으며, 부모 요소들의 높이가 유연하게 반응하여 전체 레이아웃이 깨지지 않는지 확인하는 케이스입니다.',
                    level: 5,
                    defaultOpen: true,
                  },
                ],
              },
            ]}
          />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
  args: {
    ...Base.args,
    size: 'md',
    color: 'primary',
  },
};
