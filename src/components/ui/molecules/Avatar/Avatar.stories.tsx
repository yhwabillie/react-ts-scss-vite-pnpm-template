import type { Meta, StoryObj } from '@storybook/react-vite';
import Avatar from './Avatar';
import sampleAvatar1 from '@/assets/images/avatar_profile_sample_1.png';
import sampleAvatar2 from '@/assets/images/avatar_profile_sample_2.png';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Molecules/Avatar',
  component: Avatar,
  tags: ['autodocs'],
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

export const Base: Story = {
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup>
          <GuideCell>
            <Avatar {...args} src={sampleAvatar1} />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

export const FallbackName: Story = {
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto' }}>
        <GuideGroup>
          <GuideCell>
            <Avatar {...args} src='' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

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

export const Variants: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '24px' }}>
        <GuideGroup title='Solid'>
          <GuideCell>
            <Avatar {...args} variant='solid' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' variant='solid' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Outline'>
          <GuideCell>
            <Avatar {...args} variant='outline' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' variant='outline' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

export const Shapes: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '24px' }}>
        <GuideGroup title='Square'>
          <GuideCell>
            <Avatar {...args} shape='square' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='square' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Rounded'>
          <GuideCell>
            <Avatar {...args} shape='rounded' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='rounded' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Pill'>
          <GuideCell>
            <Avatar {...args} shape='pill' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' shape='pill' />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

export const Sizes: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start' }}>
        <GuideCell caption='sm'>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='square' size='sm' />
            <Avatar {...args} src='' shape='square' size='sm' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='rounded' size='sm' />
            <Avatar {...args} src='' shape='rounded' size='sm' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='pill' size='sm' />
            <Avatar {...args} src='' shape='pill' size='sm' />
          </div>
        </GuideCell>
        <GuideCell caption='md'>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='square' size='md' />
            <Avatar {...args} src='' shape='square' size='md' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='rounded' size='md' />
            <Avatar {...args} src='' shape='rounded' size='md' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='pill' size='md' />
            <Avatar {...args} src='' shape='pill' size='md' />
          </div>
        </GuideCell>
        <GuideCell caption='lg'>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='square' size='lg' />
            <Avatar {...args} src='' shape='square' size='lg' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='rounded' size='lg' />
            <Avatar {...args} src='' shape='rounded' size='lg' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='pill' size='lg' />
            <Avatar {...args} src='' shape='pill' size='lg' />
          </div>
        </GuideCell>
        <GuideCell caption='xl'>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='square' size='xl' />
            <Avatar {...args} src='' shape='square' size='xl' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='rounded' size='xl' />
            <Avatar {...args} src='' shape='rounded' size='xl' />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
            <Avatar {...args} src={sampleAvatar1} shape='pill' size='xl' />
            <Avatar {...args} src='' shape='pill' size='xl' />
          </div>
        </GuideCell>
      </div>
    </GuideWrapper>
  ),
};

export const Polymorphic: Story = {
  render: args => (
    <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
      <GuideGroup title='Standard (div)'>
        <GuideCell>
          <Avatar {...args} as='div' src={sampleAvatar1} alt='General User' />
        </GuideCell>
        <GuideCell>
          <Avatar {...args} as='div' name='John Doe' src='' alt='Initial User' />
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
            alt='General User'
          />
        </GuideCell>
        <GuideCell>
          <Avatar
            {...args}
            as='a'
            href='https://github.com'
            target='_blank'
            name='John Doe'
            src=''
            alt='Initial User'
          />
        </GuideCell>
      </GuideGroup>
      <GuideGroup title='Action (button)'>
        <GuideCell>
          <Avatar {...args} as='button' type='button' src={sampleAvatar1} alt='General User' />
        </GuideCell>
        <GuideCell>
          <Avatar {...args} as='button' type='button' name='John Doe' src='' alt='Initial User' />
        </GuideCell>
      </GuideGroup>
    </GuideWrapper>
  ),
};

export const States: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '20px' }}>
        <GuideGroup title='Default'>
          <GuideCell caption='solid'>
            <Avatar {...args} as='button' variant='solid' />
          </GuideCell>
          <GuideCell caption='outline'>
            <Avatar {...args} as='button' variant='outline' />
          </GuideCell>
          <GuideCell caption='solid'>
            <Avatar {...args} src='' as='button' variant='solid' />
          </GuideCell>
          <GuideCell caption='outline'>
            <Avatar {...args} src='' as='button' variant='outline' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Hover'>
          <GuideCell>
            <Avatar {...args} as='button' variant='solid' className='pseudo-hover' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} as='button' variant='outline' className='pseudo-hover' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' as='button' variant='solid' className='pseudo-hover' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' as='button' variant='outline' className='pseudo-hover' />
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Focus'>
          <GuideCell>
            <Avatar {...args} as='button' variant='solid' className='pseudo-focus-visible' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} as='button' variant='outline' className='pseudo-focus-visible' />
          </GuideCell>
          <GuideCell>
            <Avatar {...args} src='' as='button' variant='solid' className='pseudo-focus-visible' />
          </GuideCell>
          <GuideCell>
            <Avatar
              {...args}
              src=''
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

export const StateColors: Story = {
  args: {
    src: sampleAvatar1,
  },
  render: args => {
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
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              as='button'
              variant='outline'
              className='pseudo-hover'
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              as='button'
              variant='outline'
              className='pseudo-hover'
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
            />
          </GuideCell>
          <GuideCell caption='Secondary'>
            <Avatar
              {...args}
              color='secondary'
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
            />
          </GuideCell>
          <GuideCell caption='Tertiary'>
            <Avatar
              {...args}
              color='tertiary'
              as='button'
              variant='outline'
              className='pseudo-focus-visible'
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
            />
          </GuideCell>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

// export const WithStatus: Story = {
//   render: args => (
//     <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
//       <Avatar {...args} />
//       <Avatar {...args} />
//       <Avatar {...args} />
//       <Avatar {...args} />
//     </div>
//   ),
//   args: {
//     ...Base.args,
//     size: 'lg',
//   },
// };
