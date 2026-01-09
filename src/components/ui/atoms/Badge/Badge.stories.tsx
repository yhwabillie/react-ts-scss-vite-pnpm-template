import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from './Badge';
import Icon from '../Icon/Icon';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import Avatar from '../../molecules/Avatar/Avatar';
import sampleAvatar2 from '@/assets/images/avatar_profile_sample_2.png';
import IconButton from '../../molecules/IconButton/IconButton';

const meta: Meta<typeof Badge> = {
  title: 'UI/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // --- Appearance: 시각적 스타일 ---
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'dot'],
      description: '배지의 시각적 타입을 선택합니다. `dot`은 레이블 없이 작은 점으로 표시됩니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      description: '디자인 시스템의 테마 색상을 적용합니다.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },

    // --- Layout: 형태 및 위치 ---
    shape: {
      control: 'select',
      options: ['square', 'rounded', 'pill', 'circle'],
      description: '배지 자체의 모서리 곡률을 설정합니다. `variant="dot"`일 때는 무시됩니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'rounded' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '배지의 전체적인 크기를 조절합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'md' },
      },
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: '`children`이 존재할 때, 배지가 부착될 상대 위치를 결정합니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'top-right' },
      },
    },
    overlapShape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      description:
        '감싸고 있는 요소의 형태를 지정합니다. `pill` 선택 시 원형 곡선을 고려해 위치가 **14.6% 안쪽으로 자동 보정**됩니다.',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'rounded' },
      },
    },

    // --- Content: 내용 ---
    label: {
      control: 'text',
      description:
        '배지 내부에 표시될 텍스트입니다. `dot` 변형일 경우 시각적으로는 숨겨지나 스크린 리더용으로 사용됩니다.',
      table: {
        category: 'Content',
      },
    },
    children: {
      control: false,
      description:
        '배지가 부착될 대상(Avatar, Icon 등)입니다. 존재할 경우 배지는 부모 요소를 기준으로 절대 좌표 배치됩니다.',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },

    // --- Accessibility: 접근성 ---
    ariaLabel: {
      control: 'text',
      description:
        '보조공학기기를 위한 설명입니다. 배지 내용이 생략되거나 점(Dot)일 때 반드시 사용을 권장합니다.',
      table: {
        category: 'Accessibility',
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
          <Badge color='primary' label='공지'></Badge>
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
          <Badge size='sm' shape='square' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' shape='rounded' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' shape='pill' color='danger' label='+999'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' color='danger' shape='circle' label='N'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='sm' color='danger' variant='dot' label='신규 알림 있음'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='MD'>
        <GuideCell>
          <Badge size='md' shape='square' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' shape='rounded' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' shape='pill' color='danger' label='+999'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' color='danger' shape='circle' label='N'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='md' color='danger' variant='dot' label='신규 알림 있음'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='LG'>
        <GuideCell>
          <Badge size='lg' shape='square' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' shape='rounded' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' shape='pill' color='danger' label='+999'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' color='danger' shape='circle' label='N'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge size='lg' color='danger' variant='dot' label='신규 알림 있음'></Badge>
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
          <Badge variant='solid' color='primary' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='primary' label='공지'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Secondary'>
        <GuideCell>
          <Badge variant='solid' color='secondary' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='secondary' label='공지'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Tertiary'>
        <GuideCell>
          <Badge variant='solid' color='tertiary' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='tertiary' label='공지'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Success'>
        <GuideCell>
          <Badge variant='solid' color='success' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='success' label='공지'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Warning'>
        <GuideCell>
          <Badge variant='solid' color='warning' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='warning' label='공지'></Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Danger'>
        <GuideCell>
          <Badge variant='solid' color='danger' label='공지'></Badge>
        </GuideCell>
        <GuideCell>
          <Badge variant='outline' color='danger' label='공지'></Badge>
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
          <Badge variant='solid' label='공지'></Badge>
        </GuideCell>
        <GuideCell caption='Outline'>
          <Badge variant='outline' label='공지'></Badge>
        </GuideCell>
        <GuideCell caption='Dot'>
          <Badge color='danger' variant='dot' label='신규 알림 있음'></Badge>
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
          <Badge shape='square' label='공지'></Badge>
          <Badge variant='outline' shape='square' label='공지'></Badge>
        </GuideCell>
        <GuideCell caption='Rounded'>
          <Badge shape='rounded' label='공지'></Badge>
          <Badge variant='outline' shape='rounded' label='공지'></Badge>
        </GuideCell>
        <GuideCell caption='Pill'>
          <Badge shape='pill' color='danger' label='+999'></Badge>
          <Badge variant='outline' shape='pill' color='danger' label='+999'></Badge>
        </GuideCell>
        <GuideCell caption='Circle'>
          <Badge shape='circle' color='danger' label='N'></Badge>
          <Badge variant='outline' color='danger' shape='circle' label='N'></Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

/**
 * `Overlaid` 스토리는 배지가 다른 컴포넌트(Avatar, IconButton 등) 위에 겹쳐질 때의 레이아웃을 확인합니다.
 * * - `overlapShape`: 하위 요소의 형태(pill, rounded 등)에 따라 배지의 위치를 자동으로 보정합니다.
 * - 특히 `pill`(원형)인 경우, 시각적으로 자연스럽게 안착되도록 14.6% 안쪽으로 위치가 조정됩니다.
 * - 접근성: 배지가 콘텐츠를 가리는 상황을 고려하여 `title` 속성 대신 `aria-label` 사용을 권장합니다.
 */
export const Overlaid: Story = {
  render: () => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
      <GuideGroup title='Avatar'>
        <GuideCell>
          <Badge variant='dot' size='lg' color='danger' position='bottom-right' overlapShape='pill'>
            <Avatar
              alt='홍길동님 프로필'
              name='홍길동'
              shape='pill'
              size='md'
              src={sampleAvatar2}
            />
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge
            shape='pill'
            size='sm'
            color='danger'
            label='+999'
            position='top-right'
            overlapShape='pill'
          >
            <Avatar
              alt='홍길동님 프로필'
              name='홍길동'
              shape='pill'
              size='md'
              src={sampleAvatar2}
            />
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge
            size='sm'
            shape='rounded'
            color='danger'
            label='NEW'
            position='top-right'
            overlapShape='pill'
          >
            <Avatar
              alt='홍길동님 프로필'
              name='홍길동'
              shape='pill'
              size='md'
              src={sampleAvatar2}
            />
          </Badge>
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Icon Button'>
        <GuideCell>
          <Badge variant='dot' size='lg' color='danger' position='top-right' overlapShape='rounded'>
            <IconButton
              color='primary'
              shape='rounded'
              size='md'
              variant='outline'
              icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
            />
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge
            shape='pill'
            size='sm'
            color='danger'
            label='+999'
            position='top-right'
            overlapShape='rounded'
          >
            <IconButton
              color='primary'
              shape='rounded'
              size='md'
              variant='outline'
              icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
            />
          </Badge>
        </GuideCell>
        <GuideCell>
          <Badge
            size='sm'
            shape='rounded'
            color='danger'
            label='NEW'
            position='top-right'
            overlapShape='rounded'
          >
            <IconButton
              color='primary'
              shape='rounded'
              size='md'
              variant='outline'
              icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
            />
          </Badge>
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};
