import type { Meta, StoryObj } from '@storybook/react-vite';
import Avatar from './Avatar';
import sampleAvatar1 from '@/assets/images/avatar_profile_sample_1.png';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Molecules/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Avatar**는 사용자 프로필 이미지나 이니셜을 표시하여 직관적인 사용자 식별을 돕는 컴포넌트입니다. <br /><br />' +
          '• **Fallback Strategy**: 이미지가 없거나 로드에 실패할 경우, 사용자의 이름 이니셜 또는 기본 아이콘으로 자동 전환되어 UI 깨짐을 방지합니다. <br />' +
          '• **Polymorphic Support**: `as` 속성을 통해 단순 이미지 노출(`div`)부터 링크(`a`), 클릭 액션(`button`)까지 다양한 HTML 태그로 확장 가능합니다. <br />' +
          '• **Visual Variants**: 서비스의 디자인 언어에 맞춰 원형, 사각형 등 다양한 형상과 크기를 제공합니다.',
      },
    },
  },
  argTypes: {
    // --- [Data] 이미지 및 텍스트 정보 ---
    src: {
      name: 'Image Source',
      description: '아바타 이미지의 URL 경로입니다.',
      control: 'text',
      table: {
        category: 'Data',
      },
    },
    alt: {
      name: 'Alt Text',
      description: '이미지 로드 실패 시 또는 스크린 리더용 대체 텍스트입니다.',
      control: 'text',
      table: {
        category: 'Data',
      },
    },
    name: {
      name: 'User Name',
      description: '이미지가 없을 경우 표시할 사용자 이름입니다. (보통 첫 글자 표기)',
      control: 'text',
      table: {
        category: 'Data',
      },
    },

    // --- [Appearance] 외형 및 스타일 ---
    size: {
      name: 'Size',
      description: '아바타의 직경(크기)을 설정합니다.',
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      name: 'Shape',
      description: '아바타의 외곽 형태를 결정합니다.',
      options: ['circle', 'square'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'circle' },
      },
    },
  },
  args: {
    size: 'md',
    shape: 'pill',
    alt: '홍길동님 프로필',
    name: '홍길동',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

/**
 * 가장 기본적인 아바타 형태입니다.
 * 유효한 이미지 경로(`src`)가 있을 때 프로필 이미지가 원형으로 렌더링되는지 확인합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup>
          <GuideCell>
            <Avatar {...args} src={sampleAvatar1} name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 이미지 로드에 실패하거나 경로가 없을 때의 대응 방식입니다.
 * - **Initial Display**: `name` 속성에서 추출한 이니셜을 배경색 위에 표시하여 시각적 정보를 유지합니다.
 */
export const FallbackName: Story = {
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup>
          <GuideCell>
            <Avatar {...args} src='' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 이미지와 이름 정보가 모두 없을 때의 최후 폴백 상태입니다.
 * - **Default Icon**: 사용자 정보가 없는 경우를 대비한 기본 아바타 아이콘이 노출되는지 확인합니다.
 */
export const UndefinedName: Story = {
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup>
          <GuideCell>
            <Avatar {...args} src='' name='' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 시각적 테두리 및 배경 스타일링 옵션을 확인합니다.
 * - **Solid**: 면(Face) 중심의 채워진 스타일입니다.
 * - **Outline**: 선(Stroke) 중심의 절제된 스타일로, 여러 아바타가 겹쳐지는 리스트 구조에서 유용합니다.
 */
export const Variants: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '24px' }}>
        <GuideGroup title='Solid'>
          <GuideCell>
            <Avatar {...args} variant='solid' name={t('avatar.name')} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' variant='solid' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Outline'>
          <GuideCell>
            <Avatar {...args} variant='outline' name={t('avatar.name')} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' variant='outline' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 서비스 인터페이스 성격에 따른 외곽 형태를 검증합니다.
 * - **Square / Rounded**: 좀 더 정교하고 현대적인 느낌을 줄 때 사용합니다.
 * - **Pill (Circle)**: 가장 표준적이고 친숙한 프로필 형태입니다.
 */
export const Shapes: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '24px' }}>
        <GuideGroup title='Square'>
          <GuideCell>
            <Avatar {...args} shape='square' name={t('avatar.name')} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='square' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rounded'>
          <GuideCell>
            <Avatar {...args} shape='rounded' name={t('avatar.name')} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='rounded' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Avatar {...args} shape='pill' name={t('avatar.name')} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='pill' name={t('avatar.name')} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * SM부터 XL까지 4단계 표준 크기 환경을 검수합니다.
 * - **Proportionality**: 크기에 따라 이니셜 폰트 사이즈와 기본 아이콘 크기가 조화롭게 변경되는지 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const name = t('avatar.name');

    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' }}>
          <GuideCell caption='sm'>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='square' size='sm' name={name} />
              <Avatar {...args} src='' shape='square' size='sm' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='rounded' size='sm' name={name} />
              <Avatar {...args} src='' shape='rounded' size='sm' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='pill' size='sm' name={name} />
              <Avatar {...args} src='' shape='pill' size='sm' name={name} />
            </div>
          </GuideCell>
          <GuideCell caption='md'>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='square' size='md' name={name} />
              <Avatar {...args} src='' shape='square' size='md' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='rounded' size='md' name={name} />
              <Avatar {...args} src='' shape='rounded' size='md' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='pill' size='md' name={name} />
              <Avatar {...args} src='' shape='pill' size='md' name={name} />
            </div>
          </GuideCell>
          <GuideCell caption='lg'>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='square' size='lg' name={name} />
              <Avatar {...args} src='' shape='square' size='lg' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='rounded' size='lg' name={name} />
              <Avatar {...args} src='' shape='rounded' size='lg' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='pill' size='lg' name={name} />
              <Avatar {...args} src='' shape='pill' size='lg' name={name} />
            </div>
          </GuideCell>
          <GuideCell caption='xl'>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='square' size='xl' name={name} />
              <Avatar {...args} src='' shape='square' size='xl' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='rounded' size='xl' name={name} />
              <Avatar {...args} src='' shape='rounded' size='xl' name={name} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
              <Avatar {...args} src={sampleAvatar1} shape='pill' size='xl' name={name} />
              <Avatar {...args} src='' shape='pill' size='xl' name={name} />
            </div>
          </GuideCell>
        </div>
      </GuideWrapper>
    );
  },
};

