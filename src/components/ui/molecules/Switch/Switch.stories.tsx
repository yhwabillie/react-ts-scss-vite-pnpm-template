import type { Meta, StoryObj } from '@storybook/react-vite';
import Switch from '@/components/ui/molecules/Switch/Switch';
import Label from '../../atoms/Label/Label';

const meta = {
  title: 'UI/Molecules/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Switch 컴포넌트는 두 가지 상태(On/Off)를 전환할 때 사용합니다. <br />' +
          '내부의 핸들에 아이콘 피드백을 포함하여 현재 상태를 더욱 명확하게 인지할 수 있도록 설계되었습니다.',
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
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
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
 * 시스템 설정이나 특정 기능의 활성화 여부를 즉각적으로 제어하는 스위치 요소입니다.
 * 체크박스와 유사하게 단독 또는 세트 내에서 사용되나, 주로 '확인' 버튼 없이
 * 상태를 즉시 반영해야 하는 On/Off 토글 시나리오에 최적화되어 있습니다.
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

    return <Switch {...args} id={uniqueId} name={uniqueId} />;
  },
};

/**
 * 서비스의 브랜드 성격에 따른 테마 시스템과 6가지 표준 색상 명세를 확인합니다.
 * * **테마 구성:**
 * - **Tech Theme:** 차갑고 신뢰감 있는 푸른 계열의 메인 컬러 시스템
 * - **Warm Theme:** 따뜻하고 친근한 노란 계열의 메인 컬러 시스템
 * * 각 테마는 **Light 모드**와 **Dark 모드** 환경에 최적화된 고유의 컬러 토큰을 가집니다.
 * 이 섹션에서는 각 테마 내에서 의미론적으로 정의된 6가지 색상(Primary ~ Danger)이
 * 토글 상태(On/Off)에 따라 어떻게 시각적으로 표현되는지 검증할 수 있습니다.
 */
export const Colors: Story = {
  args: {
    name: 'switch-color-group',
  },
  render: args => {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {colors.map(color => {
          const uniqueId = `switch-color-${color}`;

          return (
            <div
              key={color}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
              }}
            >
              {/* 왼쪽 라벨: 테마 명칭 */}
              <span
                style={{
                  width: '100px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#666',
                  textTransform: 'capitalize',
                }}
              >
                {color}
              </span>

              {/* Switch 조합: Checked & Unchecked */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Switch
                    {...args}
                    color={color}
                    id={`${uniqueId}-on`}
                    name={`${uniqueId}-on`}
                    defaultChecked
                  />
                  <span style={{ fontSize: '10px', color: '#999' }}>On</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Switch {...args} color={color} id={`${uniqueId}-off`} name={`${uniqueId}-off`} />
                  <span style={{ fontSize: '10px', color: '#999' }}>Off</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

/**
 * 5가지 표준 사이즈(XS ~ XL)에 따른 크기 변화를 확인합니다.
 */
export const Sizes: Story = {
  args: {
    name: 'switch-size-group',
  },
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {sizes.map(size => {
          // 각 사이즈별로 고유한 ID 생성 (접근성 보장)
          const uniqueId = `switch-size-${size}`;

          return (
            <div
              key={size}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <Switch
                {...args}
                size={size}
                id={uniqueId}
                // XL 사이즈일 경우에만 체크된 상태로 렌더링
                defaultChecked={size === 'xl'}
              />
              <span style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                {size.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
};

/**
 * Switch 컴포넌트의 상호작용 상태에 따른 시각적 피드백을 확인합니다. <br>
 * 단순한 On/Off 전환을 넘어, 마우스 오버(Hover), 클릭 중(Active), 키보드 접근(Focus),
 * 사용 불가(Disabled) 상태가 각 토글 상황에서 어떻게 표현되는지 정의합니다. <br>
 * pseudo-class를 통해 실제 인터랙션 없이도 디자인 시스템의 상태별 명세를 한눈에 검증할 수 있습니다.
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
      <>
        {states.map((state, index) => {
          const isLast = index === states.length - 1;
          const uniqueId = `switch-${Math.random().toString(36).slice(2, 7)}`;

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

              {/* switch 조합들 */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <Switch
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={uniqueId}
                  name={uniqueId}
                  defaultChecked
                />
                <Switch
                  {...args}
                  className={state.class}
                  {...state.props}
                  id={uniqueId}
                  name={uniqueId}
                />
              </div>
            </div>
          );
        })}
      </>
    );
  },
};

/**
 * `labelPlacement`와 `children`을 활용하여 스위치와 라벨의 상대적 위치를 결정합니다.
 * - **start**: 라벨이 스위치의 왼쪽에 배치되어, 사용자가 설정을 읽고 스위치를 조작하는 흐름에 적합합니다.
 * - **end**: 라벨이 스위치의 오른쪽에 배치되어, 일반적인 체크 리스트나 옵션 선택 UI에 적합합니다.
 */
export const Placement: Story = {
  args: {
    name: 'switch-placement-group',
  },
  render: args => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '300px' }}>
        {/* Label Placement: Start */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ margin: 'auto', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>
            PLACEMENT: START
          </span>
          <div
            style={{
              margin: 'auto',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
            }}
          >
            <Switch {...args} labelPlacement='start' id='placement-start' defaultChecked>
              <Label size={args.size}>왼쪽 라벨</Label>
            </Switch>
          </div>
        </div>

        {/* Label Placement: End */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ margin: 'auto', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>
            PLACEMENT: END
          </span>
          <div
            style={{
              margin: 'auto',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
            }}
          >
            <Switch {...args} labelPlacement='end' id='placement-end'>
              <Label size={args.size}>오른쪽 라벨</Label>
            </Switch>
          </div>
        </div>
      </div>
    );
  },
};
