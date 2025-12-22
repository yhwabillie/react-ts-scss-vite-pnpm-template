import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';
import Icon from '../../../atoms/Icon/Icon';
import { fn } from 'storybook/test';
import LinkButton from '../LinkButton';

const meta: Meta<typeof LinkButton> = {
  title: 'UI/Molecules/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Link 버튼은 텍스트에 언더라인이 포함된 배경 없는 스타일로, 웹 페이지 내의 이동이나 부가적인 동작을 수행할 때 사용됩니다. <br> 기본 상태에서는 투명한 배경을 유지하다가, 마우스 호버 시에만 은은한 배경색이 나타나 시각적 피드백을 제공합니다. <br> <br> `<a>` 태그로 렌더링하는 케이스입니다. 외부 링크 이동이나 SEO 최적화가 필요한 경우 사용합니다.',
      },
    },
  },
  args: {
    variant: 'link',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
    fullWidth: false,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    fullWidth: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    href: 'https://www.google.com',
    target: '_blank',
    title: '새 창 열기',
    rel: 'noopener noreferrer',
    children: '구글로 이동 (Anchor Tag)',
    onClick: fn(),
  },
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  render: args => {
    return <LinkButton {...args}></LinkButton>;
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '버튼의 다양한 인터랙션 상태(Hover, Focus, Active, Disabled)를 확인할 수 있습니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();

    const states = [
      { label: 'Normal', class: '' },
      { label: 'Hover', class: 'pseudo-hover' },
      { label: 'Focus', class: 'pseudo-focus-visible' },
      { label: 'Active', class: 'pseudo-active' },
      { label: 'Disabled', props: { 'aria-disabled': true } },
    ];

    return (
      <>
        {states.map((state, index) => {
          const isLast = index === states.length - 1;

          return (
            <div
              key={state.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: isLast ? '0' : '20px',
              }}
            >
              {/* 왼쪽 라벨 고정 */}
              <span style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#666' }}>
                {state.label}
              </span>

              {/* 버튼 조합들 */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <LinkButton {...args} className={state.class} {...state.props}>
                  {t('hello')}
                </LinkButton>
                <LinkButton
                  {...args}
                  className={state.class}
                  {...state.props}
                  startIcon={
                    <Icon
                      name='chevron-left'
                      strokeWidth={2.5}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='icon'
                    />
                  }
                >
                  {t('hello')}
                </LinkButton>
              </div>
            </div>
          );
        })}
      </>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '다섯 가지 표준 사이즈(XS ~ XL)에 따른 버튼의 크기 변화와 내부 요소의 비율을 확인합니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    return (
      <div style={{ display: 'inline-flex', gap: '15px', alignItems: 'end' }}>
        {sizeOptions.map(size => (
          <div
            key={size}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 'bold',
              }}
            >
              {size.toUpperCase()}
            </span>
            <LinkButton {...args} size={size}>
              {t('hello')}
            </LinkButton>
          </div>
        ))}
      </div>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: '버튼이 부모 요소의 전체 너비를 차지할지 여부를 결정합니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <div style={{ width: '500px', border: '1px dashed #ccc', padding: '20px' }}>
        <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
          Container Width: 500px
        </p>
        <LinkButton {...args} fullWidth={true}>
          {t('Full Width Link Button')}
        </LinkButton>
      </div>
    );
  },
};

export const LongText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼 내부에 긴 텍스트가 들어올 경우 말줄임(Ellipsis) 처리가 정상적으로 작동하는지 확인합니다. 부모 컨테이너의 너비를 200px로 제한한 테스트 케이스입니다.',
      },
    },
  },
  args: {
    children:
      '이 버튼의 글자는 매우 길어서 컨테이너를 벗어날 수 있습니다. 말줄임 처리가 필요합니다.',
  },
  render: args => {
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <div
          style={{
            width: '200px',
            padding: '20px',
            border: '1px dashed #ccc',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
            Container Width: 200px
          </p>
          <LinkButton {...args} fullWidth={true} />
        </div>
      </div>
    );
  },
};
