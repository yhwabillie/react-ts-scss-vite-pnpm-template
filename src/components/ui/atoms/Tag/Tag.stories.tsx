import type { Meta, StoryObj } from '@storybook/react-vite';
import Tag from './Tag';
import Icon from '../../atoms/Icon/Icon';

const meta: Meta<typeof Tag> = {
  title: 'UI/Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'outline'],
      description: '태그의 테마 색상을 결정합니다.',
    },
    href: {
      control: 'text',
      description: '입력 시 <a> 태그로 렌더링되며 링크 역할을 수행합니다.',
    },
    icon: {
      control: false,
      description: '라벨 앞에 표시될 아이콘 노드입니다.',
    },
    children: {
      control: 'text',
      description: '태그 내부에 표시될 텍스트 내용입니다.',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof Tag>;

/**
 * 💡 Base: 가장 기본적인 텍스트 형태의 태그입니다.
 * - 기본적으로 <span> 태그로 렌더링됩니다.
 */
export const Base: Story = {
  args: {
    children: 'Default Tag',
    color: 'default',
  },
};

/**
 * 🔗 Link: href 속성이 포함된 태그입니다.
 * - 마우스를 올렸을 때 클릭 가능한 상태(Pointer)인지, <a> 태그로 렌더링되었는지 확인합니다.
 */
export const Link: Story = {
  args: {
    ...Base.args,
    children: 'Link Tag',
    href: 'https://www.google.com',
  },
};

/**
 * #️⃣ WithIcon: 해시태그나 상태를 나타내는 아이콘이 포함된 형태입니다.
 * - 아이콘과 텍스트의 수직 정렬이 어긋나 정보가 가려지지(Obscured) 않는지 테스트합니다.
 */
export const WithIcon: Story = {
  args: {
    children: 'Hashtag',
    color: 'primary',
    icon: <span>#</span>,
  },
};

/**
 * 🎨 Colors: 디자인 시스템의 모든 색상 변형을 한눈에 비교합니다.
 */
export const AllColors: Story = {
  render: args => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Tag {...args} color='default'>
        Default
      </Tag>
      <Tag {...args} color='primary'>
        Primary
      </Tag>
      <Tag {...args} color='secondary'>
        Secondary
      </Tag>
      <Tag {...args} color='outline'>
        Outline
      </Tag>
    </div>
  ),
};
