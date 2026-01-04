import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from './Badge';
import Icon from '../Icon/Icon';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Badge> = {
  title: 'UI/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // --- Appearance 카테고리 ---
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
      description: '배지의 시각적 스타일을 결정합니다.',
      table: {
        category: 'Appearance', // 카테고리 지정
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      description: '프로젝트 디자인 시스템 색상을 적용합니다.',
      table: {
        category: 'Appearance',
      },
    },

    // --- Layout 카테고리 ---
    shape: {
      control: 'select',
      options: ['square', 'rounded', 'circle'],
      description: '배지의 모서리 곡률 및 형태를 설정합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'rounded' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '배지의 크기를 조절합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'md' },
      },
    },
    overlap: {
      control: 'boolean',
      description: '아이콘이나 이미지 우상단에 배치할지 여부입니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'false' },
      },
    },

    // --- Accessibility 카테고리 ---
    ariaLabel: {
      control: 'text',
      description: '보조공학기기를 위한 설명입니다.',
      table: {
        category: 'Accessibility',
      },
    },

    // --- Content 카테고리 ---
    children: {
      control: 'text',
      description: '내부에 표시될 내용입니다.',
      table: {
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Base: Story = {
  render: () => (
    <GuideWrapper>
      <GuideGroup>
        <GuideCell>
          <Badge color='primary'>공지</Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 📏 Sizes: 배지의 크기 시스템을 정의합니다.
 * XS부터 XL까지(현재 스토리는 SM, MD, LG 중심) 다양한 위계의 UI에 대응합니다.
 * * [접근성 포인트]
 * - 가려짐 방지: 배지 크기가 커질 때 행 높이(Line-height)를 초과하여 위아래 텍스트를
 * 가리지(Obscured) 않도록 최적화된 Height 값을 할당했습니다.
 * - 최소 크기: 'circle' 형태의 배지는 최소 44x44px의 터치 타겟을 확보하거나,
 * 텍스트와 충분한 간격을 두어 오클릭을 방지해야 합니다.
 */
export const Sizes: Story = {
  render: () => (
    <GuideWrapper>
      <GuideGroup title='SM'>
        <GuideCell>
          <Badge size='sm' shape='square'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' shape='rounded'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' color='danger' shape='circle'>
            N
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='MD'>
        <GuideCell>
          <Badge size='md' shape='square'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' shape='rounded'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' color='danger' shape='circle'>
            N
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='LG'>
        <GuideCell>
          <Badge size='lg' shape='square'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' shape='rounded'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' color='danger' shape='circle'>
            N
          </Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 🌈 Colors: 시스템 테마별 컬러 배리에이션입니다.
 * Primary, Secondary, Tertiary 및 상태 컬러(Success, Warning, Danger)를 포함합니다.
 * * [접근성 포인트]
 * - 명도 대비: 모든 컬러는 배경과 텍스트의 대비비가 4.5:1(AA)을 넘도록 설계되었습니다.
 * - Warning 주의: 밝은 노랑 대신 금색 계열을 사용하여 흰색 배경에서 글자가
 * 가려진(Obscured) 것처럼 보이는 현상을 방지했습니다.
 */
export const Colors: Story = {
  render: () => (
    <GuideWrapper>
      <GuideGroup title='Primary'>
        <GuideCell>
          <Badge variant='solid' color='primary'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='primary'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Secondary'>
        <GuideCell>
          <Badge variant='solid' color='secondary'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='secondary'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Tertiary'>
        <GuideCell>
          <Badge variant='solid' color='tertiary'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='tertiary'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Success'>
        <GuideCell>
          <Badge variant='solid' color='success'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='success'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Warning'>
        <GuideCell>
          <Badge variant='solid' color='warning'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='warning'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Danger'>
        <GuideCell>
          <Badge variant='solid' color='danger'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='danger'>
            공지
          </Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * ✨ Variants: 배지의 시각적 무게감(Weight)을 결정하는 스타일입니다.
 * Solid: 강한 강조가 필요하거나 배경색이 밝은 영역에 사용합니다.
 * Outline: 보조적인 정보나 데이터가 밀집된 리스트 내에서 시각적 부하를 줄일 때 사용합니다.
 */
export const Variants: Story = {
  render: () => (
    <GuideWrapper>
      <GuideGroup>
        <GuideCell caption='Solid'>
          <Badge variant='solid'>공지</Badge>
        </GuideCell>
        <GuideCell caption='Outline'>
          <Badge variant='outline'>공지</Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * 📐 Shapes: 배지의 모서리 곡률에 따른 형태 분류입니다.
 * Square: 정갈하고 딱딱한 느낌의 시스템 레이아웃에 적합합니다.
 * Rounded: 부드러운 인상을 주며 대부분의 현대적 UI에서 기본값으로 쓰입니다.
 * Circle: 숫자 알림(Count)이나 심볼(N, 1, !)을 강조할 때 사용하며, 1:1 비율을 유지합니다.
 */
export const Shapes: Story = {
  render: () => (
    <GuideWrapper>
      <GuideGroup>
        <GuideCell caption='Square'>
          <Badge shape='square'>공지</Badge>
          <Badge variant='outline' shape='square'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell caption='Rounded'>
          <Badge shape='rounded'>공지</Badge>
          <Badge variant='outline' shape='rounded'>
            공지
          </Badge>
        </GuideCell>
        <GuideCell caption='Circle'>
          <Badge shape='circle' color='danger'>
            N
          </Badge>
          <Badge variant='outline' color='danger' shape='circle'>
            N
          </Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};
