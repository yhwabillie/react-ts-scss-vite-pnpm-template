import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from './Tooltip';
import Button from '../../molecules/Button/Button';
import IconButton from '../../molecules/IconButton/IconButton';
import Icon from '../Icon/Icon';
import { within, userEvent } from 'storybook/test';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    // --- [Data & Content] ---
    id: {
      name: 'ID',
      description: '접근성 연결을 위한 고유 식별자 (미지정 시 자동 생성)',
      control: false,
      table: { category: 'Data' },
    },
    content: {
      name: 'Content',
      description: '툴팁 내부에 표시할 내용',
      control: 'text',
      table: { category: 'Data' },
    },
    children: {
      name: 'Trigger Element',
      description: '툴팁을 활성화할 트리거 요소 (Button, Icon 등)',
      control: false,
      table: { category: 'Data' },
    },

    // --- [Appearance] ---
    variant: {
      name: 'Variant',
      description: '툴팁 구성 방식',
      options: ['standard', 'rich'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'standard' },
      },
    },
    shape: {
      name: 'Shape',
      description: '꼬리 포함 여부',
      options: ['balloon', 'plain'],
      control: { type: 'inline-radio' }, // select보다 빠른 조작 가능
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'balloon' },
      },
    },
    size: {
      name: 'Size',
      description: '크기 규격',
      options: ['sm', 'md'],
      control: { type: 'radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },

    // --- [Layout & Positioning] ---
    preferredPosition: {
      name: 'Preferred Position',
      description: '우선적으로 배치될 방향 (공간 부족 시 Flip 로직 작동)',
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'select' },
      table: {
        category: 'Layout',
        defaultValue: { summary: 'top' },
      },
    },
    align: {
      // ✅ 누락된 align 추가
      name: 'Alignment',
      description: '상하(top/bottom) 배치 시의 수평 정렬 기준',
      options: ['start', 'center', 'end'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Layout',
        defaultValue: { summary: 'center' },
      },
    },
    className: {
      name: 'Custom Class',
      description: '외부 스타일 주입용 클래스명',
      control: 'text',
      table: { category: 'Layout' },
    },
  },
  args: {
    variant: 'standard',
    shape: 'plain',
    size: 'sm',
    content: '도움말 내용입니다.',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * [Base]
 * 툴팁의 가장 기본적인 사용 사례입니다.
 * IconButton과 같은 작은 트리거 요소에 짧은 텍스트 도움말을 제공할 때 적합합니다.
 */
export const Base: Story = {
  render: () => {
    return (
      <GuideWrapper
        style={{ flexDirection: 'row', gap: '10px', margin: 'auto', width: 'fit-content' }}
      >
        <Tooltip content='도움말' shape='plain' size='sm'>
          <IconButton
            aria-label='도움말'
            color='primary'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='search' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
        <Tooltip content='알림' shape='plain' size='sm'>
          <IconButton
            aria-label='알림'
            color='secondary'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
        <Tooltip content='더보기' shape='plain' size='sm'>
          <IconButton
            aria-label='더보기'
            color='tertiary'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='ellipsis' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
      </GuideWrapper>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 버튼 역할을 하는 요소들 중 첫 번째 요소를 찾습니다.
    const buttons = canvas.getAllByRole('button');
    if (buttons[0]) {
      await userEvent.hover(buttons[0]);
    }
  },
};

/**
 * [Shape]
 * 툴팁의 외형(꼬리 유무)을 결정합니다.
 * - balloon: 말풍선 꼬리가 있어 트리거 요소를 명확히 지시합니다.
 * - plain: 꼬리가 없는 단순 사각형 형태로, 시각적 노이즈를 줄일 때 사용합니다.
 */
export const Shape: Story = {
  render: () => {
    return (
      <GuideWrapper
        style={{ flexDirection: 'row', gap: '60px', margin: 'auto', width: 'fit-content' }}
      >
        <GuideCell caption='balloon'>
          <Tooltip content='말풍선 꼬리 형태' shape='balloon' size='sm'>
            <IconButton
              aria-label='도움말'
              color='primary'
              size='md'
              variant='outline'
              shape='pill'
              icon={<Icon name='search' className='icon' strokeWidth={2.5} />}
            />
          </Tooltip>
        </GuideCell>
        <GuideCell caption='plain'>
          <Tooltip content='단순 사각형 형태' shape='plain' size='sm'>
            <IconButton
              aria-label='알림'
              color='secondary'
              size='md'
              variant='outline'
              shape='pill'
              icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
            />
          </Tooltip>
        </GuideCell>
      </GuideWrapper>
    );
  },
  // 큐레이션을 위해 두 툴팁을 모두 보여주고 싶다면 play 함수에서 루프를 돌립니다.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    // 모든 버튼에 hover를 순차적으로 적용하여 툴팁들을 활성화 (구현 방식에 따라 하나만 남을 수 있음)
    for (const button of buttons) {
      await userEvent.hover(button);
    }
  },
};

/**
 * [Variants]
 * 툴팁의 구성 방식에 따른 차이를 보여줍니다.
 * - standard: 단순 텍스트 정보 전달용 (Hover/Focus 시 발생)
 * - rich: 상세 설명 및 닫기 버튼 등 인터랙션이 포함된 경우 (Click 시 발생)
 */
export const Variants: Story = {
  render: () => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideGroup title='Standard' direction='column'>
          <Tooltip
            variant='standard'
            shape='balloon'
            size='sm'
            content='짧은 툴팁 내용에 사용합니다.'
          >
            <Button color='primary' size='sm'>
              Standard 툴팁
            </Button>
          </Tooltip>
        </GuideGroup>
        <GuideGroup title='Rich' direction='column'>
          <Tooltip
            variant='rich'
            shape='balloon'
            size='sm'
            content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
          >
            <Button color='secondary' size='sm'>
              Rich 툴팁
            </Button>
          </Tooltip>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * [Sizes]
 * 콘텐츠의 양과 중요도에 따라 sm(260px), md(320px) 사이즈를 선택할 수 있습니다.
 */
export const Sizes: Story = {
  render: () => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '50px' }}>
        <GuideGroup title='SM' direction='column'>
          <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto', width: '100%' }}>
            <Tooltip size='sm' shape='plain' content='Standard Plain 툴팁'>
              <Button type='button' variant='solid' size='sm'>
                Standard Plain 툴팁
              </Button>
            </Tooltip>
            <Tooltip size='sm' shape='balloon' content='Standard Balloon 툴팁'>
              <Button type='button' variant='outline' color='secondary' size='sm'>
                Standard Balloon 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              size='sm'
              variant='rich'
              shape='balloon'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button type='button' variant='solid' color='tertiary' size='sm'>
                Rich Plain 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              size='sm'
              variant='rich'
              shape='balloon'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button type='button' variant='outline' color='tertiary' size='sm'>
                Rich Balloon 툴팁
              </Button>
            </Tooltip>
          </div>
        </GuideGroup>
        <GuideGroup title='MD' direction='column'>
          <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto', width: '100%' }}>
            <Tooltip size='md' shape='plain' content='Standard Plain 툴팁'>
              <Button type='button' variant='solid' size='md'>
                Standard Plain 툴팁
              </Button>
            </Tooltip>
            <Tooltip size='md' shape='balloon' content='Standard Balloon 툴팁'>
              <Button type='button' variant='outline' color='secondary' size='md'>
                Standard Balloon 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              size='md'
              variant='rich'
              shape='balloon'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button type='button' variant='solid' color='tertiary' size='md'>
                Rich Plain 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              size='md'
              variant='rich'
              shape='balloon'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button type='button' variant='outline' color='tertiary' size='md'>
                Rich Balloon 툴팁
              </Button>
            </Tooltip>
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * [Positions]
 * preferredPosition 속성을 통해 툴팁이 나타날 상하좌우 우선순위를 테스트합니다.
 * 공간이 부족할 경우 Flip 로직에 의해 반대 방향으로 자동 전환됩니다.
 */
export const Positions: Story = {
  args: {
    shape: 'balloon',
    size: 'md',
  },
  render: args => (
    <div
      style={{
        width: 'fit-content',
        margin: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '100px',
      }}
    >
      <GuideGroup title='Position: Top'>
        <GuideCell>
          <Tooltip {...args} preferredPosition='top' content='Top Tooltip'>
            <Button size='sm'>Standard 툴팁</Button>
          </Tooltip>
          <Tooltip
            {...args}
            preferredPosition='top'
            variant='rich'
            size='sm'
            shape='balloon'
            content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
          >
            <Button size='sm' variant='outline'>
              Rich 툴팁
            </Button>
          </Tooltip>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Position: Bottom'>
        <GuideCell>
          <Tooltip {...args} preferredPosition='bottom' content='Bottom Tooltip'>
            <Button size='sm'>Standard 툴팁</Button>
          </Tooltip>
          <Tooltip
            {...args}
            preferredPosition='bottom'
            variant='rich'
            size='sm'
            shape='balloon'
            content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
          >
            <Button size='sm' variant='outline'>
              Rich 툴팁
            </Button>
          </Tooltip>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Position: Left'>
        <GuideCell>
          <Tooltip {...args} preferredPosition='left' content='Left Tooltip'>
            <Button size='sm'>Standard 툴팁</Button>
          </Tooltip>
          <Tooltip
            {...args}
            preferredPosition='left'
            variant='rich'
            size='sm'
            shape='balloon'
            content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
          >
            <Button size='sm' variant='outline'>
              Rich 툴팁
            </Button>
          </Tooltip>
        </GuideCell>
      </GuideGroup>

      <GuideGroup title='Position: Right'>
        <GuideCell>
          <Tooltip {...args} preferredPosition='right' content='Right Tooltip'>
            <Button size='sm'>Standard 툴팁</Button>
          </Tooltip>
          <Tooltip
            {...args}
            preferredPosition='right'
            variant='rich'
            size='sm'
            shape='balloon'
            content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
          >
            <Button size='sm' variant='outline'>
              Rich 툴팁
            </Button>
          </Tooltip>
        </GuideCell>
      </GuideGroup>
    </div>
  ),
};

/**
 * [Alignment]
 * 상하(Top/Bottom) 배치 시 툴팁 본체의 수평 정렬을 테스트합니다.
 * 본체가 정렬(start/center/end)에 따라 움직여도 꼬리는 항상 트리거 중앙을 유지하는지 검증합니다.
 */
export const Alignment: Story = {
  args: {
    size: 'md',
  },
  render: args => {
    const alignments: ('start' | 'center' | 'end')[] = ['start', 'center', 'end'];

    return (
      <div
        style={{
          width: 'fit-content',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '100px',
        }}
      >
        {alignments.map(align => (
          <GuideCell key={`top-${align}`} caption={`align: ${align}`}>
            <Tooltip
              {...args}
              preferredPosition='top'
              align={align}
              content={`${align} 정렬된 툴팁입니다.`}
              shape='balloon'
            >
              <Button variant='solid' color='primary' size='sm' style={{ width: 'max-content' }}>
                Standard 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='top'
              align={align}
              shape='balloon'
              variant='rich'
              size='sm'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button variant='outline' color='primary' size='sm' style={{ width: 'max-content' }}>
                Rich 툴팁
              </Button>
            </Tooltip>
          </GuideCell>
        ))}

        {alignments.map(align => (
          <GuideCell key={`bottom-${align}`} caption={`align: ${align}`}>
            <Tooltip
              {...args}
              preferredPosition='bottom'
              align={align}
              content={`${align} 정렬된 하단 툴팁`}
              shape='balloon'
            >
              <Button variant='solid' color='primary' size='sm' style={{ width: 'max-content' }}>
                Standard 툴팁
              </Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='bottom'
              align={align}
              shape='balloon'
              variant='rich'
              size='sm'
              content='작성 중인 내용은 30초마다 자동으로 브라우저에 저장됩니다. 네트워크 연결이 끊겨도 안심하고 작업하세요.'
            >
              <Button variant='outline' color='primary' size='sm' style={{ width: 'max-content' }}>
                Rich 툴팁
              </Button>
            </Tooltip>
          </GuideCell>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    // 첫 번째(start)와 세 번째(end) 버튼에 호버하여 꼬리 위치가 양 끝으로 가는지 확인 유도
    if (buttons[0]) await userEvent.hover(buttons[0]);
  },
};

/**
 * [Viewport Edge Cases]
 * 브라우저 뷰포트 끝단에서의 방어 로직을 검증합니다.
 * 1. Flip: 상하좌우 끝에서 공간이 없으면 반대편으로 전환되는지 확인
 * 2. Constraint: 화면 밖으로 나가지 않도록 뷰포트 내부에 가두는지 확인
 */
export const ViewportEdgeCases: Story = {
  parameters: {
    // 스토리북 기본 패딩 제거하여 화면 끝까지 붙게 함
    layout: 'fullscreen',
  },
  args: {
    shape: 'balloon',
  },
  render: args => (
    <div
      style={{
        position: 'relative',
        height: '100vh', // 뷰포트 전체 높이
        width: '100vw', // 뷰포트 전체 너비
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px', // 실제 화면 끝에서 툴팁이 어떻게 반응하는지 볼 수 있는 최소 여백
        boxSizing: 'border-box',
      }}
    >
      {/* 상단 배치 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip {...args} content='화면 왼쪽 상단 끝' preferredPosition='top' align='start'>
          <Button size='sm'>TL</Button>
        </Tooltip>
        <Tooltip {...args} content='상단 중앙 Flip 테스트' preferredPosition='top'>
          <Button size='sm'>Top Center (Flip)</Button>
        </Tooltip>
        <Tooltip {...args} content='화면 오른쪽 상단 끝' preferredPosition='top' align='end'>
          <Button size='sm'>TR</Button>
        </Tooltip>
      </div>

      {/* 중앙/좌우 배치 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tooltip {...args} content='왼쪽 벽 Flip 테스트' preferredPosition='left'>
          <Button size='sm'>L-Edge</Button>
        </Tooltip>
        <Tooltip {...args} content='오른쪽 벽 Flip 테스트' preferredPosition='right'>
          <Button size='sm'>R-Edge</Button>
        </Tooltip>
      </div>

      {/* 하단 배치 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip {...args} content='화면 왼쪽 하단 끝' preferredPosition='bottom' align='start'>
          <Button size='sm'>BL</Button>
        </Tooltip>
        <Tooltip {...args} content='하단 중앙 Flip 테스트' preferredPosition='bottom'>
          <Button size='sm'>Bottom Center (Flip)</Button>
        </Tooltip>
        <Tooltip {...args} content='화면 오른쪽 하단 끝' preferredPosition='bottom' align='end'>
          <Button size='sm'>BR</Button>
        </Tooltip>
      </div>
    </div>
  ),
};
