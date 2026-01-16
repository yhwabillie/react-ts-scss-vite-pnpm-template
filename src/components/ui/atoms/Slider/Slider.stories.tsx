import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import Slider from './Slider';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';

/**
 * [Slider]
 * 마우스 드래그 및 키보드 화살표 키로 값을 정밀하게 조절할 수 있는 컴포넌트입니다.
 * - **Accessibility**: `role="slider"` 및 ARIA 속성을 준수하여 키보드 제어(Arrow Keys, Home, End)를 지원합니다.
 * - **Step Logic**: 설정된 `step` 단위로 값이 보정되는 자석 효과가 포함되어 있습니다.
 */
const meta = {
  title: 'UI/Molecules/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Slider**는 연속적인 범위 내에서 특정 수치를 선택하거나 조절할 때 사용하는 입력 컨트롤입니다. <br /><br />' +
          '• 마우스 드래그는 물론, 키보드 방향키를 이용한 1단위 미세 조절과 `PageUp/Down`을 통한 큰 단위 이동을 지원합니다. <br />' +
          '• 조작 시 썸(Thumb)의 상태 변화와 트랙(Track)의 하이라이트를 통해 현재 선택된 영역을 명확히 표시합니다. <br />' +
          '• `role="slider"` 및 필수 ARIA 속성을 통해 보조 공학 기기 사용자에게 현재 값과 범위를 정확히 전달합니다.',
      },
    },
  },
  args: {
    label: '시스템 볼륨',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
  argTypes: {
    // 💡 1. 기본 정보 (Data)
    label: {
      control: 'text',
      description: '슬라이더의 접근성 레이블 (화면에는 보이지 않지만 필수)',
      table: { category: 'Data' },
    },
    value: {
      control: 'number',
      description: '제어용 현재 값 (Controlled)',
      table: { category: 'Data' },
    },
    defaultValue: {
      control: 'number',
      description: '초기 설정값',
      table: { category: 'Data' },
    },
    min: {
      control: { type: 'number' },
      description: '최소값',
      table: { category: 'Data' },
    },
    max: {
      control: { type: 'number' },
      description: '최대값',
      table: { category: 'Data' },
    },
    step: {
      control: { type: 'number' },
      description: '값의 정밀도/증감 단위',
      table: { category: 'Data' },
    },

    // 💡 2. 스타일 관련 (Styles)
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '테마 색상 클래스를 적용합니다.',
      table: { category: 'Styles' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '슬라이더 크기 (Thumb 및 Track 높이)',
      table: { category: 'Styles' },
    },
    className: {
      control: 'text',
      description: '최상위 요소에 추가할 커스텀 클래스명',
      table: { category: 'Styles' },
    },

    // 💡 3. 인터랙션 & 확장 Props (Interaction)
    onChange: {
      action: 'changed',
      description: '값이 변경될 때 실행되는 콜백 함수',
      table: { category: 'Events' },
    },
    inputProps: {
      control: 'object',
      description: '내부 Native Input 요소에 직접 전달할 속성들',
      table: { category: 'Interaction' },
    },
    thumbProps: {
      control: 'object',
      description: '내부 Custom Thumb 요소에 직접 전달할 속성들',
      table: { category: 'Interaction' },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 형태의 슬라이더입니다.
 * `useState`를 통해 드래그 시 수치가 실시간으로 업데이트되는 실제 작동 환경을 시뮬레이션합니다.
 */
export const Base: Story = {
  args: {
    size: 'lg',
  },
  render: args => {
    const [val, setVal] = useState(args.defaultValue);

    useEffect(() => {
      setVal(args.defaultValue);
    }, [args.defaultValue]);

    return (
      <Slider
        {...args}
        defaultValue={val}
        onChange={newVal => {
          setVal(newVal);
          args.onChange?.(newVal);
        }}
      />
    );
  },
};

/**
 * 디자인 시스템의 시멘틱 컬러(Primary, Secondary, Tertiary)를 적용합니다.
 * - **Track Highlight**: 선택된 수치만큼 채워지는 트랙의 컬러를 통해 서비스의 브랜드 톤을 투영합니다.
 * - **Contrast**: 슬라이더가 배치될 배경색과 트랙 컬러 간의 명확한 구분이 가능하도록 설계되었습니다.
 */
export const Colors: Story = {
  args: {
    label: '컬러 테마 테스트',
    defaultValue: 50,
    size: 'md',
  },
  render: args => {
    // 각각의 슬라이더가 독립적인 상태를 가질 수 있도록 배열로 관리하거나
    // 단순히 시각적 확인을 위해 고정값 또는 공통 상태를 사용할 수 있습니다.
    const [values, setValues] = useState({
      primary: 30,
      secondary: 50,
      tertiary: 70,
    });

    const handleChange = (color: string) => (val: number) => {
      setValues(prev => ({ ...prev, [color]: val }));
      args.onChange?.(val);
    };

    return (
      <SpecimenGroup>
        <SpecimenCell caption='primary'>
          <Slider
            {...args}
            color='primary'
            value={values.primary}
            onChange={handleChange('primary')}
          />
        </SpecimenCell>
        <SpecimenCell caption='secondary'>
          <Slider
            {...args}
            color='secondary'
            value={values.secondary}
            onChange={handleChange('secondary')}
          />
        </SpecimenCell>
        <SpecimenCell caption='tertiary'>
          <Slider
            {...args}
            color='tertiary'
            value={values.tertiary}
            onChange={handleChange('tertiary')}
          />
        </SpecimenCell>
      </SpecimenGroup>
    );
  },
};

/**
 * 슬라이더는 배치되는 공간의 너비와 디자인 밀도에 따라 5가지 사이즈를 제공합니다.
 * - **Thumb Ergonomics**: 사이즈가 커질수록 조작부(Thumb)의 크기도 함께 커져, 모바일이나 터치 환경에서의 사용성을 보장합니다.
 * - **Track Thickness**: 사이즈에 비례하여 트랙의 두께가 조절되어 시각적 무게감을 맞춥니다.
 */
export const AllSizes: Story = {
  render: args => {
    // 각 사이즈별 독립적인 상태 관리를 위한 헬퍼 컴포넌트
    const SliderItem = ({ size, label, defaultValue }: any) => {
      const [val, setVal] = useState(defaultValue);

      return (
        <SpecimenGroup title={`${size.toUpperCase()} (${label})`}>
          <Slider
            {...args}
            size={size}
            defaultValue={val}
            onChange={newVal => {
              setVal(newVal);
              args.onChange?.(newVal);
            }}
          />
        </SpecimenGroup>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <SliderItem size='xs' label='120px - Narrow Sidebar' defaultValue={20} />
        <SliderItem size='sm' label='180px - Mobile Toolbar' defaultValue={20} />
        <SliderItem size='md' label='240px - Standard Form' defaultValue={20} />
        <SliderItem size='lg' label='320px - Settings Page' defaultValue={20} />
        <SliderItem size='xl' label='480px - Wide Layout' defaultValue={20} />
      </div>
    );
  },
};

/**
 * 사용자의 상호작용 과정에서 발생하는 다양한 시각적 상태를 검증합니다.
 * - **Hover/Focus**: 조작 준비 상태임을 알리는 썸(Thumb) 주변의 글로우 효과를 확인합니다.
 * - **Disabled**: 입력이 제한된 상태임을 명확히 인지시키며, 모든 드래그 및 키보드 이벤트가 차단됩니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      {
        label: 'Hover',
        props: { thumbProps: { className: 'pseudo-hover' } },
      },
      {
        label: 'Focus',
        props: { thumbProps: { className: 'pseudo-focus-visible' } },
      },
      {
        label: 'Active',
        props: { inputProps: { className: 'pseudo-active' } },
      },
      {
        label: 'Disabled',
        props: { inputProps: { disabled: true } },
      },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => (
          <SpecimenGroup key={state.label} title={state.label}>
            <SpecimenRow>
              <div style={{ width: '100%', padding: '2rem 0' }}>
                <Slider
                  {...args}
                  label={`Slider ${state.label}`}
                  defaultValue={30}
                  {...state.props}
                />
              </div>
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * 투명도나 배율 조절 등 소수점 단위의 정밀한 조작이 필요한 케이스입니다.
 * - **Magnet Effect**: 설정된 `step` 단위로 값이 스냅(Snap)되어 데이터의 유효 범위를 벗어나지 않도록 제어합니다.
 */
export const PrecisionStep: Story = {
  args: {
    label: '투명도 조절',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.5,
  },
  render: args => {
    const [val, setVal] = useState(args.defaultValue);
    return (
      <div style={{ width: '300px' }}>
        <Slider
          {...args}
          defaultValue={val}
          onChange={v => {
            setVal(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
};

/**
 * 가격이나 수량 등 넓은 범위를 다룰 때의 레이아웃과 데이터 흐름을 확인합니다.
 * - **Scalability**: 최소/최대값의 간극이 크더라도 트랙 내에서의 상대적 위치가 정확하게 계산되어 렌더링되는지 검증합니다.
 */
export const LargeRange: Story = {
  args: {
    label: '가격 범위',
    min: 1000,
    max: 100000,
    step: 1000,
    defaultValue: 20000,
  },
  render: args => {
    const [val, setVal] = useState(args.defaultValue);
    return (
      <div style={{ width: '500px' }}>
        <Slider
          {...args}
          defaultValue={val}
          onChange={v => {
            setVal(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
};
