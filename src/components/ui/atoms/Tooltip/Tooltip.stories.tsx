import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from './Tooltip';
import Button from '../../molecules/Button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['simple', 'rich'],
      description: '툴팁의 디자인 스타일을 결정합니다.',
    },
    preferredPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '툴팁이 나타날 우선 순위 위치를 설정합니다.',
    },
    id: { table: { disable: true } },
    content: { control: 'text' },
  },
  // 툴팁이 잘리지 않도록 스토리 컨테이너에 여백 추가
  decorators: [
    Story => (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * 💡 Base: 가장 기본적인 툴팁 동작입니다.
 * - 마우스 호버 및 포커스 시 툴팁이 나타나는지 확인합니다.
 */
export const Base: Story = {
  args: {
    id: 'tooltip-base',
    content: '간단한 도움말 텍스트입니다.',
    children: <Button variant='outline'>Hover Me</Button>,
  },
};

/**
 * 📍 Positioning: 사방향(Top, Bottom, Left, Right) 배치를 확인합니다.
 * - [가려짐 방지] 지정된 위치에 툴팁이 나타날 때 트리거 버튼을 가리지 않는지 체크합니다.
 */
export const Positions: Story = {
  render: args => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '100px' }}>
      <Tooltip {...args} id='top' preferredPosition='top' content='Top Tooltip'>
        <Button>Top</Button>
      </Tooltip>
      <Tooltip {...args} id='bottom' preferredPosition='bottom' content='Bottom Tooltip'>
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip {...args} id='left' preferredPosition='left' content='Left Tooltip'>
        <Button>Left</Button>
      </Tooltip>
      <Tooltip {...args} id='right' preferredPosition='right' content='Right Tooltip'>
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * 🎨 Rich Content: 텍스트 외에 복잡한 마크업을 담은 툴팁입니다.
 * - 이미지나 제목 등 부피가 큰 컨텐츠가 담겼을 때 위치 계산이 정확한지 확인합니다.
 */
export const RichVariant: Story = {
  args: {
    id: 'tooltip-rich',
    variant: 'rich',
    content: (
      <div style={{ textAlign: 'left' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>프로필 정보</strong>
        <p style={{ margin: 0, fontSize: '12px' }}>
          사용자의 상세 상태를 여기서 확인할 수 있습니다.
        </p>
      </div>
    ),
    children: <Button color='secondary'>Rich Content</Button>,
  },
};

/**
 * 🛡️ Boundary Collision: 화면 가장자리에서 위치가 자동 전환되는지 테스트합니다.
 * - 상단에 공간이 없을 때 자동으로 'bottom'으로 전환되어 정보를 가리지 않는지 검증합니다.
 */
export const EdgeCase: Story = {
  render: args => (
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
      <Tooltip {...args} id='edge' content='상단 공간이 없어 아래로 튀어나옵니다.'>
        <Button>Edge Test</Button>
      </Tooltip>
    </div>
  ),
};
