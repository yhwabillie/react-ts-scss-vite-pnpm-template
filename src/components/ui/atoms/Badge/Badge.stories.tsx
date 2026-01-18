import type { Meta, StoryObj } from '@storybook/react-vite';
import { GuideCell, GuideGroup, GuideWrapper } from '@/components/ui/guide/Guide';
import Badge from '@/components/ui/atoms/Badge/Badge';
import Icon from '@/components/ui/atoms/Icon/Icon';
import Avatar from '@/components/ui/molecules/Avatar/Avatar';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import sampleAvatar2 from '@/assets/images/avatar_profile_sample_2.png';
import { useTranslation } from 'react-i18next';

const meta: Meta<typeof Badge> = {
  title: 'UI/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Badge** 컴포넌트는 숫자, 상태 키워드 또는 단순한 점(Dot)을 통해 사용자에게 부가적인 정보를 전달합니다. <br />' +
          '독립적으로 사용하거나 Avatar, Icon 등 다른 컴포넌트 위에 중첩하여 알림 상태를 표시할 수 있습니다. <br /><br />' +
          '• 레이블이 있는 Solid/Outline 스타일과 간결한 알림용 Dot 스타일 지원 <br />' +
          '• 부모 요소의 형태(`overlapShape`)를 감지하여 최적의 부착 위치를 자동 계산 <br />' +
          '• 디자인 시스템의 시멘틱 컬러를 통해 정보의 중요도와 성격을 명확히 구분',
      },
    },
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
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

/**
 * 기본 사용 예시
 * 가장 기본적인 Badge 형태를 확인합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();

    return (
      <GuideWrapper>
        <GuideGroup>
          <GuideCell>
            <Badge {...args} label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 크기 변주
 * SM, MD, LG 세 가지 크기에 따라 레이블의 가독성과 전체적인 볼륨감을 확인합니다.
 * 상황에 따라 사각형, 라운드, 알약, 원형 등 다양한 모양을 적용할 수 있습니다.
 */
export const Sizes: Story = {
  render: () => {
    const { t } = useTranslation();

    return (
      <GuideWrapper>
        <GuideGroup title='SM'>
          <GuideCell>
            <Badge size='sm' shape='square' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='sm' shape='rounded' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='sm' shape='pill' color='danger' label='+999' />
          </GuideCell>
          <GuideCell>
            <Badge size='sm' color='danger' shape='circle' label='N' />
          </GuideCell>
          <GuideCell>
            <Badge size='sm' color='danger' variant='dot' label='신규 알림 있음' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='MD'>
          <GuideCell>
            <Badge size='md' shape='square' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='md' shape='rounded' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='md' shape='pill' color='danger' label='+999' />
          </GuideCell>
          <GuideCell>
            <Badge size='md' color='danger' shape='circle' label='N' />
          </GuideCell>
          <GuideCell>
            <Badge size='md' color='danger' variant='dot' label='신규 알림 있음' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='LG'>
          <GuideCell>
            <Badge size='lg' shape='square' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='lg' shape='rounded' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge size='lg' shape='pill' color='danger' label='+999' />
          </GuideCell>
          <GuideCell>
            <Badge size='lg' color='danger' shape='circle' label='N' />
          </GuideCell>
          <GuideCell>
            <Badge size='lg' color='danger' variant='dot' label='신규 알림 있음' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 테마 색상 적용
 * 브랜드 식별자 및 상태 정보(성공, 경고, 위험 등)를 나타내는 색상 구성을 확인합니다.
 */
export const Colors: Story = {
  render: () => {
    const { t } = useTranslation();

    return (
      <GuideWrapper>
        <GuideGroup title='Primary'>
          <GuideCell>
            <Badge variant='solid' color='primary' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='primary' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Secondary'>
          <GuideCell>
            <Badge variant='solid' color='secondary' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='secondary' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Tertiary'>
          <GuideCell>
            <Badge variant='solid' color='tertiary' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='tertiary' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Success'>
          <GuideCell>
            <Badge variant='solid' color='success' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='success' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Warning'>
          <GuideCell>
            <Badge variant='solid' color='warning' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='warning' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Danger'>
          <GuideCell>
            <Badge variant='solid' color='danger' label={t('badge.label')} />
          </GuideCell>
          <GuideCell>
            <Badge variant='outline' color='danger' label={t('badge.label')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 외형 스타일 변주
 * 배경을 채운 Solid, 테두리 중심의 Outline, 그리고 단순 상태 알림용 Dot 스타일을 확인합니다.
 */
export const Variants: Story = {
  render: () => {
    const { t } = useTranslation();
    return (
      <GuideWrapper>
        <GuideGroup>
          <GuideCell caption='Solid'>
            <Badge variant='solid' label={t('badge.label')} />
          </GuideCell>
          <GuideCell caption='Outline'>
            <Badge variant='outline' label={t('badge.label')} />
          </GuideCell>
          <GuideCell caption='Dot'>
            <Badge color='danger' variant='dot' label='신규 알림 있음' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 형태 변주
 * 데이터의 성격에 맞춰 직각형(Square), 모서리 둥근형(Rounded), 알약형(Pill), 정원형(Circle)을 선택할 수 있습니다.
 */
export const Shapes: Story = {
  render: () => {
    const { t } = useTranslation();

    return (
      <GuideWrapper>
        <GuideGroup>
          <GuideCell caption='Square'>
            <Badge shape='square' label={t('badge.label')} />
            <Badge variant='outline' shape='square' label={t('badge.label')} />
          </GuideCell>
          <GuideCell caption='Rounded'>
            <Badge shape='rounded' label={t('badge.label')} />
            <Badge variant='outline' shape='rounded' label={t('badge.label')} />
          </GuideCell>
          <GuideCell caption='Pill'>
            <Badge shape='pill' color='danger' label='+999' />
            <Badge variant='outline' shape='pill' color='danger' label='+999' />
          </GuideCell>
          <GuideCell caption='Circle'>
            <Badge shape='circle' color='danger' label='N' />
            <Badge variant='outline' color='danger' shape='circle' label='N' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 중첩 배치 (Overlaid)
 * 아바타나 아이콘 버튼 같은 다른 컴포넌트 위에 Badge를 배치하여 알림이나 상태를 표시합니다.
 * overlapShape와 position 속성을 통해 부모 요소와의 자연스러운 정렬을 지원합니다.
 */
export const Overlaid: Story = {
  render: () => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideGroup title='Avatar'>
          <GuideCell>
            <Badge
              variant='dot'
              size='lg'
              color='danger'
              position='bottom-right'
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
            <Badge
              variant='dot'
              size='lg'
              color='danger'
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
    );
  },
};
