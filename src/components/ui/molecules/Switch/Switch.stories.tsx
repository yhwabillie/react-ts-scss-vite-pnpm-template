import type { Meta, StoryObj } from '@storybook/react-vite';
import Switch from '@/components/ui/molecules/Switch/Switch';
import Label from '../../atoms/Label/Label';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { GuideWrapper } from '../../guide/Guide';

const meta = {
  title: 'UI/Molecules/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Switch**는 시스템 설정이나 특정 기능의 활성화 여부를 즉각적으로 전환할 때 사용하는 토글 컴포넌트입니다. <br /><br />' +
          '• 상태 변경 시 별도의 확인 단계 없이 즉시 시스템에 반영되는 시나리오에 적합 <br />' +
          '• 핸들 내부에 아이콘 또는 상태 피드백을 포함하여 On/Off 상태를 직관적으로 인지 <br />' +
          '• 부모 상태에 의존하는 제어(Controlled) 방식과 자체 상태를 가지는 비제어(Uncontrolled) 방식을 모두 지원',
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

    // Control
    value: {
      control: 'boolean',
      description: `
**제어(Controlled) 모드**를 위한 속성입니다. 
외부(부모) 상태에 의해 스위치의 On/Off가 결정되며, \`onChange\`와 함께 사용하여 상태를 직접 관리해야 할 때 사용합니다.
    `,
      table: { category: 'Control' },
    },
    defaultChecked: {
      control: 'boolean',
      description: `
**비제어(Uncontrolled) 모드**를 위한 속성입니다. 
초기 렌더링 시의 On/Off 상태만 설정하며, 이후의 토글 동작은 컴포넌트 내부에서 자체적으로 관리됩니다.
    `,
      table: { category: 'Control' },
    },
    onChange: {
      description: `
스위치 상태가 변경될 때 호출되는 콜백 함수입니다. 
사용자의 입력(클릭)으로 인해 변화된 새로운 상태값을 이벤트 객체를 통해 전달합니다.
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
      options: ['primary', 'secondary', 'tertiary'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      description: 'Switch 크기를 조절합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    labelPlacement: {
      control: 'inline-radio',
      options: ['start', 'end'],
      description: `
라벨(\`children\`)이 스위치를 기준으로 배치되는 위치를 결정합니다.
- **start**: 라벨이 스위치 **왼쪽**에 배치됩니다. (주로 독립된 설정 항목에 사용)
- **end**: 라벨이 스위치 **오른쪽**에 배치됩니다. (주로 리스트 형태의 UI에 사용)
    `,
      table: {
        category: 'Styles',
        defaultValue: { summary: 'end' },
        type: { summary: "'start' | 'end'" },
      },
    },

    // Etc
    children: {
      control: 'text',
      description: `
컴포넌트 내부에 렌더링될 콘텐츠입니다.
- **Text**: 단순한 라벨 문자열을 입력할 수 있습니다.
- **Component**: 다른 리액트 컴포넌트를 주입할 수 있습니다.
    `,
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
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 기본 명세입니다.
 * 단독 사용 시의 형태를 확인하며, 접근성을 위해 내부적으로 고유 ID를 생성하여 관리합니다.
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
    name: 'swtich-base-group',
    defaultChecked: true,
  },
  render: args => {
    /** * Storybook Autodocs에서는 같은 스토리가 여러 번 렌더링될 수 있으므로,
     * 각 인스턴스가 고유한 name과 id를 갖도록 랜덤값을 활용하거나
     * 고유한 접미사를 붙여줌.
     */
    const uniqueId = `switch-${Math.random().toString(36).slice(2, 7)}`;

    return <Switch {...args} id={uniqueId} name={`${uniqueId}-name`} />;
  },
};

/**
 * 서비스 브랜드 및 상황별 위계에 따른 컬러 시스템입니다.
 * 테마(Tech/Warm)와 라이트/다크 모드 환경에 최적화된 토큰을 사용하여 On 상태의 시각적 강조를 제어합니다.
 */
export const Colors: Story = {
  args: {
    name: 'switch-color-group',
  },
  render: args => {
    const colors = ['primary', 'secondary', 'tertiary'] as const;

    return (
      <SpecimenWrapper>
        {colors.map(color => {
          const uniqueId = `switch-color-${color}`;

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <SpecimenCell caption='ON'>
                  <Switch
                    {...args}
                    color={color}
                    id={`${uniqueId}-on`}
                    name={`${uniqueId}-on`}
                    defaultChecked
                  />
                </SpecimenCell>
                <SpecimenCell caption='OFF'>
                  <Switch {...args} color={color} id={`${uniqueId}-off`} name={`${uniqueId}-off`} />
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
 * 다양한 레이아웃 밀도에 대응하는 5단계 표준 크기 규격입니다.
 * 폼 요소의 크기나 인접 텍스트의 높이에 맞춰 XS부터 XL까지 선택할 수 있습니다.
 */
export const Sizes: Story = {
  args: {
    name: 'switch-size-group',
  },
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    return (
      <SpecimenRow>
        {sizes.map(size => {
          // 각 사이즈별로 고유한 ID 생성 (접근성 보장)
          const uniqueId = `switch-size-${size}`;

          return (
            <SpecimenCell key={size} caption={size}>
              <Switch
                {...args}
                size={size}
                id={uniqueId}
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
 * 상호작용에 따른 시각적 상태(Hover, Active, Focus, Disabled)를 검수합니다.
 * 특히 비활성화(Disabled) 상태에서 사용자가 조작 불가능함을 명확히 인지할 수 있도록 설계되었습니다.
 */
export const States: Story = {
  args: {
    name: 'switch-states-group',
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
          const uniqueId = `switch-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <SpecimenGroup key={state.label} title={state.label}>
              <SpecimenRow>
                <Switch
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={`${uniqueId}-checked`}
                  name={uniqueId}
                  defaultChecked
                />
                <Switch
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={`${uniqueId}-unchecked`}
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

/**
 * 라벨과 스위치의 상대적 배치 옵션입니다.
 * - **start**: 독립된 설정 항목이나 설명이 긴 레이아웃에 권장됩니다.
 * - **end**: 리스트 형태의 옵션 선택 UI나 일반적인 체크박스 대용으로 적합합니다.
 */
export const Placement: Story = {
  args: {
    name: 'switch-placement-group',
  },
  render: args => {
    return (
      <SpecimenRow>
        {/* Label Placement: Start */}
        <GuideWrapper title='PLACEMENT: START'>
          <Switch {...args} labelPlacement='start' id='placement-start' defaultChecked>
            <AnatomyWrapper minimal={true}>
              <Label size={args.size}>왼쪽 라벨</Label>
            </AnatomyWrapper>
          </Switch>
        </GuideWrapper>

        {/* Label Placement: End */}
        <GuideWrapper title='PLACEMENT: END'>
          <Switch {...args} labelPlacement='end' id='placement-end'>
            <AnatomyWrapper minimal={true}>
              <Label size={args.size}>오른쪽 라벨</Label>
            </AnatomyWrapper>
          </Switch>
        </GuideWrapper>
      </SpecimenRow>
    );
  },
};
