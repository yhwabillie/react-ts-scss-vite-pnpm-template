import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from '@/components/ui/atoms/Checkbox/Checkbox';
import {
  SpecimenCell,
  SpecimenGroup,
  SpecimenRow,
  SpecimenWrapper,
} from '@/components/ui/guide/Specimen';

const meta = {
  title: 'UI/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox 컴포넌트는 다중 선택이 필요한 상황이나 약관 동의 등 상태의 온/오프를 제어할 때 사용합니다. <br />' +
          'SVG의 stroke 애니메이션을 활용하여 시각적으로 부드러운 체크 피드백을 제공합니다.',
      },
    },
  },

  argTypes: {
    // Identification
    id: {
      control: 'text',
      description: '컴포넌트의 고유 ID입니다. 미지정 시 내부적으로 생성됩니다.',
      table: { category: 'Identification' },
    },
    name: {
      control: 'text',
      description: '데이터 식별을 위한 필수 속성입니다.',
      table: { category: 'Identification' },
    },
    htmlFor: {
      control: 'text',
      description: `
라벨(\`label\`)과 입력창(\`input\`)을 연결하는 속성입니다. 
**ID와 일치**시켜야 하며, 이를 통해 라벨 텍스트를 클릭해도 체크박스가 선택되도록 **클릭 범위를 확장**해 줍니다.
    `,
      table: { category: 'Identification' },
    },

    // Control
    checked: {
      control: 'boolean',
      description: `
**제어(Controlled) 모드**를 위한 속성입니다. 
외부 상태에 의해 체크 여부가 결정되며, \`onChange\`와 함께 사용하여 상태를 직접 관리해야 할 때 사용합니다.
    `,
      table: { category: 'Control' },
    },
    defaultChecked: {
      control: 'boolean',
      description: `
**비제어(Uncontrolled) 모드**를 위한 속성입니다. 
초기 렌더링 시의 체크 여부만 설정하며, 이후의 상태 변화는 컴포넌트 내부에서 자체적으로 관리됩니다.
    `,
      table: { category: 'Control' },
    },
    onChange: {
      description: `
체크 상태가 변경될 때 호출되는 콜백 함수입니다. 
사용자의 입력으로 인해 변화된 새로운 체크 상태를 이벤트 객체를 통해 전달합니다.
    `,
      table: { category: 'Control' },
    },

    // States
    disabled: {
      control: 'boolean',
      description: '비활성화 상태 여부를 결정합니다.',
      table: { category: 'States' },
    },

    // Styles
    color: {
      control: 'select',
      description: '디자인 시스템에 정의된 테마 색상을 적용합니다.',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      description: 'Checkbox의 크기를 조절합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Content
    label: {
      control: 'text',
      description: `
컴포넌트 내부에 표시될 **라벨 텍스트**입니다. 
\`as="label"\`인 상태에서 이 속성을 사용하면 별도의 외부 라벨 없이도 **웹 접근성(WCAG)** 기준을 충족하며 클릭 범위가 자동으로 확보됩니다.
      `,
      table: { category: 'Content' },
    },

    // Etc
    as: {
      control: 'text',
      description: '컴포넌트의 시맨틱 태그를 변경할 수 있습니다.',
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      description: '외부 커스텀 스타일을 위한 클래스명입니다.',
      table: { category: 'Etc' },
    },
  },
  args: {
    color: 'primary',
    size: 'xl',
    label: 'standalone형 체크박스',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본 사용 예시
 * 체크박스의 기본적인 외형과 동작을 확인합니다.
 * 스토리북 자동 문서화 환경에서 발생할 수 있는 ID 중복 문제를 방지하기 위해 랜덤 ID를 생성하여 적용합니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {
    name: 'checkbox-base-group',
    defaultChecked: true,
  },
  render: args => {
    /** * Storybook Autodocs에서는 같은 스토리가 여러 번 렌더링될 수 있으므로,
     * 각 인스턴스가 고유한 name과 id를 갖도록 랜덤값을 활용하거나
     * 고유한 접미사를 붙여줌.
     */
    const uniqueId = `checkbox-${Math.random().toString(36).slice(2, 7)}`;

    return <Checkbox {...args} id={uniqueId} name={uniqueId} htmlFor={uniqueId} />;
  },
};

/**
 * 테마 색상 적용
 * 브랜드 컬러 및 상태 컬러(성공, 경고, 위험 등)에 따른 체크박스의 시각적 변화를 확인합니다.
 */
export const Colors: Story = {
  args: {
    name: 'checkbox-color-group',
  },
  render: args => {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;

    return (
      <SpecimenWrapper>
        {colors.map(color => {
          const uniqueId = `checkbox-color-${color}`;

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <SpecimenCell caption='ON'>
                  <Checkbox
                    {...args}
                    color={color}
                    id={`${uniqueId}-on`}
                    name={`${uniqueId}-on`}
                    defaultChecked
                  />
                </SpecimenCell>
                <SpecimenCell caption='OFF'>
                  <Checkbox
                    {...args}
                    color={color}
                    id={`${uniqueId}-off`}
                    name={`${uniqueId}-off`}
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 크기 변주
 * 다섯 가지 사이즈(XL ~ XS) 구성을 통해 다양한 레이아웃 환경에 최적화된 크기를 확인합니다.
 */
export const Sizes: Story = {
  args: {
    name: 'checkbox-size-group',
  },
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    return (
      <SpecimenRow>
        {sizes.map(size => {
          // 각 사이즈별로 고유한 ID 생성 (접근성 보장)
          const uniqueId = `checkbox-size-${size}`;

          return (
            <SpecimenCell key={size} caption={size}>
              <Checkbox
                {...args}
                size={size}
                id={uniqueId}
                htmlFor={uniqueId}
                // XL 사이즈일 경우에만 체크된 상태로 렌더링
                defaultChecked={size === 'xl'}
              />
            </SpecimenCell>
          );
        })}
      </SpecimenRow>
    );
  },
};

/**
 * 상태별 UI 확인
 * 일반, 호버, 액티브, 포커스 등 인터랙션 상태와 비활성화(Disabled) 상태의 UI 차이를 비교합니다.
 */
export const States: Story = {
  args: {
    name: 'checkbox-states-group',
  },
  render: args => {
    const states = [
      { label: 'Normal', class: '' },
      { label: 'Hover', class: 'pseudo-hover' },
      { label: 'Active', class: 'pseudo-active' },
      { label: 'Focus', class: 'pseudo-focus-visible' },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = `checkbox-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <SpecimenGroup key={state.label} title={state.label}>
              <SpecimenRow>
                <Checkbox
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={`${uniqueId}-checked`}
                  htmlFor={`${uniqueId}-checked`}
                  name={uniqueId}
                  defaultChecked
                />
                <Checkbox
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={`${uniqueId}-unchecked`}
                  htmlFor={`${uniqueId}-unchecked`}
                  name={uniqueId}
                />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};
