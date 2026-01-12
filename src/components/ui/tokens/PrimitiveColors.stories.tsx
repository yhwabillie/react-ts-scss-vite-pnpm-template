import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrimitiveTokensData } from '../../../constants/generated/primitive-tokens';
import PrimitiveColorTokenTable from './PrimitiveColorTokenTable'; // 업데이트된 전용 컴포넌트
import { ToastProvider } from '../molecules/Toast/ToastProvider';

const meta: Meta<typeof PrimitiveColorTokenTable> = {
  title: 'Tokens/Colors/Primitive',
  tags: ['autodocs'],
  component: PrimitiveColorTokenTable,
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '시스템의 기초 원색 팔레트입니다. 직접 사용하지 않고 Semantic 토큰에서 참조하여 사용합니다. 2025-12-31 접근성 가이드에 따라 Alpha 컬러 사용 시 주의가 필요합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PrimitiveColorTokenTable>;

/**
 * Primitive 데이터를 카테고리별로 매핑하여 tokens 배열 생성
 */
const primitiveMap = PrimitiveTokensData.reduce(
  (acc, group) => {
    acc[group.category.toLowerCase()] = group.colors.map(color => ({
      id: color.variable, // --color-primitive-gray-0
      name: color.name, // color-0
      value: color.value, // #000000
      usage: `${group.category} Scale`,
      description: `Original Source: ${color.value}`,
    }));
    return acc;
  },
  {} as Record<string, any[]>,
);

// 1. 무채색 계열 (Gray)
export const Grayscale: Story = {
  args: {
    title: 'Grayscale',
    category: 'Base',
    tokens: primitiveMap['gray'] || [],
  },
};

// 2. 브랜드 및 포인트 컬러
export const BrandColors: Story = {
  args: {
    title: 'Brand & Point Colors',
    category: 'Base',
    tokens: [
      ...(primitiveMap['blue'] || []),
      ...(primitiveMap['red'] || []),
      ...(primitiveMap['green'] || []),
      ...(primitiveMap['yellow'] || []),
    ],
  },
};

// 3. 투명도 포함 컬러 (Alpha)
export const AlphaColors: Story = {
  args: {
    title: 'Alpha Colors (RGBA)',
    category: 'Alpha',
    tokens: primitiveMap['alpha'] || [],
  },
};

// 4. 기타 (Etc)
export const EtcColors: Story = {
  args: {
    title: 'Miscellaneous Colors',
    category: 'System',
    tokens: primitiveMap['etc'] || [],
  },
};