/**
 * 상황에 맞는 시맨틱 태그 확장성을 확인합니다.
 * - **Accessibility**: 버튼(`button`)으로 렌더링 시 키보드 접근성이 확보되는지, 링크(`a`)로 렌더링 시 이동 기능이 정상 작동하는지 점검합니다.
 */
export const Polymorphic: Story = {
  render: args => {
    const { t } = useTranslation();
    const name = t('avatar.name');
    const altText = `${name} 프로필`;

    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
        <GuideGroup title='Standard (div)'>
          <GuideCell>
            <Avatar {...args} as='div' src={sampleAvatar1} alt={altText} name={name} />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} as='div' name={name} src='' alt={altText} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Linkable (anchor)'>
          <GuideCell>
            <Avatar
              {...args}
              as='a'
              href='https://github.com'
              target='_blank'
              src={sampleAvatar1}
              alt={altText}
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              as='a'
              href='https://github.com'
              target='_blank'
              name={name}
              src=''
              alt={altText}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Action (button)'>
          <GuideCell>
            <Avatar
              {...args}
              as='button'
              type='button'
              src={sampleAvatar1}
              alt={altText}
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} as='button' type='button' name={name} src='' alt={altText} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 버튼이나 링크로 사용될 때의 인터랙션 피드백을 검증합니다.
 * - **Feedback**: 호버(Hover) 시의 오버레이 효과나 포커스(Focus) 시의 아웃라인을 확인합니다.
 */
export const States: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    const { t } = useTranslation();
    const name = t('avatar.name');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
        <GuideGroup title='Default'>
          <GuideCell caption='solid'>
            <Avatar {...args} as='button' variant='solid' name={name} />
          </GuideCell>
          <GuideCell caption='outline'>
            <Avatar {...args} as='button' variant='outline' name={name} />
          </GuideCell>
          <GuideCell caption='solid'>
            <Avatar {...args} src='' as='button' variant='solid' name={name} />
          </GuideCell>
          <GuideCell caption='outline'>
            <Avatar {...args} src='' as='button' variant='outline' name={name} />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Hover'>
          <GuideCell>
            <Avatar {...args} as='button' variant='solid' className='pseudo-hover' name={name} />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              src=''
              as='button'
              variant='solid'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              src=''
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Focus'>
          <GuideCell>
            <Avatar
              {...args}
              as='button'
              variant='solid'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              src=''
              as='button'
              variant='solid'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              src=''
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 각 브랜드 테마 컬러별 상태 피드백을 확인합니다.
 * - **Theme Sync**: Primary, Secondary, Tertiary 컬러 시스템이 아바타의 포커스 링이나 호버 상태에 일관되게 적용되는지 체크합니다.
 */
export const StateColors: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    const { t } = useTranslation();
    const name = t('avatar.name');
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
        <GuideGroup title='Hover'>
          <GuideCell caption='Primary'>
            <Avatar
              {...args}
              color='primary'
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Primary'>
            <Avatar
              {...args}
              color='primary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-hover'
              name={name}
            />
          </GuideCell>
        </GuideGroup>

        <GuideGroup title='Focus'>
          <GuideCell caption='Primary'>
            <Avatar
              {...args}
              color='primary'
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Primary'>
            <Avatar
              {...args}
              color='primary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              src=''
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
              name={name}
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};
