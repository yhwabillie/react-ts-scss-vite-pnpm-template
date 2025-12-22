import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '@/components/ui/atoms/Icon/Icon';
import { expect, fn, userEvent, within } from 'storybook/test';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'UI/Molecules/IconButton/Outline',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Solid 버튼은 테마의 핵심 컬러로 배경이 가득 채워진 스타일이며, 화면에서 가장 강조되어야 하는 핵심 동작(Primary Action)에 사용됩니다.',
      },
    },
  },
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'xl',
    shape: 'pill',
    'aria-label': 'outline 아이콘 버튼',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof IconButton>;

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
    return (
      <IconButton
        color={args.color}
        size={args.size}
        variant={args.variant}
        shape={args.shape}
        icon={
          <Icon
            name='chevron-left'
            strokeWidth={2.5}
            strokeLinecap='round'
            strokeLinejoin='round'
            className='icon'
          />
        }
      />
    );
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
                <IconButton
                  {...args}
                  className={state.class}
                  {...state.props}
                  icon={
                    <Icon
                      name='chevron-left'
                      strokeWidth={2.5}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='icon'
                    />
                  }
                />
                <IconButton
                  {...args}
                  className={state.class}
                  {...state.props}
                  icon={
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
            <IconButton
              {...args}
              size={size}
              icon={
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
        ))}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <p style={{ fontSize: '12px', color: '#333' }}>
          ※ 아래 버튼은 HTML `&lt;a&gt;` 태그로 렌더링됩니다.
        </p>
        <IconButton
          {...args}
          icon={
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
    );
  },
};
