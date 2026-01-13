import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrimitiveTokensData } from '@/constants/generated/primitive-tokens';
import PrimitiveColorTokenTable from '@/components/ui/tokens/PrimitiveColorTokenTable';
import { ToastProvider } from '@/components/ui/molecules/Toast/ToastProvider';

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
          '시스템의 기초 원색 팔레트입니다. 직접 사용하지 않고 Semantic 토큰에서 참조하여 사용합니다.',
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

/**
 * 무채색 단계 (Grayscale)
 * 배경, 텍스트, 테두리 등 인터페이스 전반에 걸쳐 가장 광범위하게 사용되는 그레이스케일 토큰 세트입니다.
 */
export const Grayscale: Story = {
  args: {
    title: 'Grayscale',
    category: 'Base',
    tokens: primitiveMap['gray'] || [],
  },
};

/**
 * 브랜드 및 포인트 컬러
 * 디자인 시스템의 브랜드 정체성을 부여하는 메인 블루 컬러와
 * 상태 정보(성공, 경고, 위험)를 나타내는 주요 색상들을 포함합니다.
 */
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

/**
 * 투명도 적용 컬러 (Alpha Colors)
 * 배경 오버레이, 그림자, 또는 반투명한 레이어 효과를 위해 사용하는 RGBA 기반의 컬러 토큰입니다.
 */
export const AlphaColors: Story = {
  args: {
    title: 'Alpha Colors (RGBA)',
    category: 'Alpha',
    tokens: primitiveMap['alpha'] || [],
  },
};

/**
 * 기타 및 시스템 공통 컬러
 * 위의 카테고리에 속하지 않는 특수 용도의 컬러나
 * 시스템 전반에서 보조적으로 사용되는 색상들을 정의합니다.
 */
export const EtcColors: Story = {
  args: {
    title: 'Miscellaneous Colors',
    category: 'System',
    tokens: primitiveMap['etc'] || [],
  },
};
