import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '@/components/ui/atoms/Icon/Icon';
import { expect, fn, userEvent, within } from 'storybook/test';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import {
  SpecimenCell,
  SpecimenGroup,
  SpecimenRow,
  SpecimenWrapper,
} from '@/components/ui/guide/Specimen';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '@/components/ui/guide/Guide';

const meta: Meta<typeof IconButton> = {
  title: 'UI/Molecules/Button/IconButton/Outline',
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
  argTypes: {
    // Appearance (가장 많이 건드리는 핵심 스타일)
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: '버튼의 시각적 형태를 결정합니다.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      description: '디자인 시스템에 정의된 의미론적(Semantic) 색상을 적용합니다.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    icon: {
      table: {
        category: 'Appearance',
      },
    },

    // Layout & Geometry
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '버튼의 높이와 패딩을 결정합니다.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      description: '버튼 모서리의 굴곡(Radius)을 조절합니다.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'rounded' },
      },
    },

    // Interaction & Behavior (새로운 카테고리)
    as: {
      control: 'select',
      options: ['button', 'a', 'div', 'span'],
      description: '컴포넌트가 렌더링될 HTML 태그를 지정합니다.',
      table: {
        category: 'Behavior',
        type: { summary: 'ElementType' },
        defaultValue: { summary: 'button' },
      },
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 호출되는 함수입니다.',
      table: {
        category: 'Behavior',
        type: { summary: 'function' },
      },
    },

    // Link
    href: {
      control: 'text',
      table: { category: 'Link' },
    },
    target: {
      control: 'text',
      table: { category: 'Link' },
    },

    // Etc
    'aria-label': {
      control: 'text',
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      table: { category: 'Etc' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'xl',
    shape: 'pill',
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
        ariaLabel='outline 아이콘 버튼'
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

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '디자인 시스템에 정의된 6가지 시멘틱 컬러(Primary, Secondary, Tertiary, Success, Warning, Danger)를 확인합니다. 각 컬러는 해당 상태의 의미를 전달합니다.',
      },
    },
  },
  args: {
    size: 'lg',
  },
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    // 버튼의 다양한 상태를 정의한 데이터 배열
    const variations = [{ id: 'default' }];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => (
          <SpecimenGroup key={color} title={color}>
            {variations.map(({ id }) => {
              return (
                <SpecimenCell key={`${color}-${id}`}>
                  <IconButton
                    {...args}
                    color={color}
                    ariaLabel='outline 아이콘 버튼'
                    icon={
                      <Icon
                        className='icon'
                        name='chevron-left'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2.5}
                      />
                    }
                  />
                </SpecimenCell>
              );
            })}
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
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
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = `icon-button-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <SpecimenGroup key={state.label} title={state.label}>
              <SpecimenRow>
                <IconButton
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={uniqueId}
                  ariaLabel='outline 아이콘 버튼'
                  icon={
                    <Icon
                      className='icon'
                      name='chevron-left'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2.5}
                    />
                  }
                />
                <IconButton
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={uniqueId}
                  ariaLabel='outline 아이콘 버튼'
                  icon={
                    <Icon
                      className='icon'
                      name='chevron-left'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2.5}
                    />
                  }
                />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '다섯 가지 표준 사이즈(XS ~ XL)에 따른 아이콘 버튼의 크기 변화를 확인합니다. 각 사이즈에 맞춰 내부 아이콘의 비율과 패딩이 최적화되어 있는지 검수합니다.',
      },
    },
  },
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    // 공통 아이콘 설정 (필요 시 사이즈별로 strokeWidth 등을 분기 처리할 수 있습니다)
    const renderIcon = (size: string) => (
      <Icon
        name='chevron-left'
        strokeWidth={size === 'xs' || size === 'sm' ? 2 : 2.5} // 작은 사이즈에서 가독성을 위한 조정 예시
        strokeLinecap='round'
        strokeLinejoin='round'
        className='icon'
      />
    );

    return (
      <GuideGroup>
        <GuideRow direction='row'>
          {sizeOptions.map(size => (
            <GuideCell key={size} caption={size}>
              <IconButton
                {...args}
                size={size}
                icon={renderIcon(size)}
                ariaLabel='outline 아이콘 버튼'
              />
            </GuideCell>
          ))}
        </GuideRow>
      </GuideGroup>
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
      <GuideWrapper
        title='※ 아래 버튼은 HTML `&lt;a&gt;` 태그로 렌더링됩니다.'
        style={{ alignItems: 'center' }}
      >
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
      </GuideWrapper>
    );
  },
};
