import Button from '@/components/ui/molecules/Button/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';
import Icon from '../../../atoms/Icon/Icon';
import RingSpinner from '../../../atoms/Spinner/LoadingSpinner/RingSpinner';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Molecules/Button/Primary/Outline',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Outline 버튼은 흰색 배경에 테두리가 있는 스타일로, 보조 동작(Secondary Action)에 주로 사용됩니다.',
      },
    },
  },
  args: {
    variant: 'outline',
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    onClick: fn(),
  },
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await step('버튼이 정상적으로 렌더링되고 클릭되는지 확인합니다.', async () => {
      await userEvent.click(button);
      await expect(button).toBeInTheDocument();
    });
  },
  render: args => {
    const { t } = useTranslation();
    return <Button {...args}>{t('hello')}</Button>;
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
      { label: 'Disabled', props: { disabled: true } },
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
                <Button {...args} className={state.class} {...state.props}>
                  {t('hello')}
                </Button>
                <Button
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
                </Button>
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
            <Button {...args} size={size}>
              {t('hello')}
            </Button>
            <Button
              {...args}
              size={size}
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
            </Button>
            <Button
              {...args}
              size={size}
              endIcon={
                <Icon
                  name='chevron-right'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='icon'
                />
              }
            >
              {t('hello')}
            </Button>
            <Button
              {...args}
              size={size}
              startSpinner={<RingSpinner color='primary' size={size} variant='closed-ring' />}
            >
              {t('hello')}
            </Button>
            <Button
              {...args}
              size={size}
              endSpinner={<RingSpinner color='primary' size={size} variant='closed-ring' />}
            >
              {t('hello')}
            </Button>
          </div>
        ))}
      </div>
    );
  },
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼의 모서리 곡률(Square, Rounded, Pill)에 따른 디자인 변화를 확인합니다. 브랜드 가이드라인에 맞춰 선택할 수 있습니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();

    const sahpeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {sahpeOptions.map(shape => (
          <div
            key={shape}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>
              {shape.toUpperCase()}
            </span>
            <Button {...args} shape={shape}>
              {t('hello')}
            </Button>
            <Button
              {...args}
              shape={shape}
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
            </Button>
            <Button
              {...args}
              shape={shape}
              endIcon={
                <Icon
                  name='chevron-right'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='icon'
                />
              }
            >
              {t('hello')}
            </Button>
            <Button
              {...args}
              shape={shape}
              startSpinner={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
            >
              {t('hello')}
            </Button>
            <Button
              {...args}
              shape={shape}
              endSpinner={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
            >
              {t('hello')}
            </Button>
          </div>
        ))}
      </div>
    );
  },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '아이콘이나 스피너(로딩 상태)와 결합된 형태를 확인합니다. 텍스트와 시각적 요소가 조화롭게 배치되는지 검수할 수 있습니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();

    const cases = [
      {
        label: 'Left Icon',
        props: {
          startIcon: (
            <Icon
              name='chevron-left'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='icon'
            />
          ),
        },
      },
      {
        label: 'Right Icon',
        props: {
          endIcon: (
            <Icon
              name='chevron-right'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='icon'
            />
          ),
        },
      },
      {
        label: 'Left Spinner',
        props: {
          startIcon: <RingSpinner color='primary' size={args.size || 'md'} variant='closed-ring' />,
        },
      },
      {
        label: 'Right Spinner',
        props: {
          endIcon: <RingSpinner color='primary' size={args.size || 'md'} variant='closed-ring' />,
        },
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          {cases.map(item => (
            <div
              key={item.label}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
            >
              {/* 캡션 표시 */}
              <span style={{ fontSize: '11px', color: '#888', fontWeight: '600' }}>
                {item.label}
              </span>

              {/* 버튼 렌더링 */}
              <Button {...args} {...item.props}>
                {t('hello')}
              </Button>
            </div>
          ))}
        </div>
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
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
          Container Width: 500px
        </p>
        <Button {...args} fullWidth={true}>
          {t('Full Width Button')}
        </Button>
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
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
            Container Width: 200px
          </p>
          <Button {...args} fullWidth={true} />
        </div>
        <div
          style={{
            width: '200px',
            padding: '20px',
            border: '1px dashed #ccc',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
            Container Width: 200px
          </p>
          <Button
            {...args}
            fullWidth={true}
            startIcon={
              <Icon
                name='chevron-left'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
                className='icon'
              />
            }
          />
        </div>
        <div
          style={{
            width: '200px',
            padding: '20px',
            border: '1px dashed #ccc',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
            Container Width: 200px
          </p>
          <Button
            {...args}
            fullWidth={true}
            endSpinner={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
          />
        </div>
      </div>
    );
  },
};

export const PolymorphicLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼의 스타일을 유지하면서 `<a>` 태그로 렌더링하는 케이스입니다. 외부 링크 이동이나 SEO 최적화가 필요한 경우 사용합니다.',
      },
    },
  },
  args: {
    // 버튼 컴포넌트가 'as' props를 지원한다고 가정합니다.
    as: 'a',
    href: 'https://www.google.com',
    target: '_blank',
    title: '새 창 열기',
    rel: 'noopener noreferrer',
    children: '구글로 이동 (Anchor Tag)',
  },
  // Interactions 패널을 통해 실제 태그가 <a>인지 자동 검증
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const linkButton = canvas.getByRole('link'); // <a> 태그는 role이 'link'입니다.

    await step('렌더링된 요소가 button이 아닌 a 태그인지 확인합니다.', async () => {
      await expect(linkButton.tagName).toBe('A');
      await expect(linkButton).toHaveAttribute('href', 'https://www.google.com');
    });
  },
  render: args => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '12px', color: '#999' }}>
          ※ 아래 버튼은 HTML `&lt;a&gt;` 태그로 렌더링됩니다.
        </p>
        <Button {...args} />
      </div>
    );
  },
};
