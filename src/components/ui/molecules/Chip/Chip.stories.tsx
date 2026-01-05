import type { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './Chip';
import Icon from '../../atoms/Icon/Icon';

const meta: Meta<typeof Chip> = {
  title: 'UI/Molecules/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['filter', 'input', 'choice'],
      description: '칩의 용도에 따른 스타일을 설정합니다.',
    },
    label: { control: 'text' },
    selected: { control: 'boolean' },
    onSelect: { action: 'selected' },
    onDelete: { action: 'deleted' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

/**
 * 💡 Base: 가장 기본적인 칩 형태입니다.
 */
export const Base: Story = {
  args: {
    label: '기본 칩',
    variant: 'choice',
  },
};

/**
 * ✅ Selectable: 클릭하여 선택 상태를 토글할 수 있는 칩입니다.
 * - [가려짐 방지] 선택 시 변경되는 배경색이나 테두리가 내부 라벨을 가리지 않는지 확인합니다.
 */
export const Selectable: Story = {
  args: {
    ...Base.args,
    label: '선택 가능 칩',
    selected: true,
    onSelect: () => {},
  },
};

/**
 * ❌ Deletable: 삭제 버튼이 포함된 칩입니다. (Input variant)
 * - [접근성] 삭제 버튼의 터치 영역이 라벨과 겹쳐서 클릭을 방해하지 않는지 테스트합니다.
 */
export const Deletable: Story = {
  args: {
    label: '삭제 가능 칩',
    variant: 'input',
    onDelete: () => {},
  },
};

/**
 * 🏠 WithIcon: 아이콘이 포함된 칩입니다.
 * - 아이콘과 텍스트 사이의 간격이 적절하여 정보가 뭉쳐서 가려지지 않는지 확인합니다.
 */
export const WithIcon: Story = {
  args: {
    label: '아이콘 칩',
    icon: <Icon name='megaphone' size='md' />,
    onSelect: () => {},
  },
};

/**
 * 🛠 Variants: 다양한 용도별 칩을 한눈에 비교합니다.
 */
export const AllVariants: Story = {
  render: args => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Chip {...args} variant='choice' label='Choice Chip' />
      <Chip {...args} variant='filter' label='Filter Chip' selected />
      <Chip {...args} variant='input' label='Input Chip' onDelete={() => {}} />
    </div>
  ),
};
