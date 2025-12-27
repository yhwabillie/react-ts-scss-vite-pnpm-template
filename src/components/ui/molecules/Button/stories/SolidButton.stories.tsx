import Button from '@/components/ui/molecules/Button/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';
import Icon from '../../../atoms/Icon/Icon';
import RingSpinner from '../../../atoms/Spinner/LoadingSpinner/RingSpinner';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  SpecimenCell,
  SpecimenGroup,
  SpecimenRow,
  SpecimenWrapper,
} from '@/components/ui/guide/Specimen';
import AnatomyWrapper from '@/components/ui/guide/AnatomyWrapper';
import { GuideWrapper, GuideCell, GuideRow, GuideGroup } from '@/components/ui/guide/Guide';

const meta = {
  title: 'UI/Molecules/Button/Solid',
  component: Button,
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
    fullWidth: {
      control: 'boolean',
      description: '부모 요소의 너비를 100% 채울지 여부입니다.',
      table: {
        category: 'Layout',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // Content (아이콘 및 텍스트)
    children: {
      control: 'text',
      description: '버튼 내부 텍스트 콘텐츠입니다.',
      table: { category: 'Content' },
    },
    startIcon: {
      description: '텍스트 왼쪽에 배치될 아이콘입니다.',
      table: { category: 'Content' },
    },
    endIcon: {
      description: '텍스트 오른쪽에 배치될 아이콘입니다.',
      table: { category: 'Content' },
    },
    startSpinner: {
      description: '텍스트 왼쪽에 배치될 로딩 스피너입니다.',
      table: { category: 'Content' },
    },
    endSpinner: {
      description: '텍스트 오른쪽에 배치될 로딩 스피너입니다.',
      table: { category: 'Content' },
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

    // Etc
    className: {
      control: 'text',
      table: { category: 'Etc' },
    },
  },

  args: {
    variant: 'solid',
    color: 'primary',
    size: 'xl',
    shape: 'rounded',
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
    const { t } = useTranslation();
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    // 버튼의 다양한 상태를 정의한 데이터 배열
    const variations = [
      { id: 'default', props: {} },
      {
        id: 'withIcon',
        props: {
          startIcon: (
            <Icon
              name='chevron-left'
              className='icon'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          ),
        },
      },
      {
        id: 'withSpinner',
        // 컬러별로 적절한 스피너 색상 주입
        getDynamicProps: (color: any) => ({
          startSpinner: (
            <RingSpinner
              size={args.size || 'md'}
              variant='closed-ring'
              color={args.variant === 'solid' ? `${color}-solid` : color}
            />
          ),
        }),
      },
      { id: 'disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => (
          <SpecimenGroup key={color} title={color}>
            {variations.map(({ id, props, getDynamicProps }) => {
              const variationProps = getDynamicProps ? getDynamicProps(color) : props;

              return (
                <SpecimenCell key={`${color}-${id}`}>
                  <Button {...args} color={color} {...variationProps}>
                    {t('hello')}
                  </Button>
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
    const { t } = useTranslation();

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
          const uniqueId = `button-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <SpecimenGroup key={state.label} title={state.label}>
              <SpecimenRow>
                <Button {...args} className={state.class} {...state.props} id={uniqueId}>
                  {t('hello')}
                </Button>
                <Button
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={uniqueId}
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
          '다섯 가지 표준 사이즈(XS ~ XL)에 따른 버튼의 크기 변화와 내부 요소의 비율을 확인합니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();
    const currentColor = args.color || 'primary';
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    // 버튼의 다양한 상태를 정의한 데이터 배열
    const variations = [
      { id: 'default', props: {} },
      {
        id: 'startIcon',
        props: { startIcon: <Icon name='chevron-left' className='icon' strokeWidth={2.5} /> },
      },
      {
        id: 'endIcon',
        props: { endIcon: <Icon name='chevron-right' className='icon' strokeWidth={2.5} /> },
      },
      {
        id: 'startSpinner',
        // 렌더링 시점에 size를 인자로 받아 동적 props 생성
        getDynamicProps: (size: 'xl' | 'lg' | 'md' | 'sm' | 'xs') => ({
          startSpinner: (
            <RingSpinner
              size={size} // 버튼 크기에 맞춤
              variant='closed-ring'
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
            />
          ),
        }),
      },
      {
        id: 'endSpinner',
        getDynamicProps: (size: 'xl' | 'lg' | 'md' | 'sm' | 'xs') => ({
          endSpinner: (
            <RingSpinner
              size={size}
              variant='closed-ring'
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
            />
          ),
        }),
      },
    ];

    return (
      <GuideGroup>
        {sizeOptions.map(size => (
          <GuideRow key={size} direction='column'>
            {variations.map(({ id, props, getDynamicProps }) => {
              // 정적 props와 동적 props를 합침
              const variationProps = getDynamicProps ? getDynamicProps(size) : props;

              return (
                <GuideCell key={`${size}-${id}`} caption={id === 'default' ? size : undefined}>
                  <Button {...args} size={size} {...variationProps}>
                    {t('hello')}
                  </Button>
                </GuideCell>
              );
            })}
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story: '버튼의 모서리 곡률(Square, Rounded, Pill)에 따른 디자인 변화를 확인합니다.',
      },
    },
  },
  render: args => {
    const { t } = useTranslation();
    const currentColor = args.color || 'primary';
    const shapeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];

    // 버튼의 다양한 상태를 정의한 데이터 배열
    const variations = [
      { id: 'default', props: {} },
      {
        id: 'startIcon',
        props: { startIcon: <Icon name='chevron-left' className='icon' strokeWidth={2.5} /> },
      },
      {
        id: 'endIcon',
        props: { endIcon: <Icon name='chevron-right' className='icon' strokeWidth={2.5} /> },
      },
      {
        id: 'startSpinner',
        props: {
          startSpinner: (
            <RingSpinner
              size='xl'
              variant='closed-ring'
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
            />
          ),
        },
      },
      {
        id: 'endSpinner',
        props: {
          endSpinner: (
            <RingSpinner
              size='xl'
              variant='closed-ring'
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
            />
          ),
        },
      },
    ];

    return (
      <GuideGroup>
        {shapeOptions.map(shape => (
          <GuideRow key={shape} direction='column'>
            {variations.map(({ id, props }) => (
              <GuideCell key={`${shape}-${id}`} caption={id === 'default' ? shape : undefined}>
                <Button {...args} shape={shape} {...props}>
                  {t('hello')}
                </Button>
              </GuideCell>
            ))}
          </GuideRow>
        ))}
      </GuideGroup>
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
    const currentColor = args.color || 'primary';

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
          startIcon: (
            <RingSpinner
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
              size={args.size || 'md'}
              variant='closed-ring'
            />
          ),
        },
      },
      {
        label: 'Right Spinner',
        props: {
          endIcon: (
            <RingSpinner
              color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
              size={args.size || 'md'}
              variant='closed-ring'
            />
          ),
        },
      },
    ];

    return (
      <GuideRow direction='row'>
        {cases.map(item => (
          <GuideCell key={item.label} caption={item.label}>
            <Button {...args} {...item.props}>
              {t('hello')}
            </Button>
          </GuideCell>
        ))}
      </GuideRow>
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
      <AnatomyWrapper title='부모 요소 width: 500px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '500px' }}>
            <Button {...args} fullWidth={true}>
              {t('Full Width Button')}
            </Button>
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
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
    fullWidth: true,
  },
  render: args => {
    const currentColor = args.color || 'primary';

    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <AnatomyWrapper title='부모 요소 width: 200px' style={{ width: '200px' }}>
          <SpecimenRow>
            <SpecimenCell>
              <Button
                {...args}
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
            </SpecimenCell>
          </SpecimenRow>
        </AnatomyWrapper>
        <AnatomyWrapper title='부모 요소 width: 200px' style={{ width: '200px' }}>
          <SpecimenRow>
            <SpecimenCell>
              <Button
                {...args}
                endSpinner={
                  <RingSpinner
                    color={args.variant === 'solid' ? `${currentColor}-solid` : currentColor}
                    size='xl'
                    variant='closed-ring'
                  />
                }
              />
            </SpecimenCell>
          </SpecimenRow>
        </AnatomyWrapper>
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
      <GuideWrapper title='※ 아래 버튼은 HTML `&lt;a&gt;` 태그로 렌더링됩니다.'>
        <Button {...args} />
      </GuideWrapper>
    );
  },
};
