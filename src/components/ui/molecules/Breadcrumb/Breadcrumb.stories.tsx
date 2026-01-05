import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '../../atoms/Icon/Icon'; // 프로젝트 내 아이콘 컴포넌트 가정
import Breadcrumbs from './Breadcrumb';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'UI/Molecules/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: '아이템 사이의 구분자입니다. 문자열이나 React 노드를 전달할 수 있습니다.',
      table: { defaultValue: { summary: '>' } },
    },
    items: {
      description: '경로 정보를 담은 객체 배열입니다.',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

/**
 * 💡 Base: 기본적인 텍스트 형태의 브레드크럼입니다.
 * - 마지막 아이템이 'aria-current="page"'로 올바르게 표시되는지 확인합니다.
 */
export const Base: Story = {
  args: {
    items: [
      { label: '홈', href: '/' },
      { label: '제품 목록', href: '/products' },
      { label: '상세 페이지' },
    ],
  },
};

/**
 * 🏠 WithIcons: 아이콘이 포함된 형태입니다.
 * - 시각적 아이콘과 텍스트의 정렬이 어긋나 정보를 가리지 않는지 테스트합니다.
 */
export const WithIcons: Story = {
  args: {
    items: [
      { label: '홈', href: '/', icon: <Icon name='megaphone' size='sm' /> },
      { label: '설정', href: '/settings', icon: <Icon name='megaphone' size='sm' /> },
      { label: '사용자 프로필', icon: <Icon name='megaphone' size='sm' /> },
    ],
  },
};

/**
 * 🎨 CustomSeparator: 슬래시(/)나 아이콘 등 커스텀 구분자를 사용합니다.
 * - [가려짐 방지] 구분자가 너무 커서 앞뒤 텍스트를 가리지(Obscured) 않는지 확인합니다.
 */
export const CustomSeparator: Story = {
  args: {
    ...Base.args,
    separator: <Icon name='chevron-right' size='sm' />,
  },
};

/**
 * 📏 LongPath: 경로가 매우 길어지는 케이스를 테스트합니다.
 * - [가려짐 방지] 화면 폭이 좁을 때 아이템들이 다음 줄로 밀리거나 겹쳐서 가려지지 않는지 확인합니다.
 */
export const LongPath: Story = {
  args: {
    items: [
      { label: 'Depth 1', href: '#' },
      { label: 'Depth 2', href: '#' },
      { label: 'Depth 3', href: '#' },
      { label: 'Depth 4', href: '#' },
      { label: 'Depth 5', href: '#' },
      { label: '매우 길어서 가로 길이를 많이 차지하는 마지막 페이지 제목' },
    ],
  },
};
