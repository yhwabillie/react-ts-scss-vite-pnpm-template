import type { Meta, StoryObj } from '@storybook/react-vite';
import Combobox from './Combobox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { comboboxOptions, comboboxInputProps } from './Combobox.mock';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useId, useState } from 'react';
import Button from '../Button/Button';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import type { OptionBase } from '../OptionItem/OptionItem';

const comboboxOptionsWithoutPlaceholder = comboboxOptions.filter(
  option => option.id !== 'placeholder',
);

/**
 * [Combobox]
 * 사용자의 입력에 따라 옵션을 필터링하고 제안하는 컴포넌트입니다.
 * - **WAI-ARIA**: Combobox 패턴을 준수하며 스크린 리더 검색 결과 안내를 포함합니다.
 * - **Portal**: 드롭다운 메뉴는 부모의 overflow 영향을 받지 않도록 Portal로 렌더링됩니다.
 */
const meta = {
  title: 'UI/Molecules/Combobox/AutoComplete',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Combobox**는 사용자의 입력값에 따라 옵션 목록을 실시간으로 필터링하여 제안하는 자동완성(AutoComplete) 기능을 제공합니다. <br /><br />' +
          '• 방대한 리스트 내에서 텍스트 입력을 통해 원하는 항목을 빠르게 찾을 수 있도록 돕습니다. <br />' +
          '• `role="combobox"`, `aria-autocomplete` 등 표준 속성을 준수하여 키보드 화살표 키와 엔터 키만으로 탐색이 가능합니다.  <br />' +
          '• 드롭다운 목록이 레이어 최상단에 렌더링되어 부모 요소의 `overflow` 설정과 관계없이 항상 온전하게 노출됩니다.',
      },
    },
  },

  argTypes: {
    // --- Styles 카테고리 ---
    variant: {
      description: '컴포넌트의 외형 스타일을 결정합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline'], // 인터페이스 StyleProps와 일치시킴
      table: {
        category: 'Styles',
        type: { summary: "'solid' | 'outline'" },
      },
    },
    color: {
      description: '테마 색상을 설정합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'], // 설계한 컬러셋 반영
      table: {
        category: 'Styles',
        type: { summary: 'Color' },
      },
    },
    size: {
      description: '컴포넌트의 전체적인 크기를 결정합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Styles',
        type: { summary: 'Size' },
      },
    },

    // --- States 카테고리 ---
    disabled: {
      description: '비활성화 여부를 설정합니다.',
      control: 'boolean',
      table: { category: 'States' },
    },
    readOnly: {
      description: '읽기 전용 모드를 설정합니다.',
      control: 'boolean',
      table: { category: 'States' },
    },
    required: {
      description: '필수 입력 여부를 설정합니다.',
      control: 'boolean',
      table: { category: 'States' },
    },

    // --- Contents 카테고리 ---
    options: {
      description: '드롭다운에 표시될 옵션 목록입니다.',
      control: 'object',
      table: {
        category: 'Contents',
        type: { summary: 'OptionBase[]' },
      },
    },
    value: {
      description: '선택된 옵션의 값 (Controlled)',
      control: 'text',
      table: { category: 'Contents' },
    },
    defaultValue: {
      description: '초기 선택값 (Uncontrolled)',
      control: 'text',
      table: { category: 'Contents' },
    },

    // --- Infrastructure 카테고리 (ID, Props 등) ---
    id: {
      description: '컨테이너 요소의 고유 ID입니다.',
      control: 'text',
      table: { category: 'Infrastructure' },
    },
    inputId: {
      description: '내부 input 요소의 고유 ID입니다.',
      control: 'text',
      table: { category: 'Infrastructure' },
    },
    inputProps: {
      description: '내부 input 요소에 전달할 추가 속성들입니다.',
      control: 'object',
      table: { category: 'Infrastructure' },
    },
    role: {
      control: 'text',
      table: { category: 'Infrastructure' },
    },

    // --- Events 카테고리 ---
    onValueChange: {
      description: '값이 변경될 때 호출되는 콜백 함수입니다.',
      action: 'valueChanged',
      table: {
        category: 'Events',
        type: { summary: '(value: string, option?: OptionBase) => void' },
      },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    role: 'combobox',
    options: comboboxOptionsWithoutPlaceholder,
    inputProps: comboboxInputProps,
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 형태의 콤보박스입니다.
 * `updateArgs`를 통해 입력된 값과 스토리북 컨트롤 패널의 상태를 실시간으로 동기화합니다.
 */
export const Base: Story = {
  render: (args, { updateArgs }) => {
    const uniqueId = useId();

    const handleChange = (value: string) => {
      // 선택된 값을 스토리북 패널의 value(또는 inputValue)와 동기화
      updateArgs({ value });
      args.onValueChange?.(value);
    };

    return (
      <Combobox {...args} aria-labelledby={`${uniqueId}-label`} onValueChange={handleChange} />
    );
  },
};

/**
 * 디자인 시스템의 6가지 표준 컬러 테마를 적용하여 시각적 피드백을 검증합니다.
 * - **Focus Feedback**: 인풋 포커스 시의 강조색과 드롭다운 내 아이템의 하이라이트 컬러가 테마에 맞춰 변경되는지 확인합니다.
 * - **Contrast**: 다양한 테마 색상 환경에서도 텍스트의 가독성이 표준 대비율을 만족하는지 검수합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Combobox {...args} color={color} aria-labelledby={`${uniqueId}-label`} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * XS부터 XL까지 5단계 규격을 통해 레이아웃 대응력을 확인합니다.
 * - **Visual Harmony**: 인풋 높이에 따라 내부 텍스트 스케일과 드롭다운 아이템의 높이가 비례하여 조절되는지 검증합니다.
 * - **Touch Area**: 모바일 등 터치 환경을 고려하여 작은 사이즈에서도 충분한 클릭 영역이 확보되는지 체크합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <SpecimenWrapper>
        {sizeOptions.map(size => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <SpecimenRow>
                <Combobox {...args} size={size} aria-labelledby={`${uniqueId}-label`} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 콤보박스가 가질 수 있는 다양한 상호작용 상태를 검증합니다.
 * - **Read Only / Disabled**: 사용자의 입력이나 드롭다운 오픈이 의도치 않게 발생하지 않도록 차단되는지 확인합니다.
 * - **Interaction Feedback**: Hover와 Focus 시 시각적 변화를 통해 현재 컴포넌트가 활성 상태임을 명확히 전달하는지 검수합니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <Combobox {...args} {...state.props} aria-labelledby={`${uniqueId}-label`} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 부모 컨테이너가 공간적으로 제한된(`overflow: hidden`) 상황에서도
 * 드롭다운 리스트가 포털(Portal)을 통해 안전하게 최상위에 렌더링되는지 확인합니다.
 */
export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Combobox {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * 외부 상태(`useState`)에 의한 값 제어와 복잡한 사용자 시나리오를 자동 검증합니다.
 * - **Controlled Logic**: 상위 컴포넌트의 상태 변경이 콤보박스의 인풋 값과 드롭다운 선택 상태에 즉각 반영되는지 확인합니다.
 * - **Empty State**: 검색 결과가 없을 때 사용자에게 표시되는 '결과 없음' 안내 문구의 노출 여부를 검증합니다.
 * - **Keyboard A11y**: 화살표 키(`ArrowDown`)를 통한 리스트 진입과 엔터 키(`Enter`)를 이용한 항목 선택 과정을 `play` 함수를 통해 테스트합니다.
 */
export const Controlled: Story = {
  render: args => {
    // OptionBase 인터페이스의 필수값인 id를 포함한 데이터 구성
    const options: OptionBase[] = [
      { id: 'opt-1', value: 'apple', label: 'Apple' },
      { id: 'opt-2', value: 'banana', label: 'Banana' },
      { id: 'opt-3', value: 'cherry', label: 'Cherry' },
    ];

    const [selectedValue, setSelectedValue] = useState(options[0].value);

    // Combobox의 실제 인터페이스인 onValueChange 사용
    const handleValueChange = (newValue: string, option?: OptionBase) => {
      setSelectedValue(newValue);

      // Storybook Actions 탭에 기록
      if (args.onValueChange) {
        args.onValueChange(newValue, option);
      }
    };

    return (
      <SpecimenWrapper>
        <SpecimenGroup title='Controlled Example'>
          <SpecimenRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <Combobox
                {...args}
                options={options}
                value={selectedValue}
                onValueChange={handleValueChange}
              />

              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', color: '#495057' }}>
                  현재 상위 컴포넌트의 State:{' '}
                  <strong style={{ color: '#125b9cff' }}>"{selectedValue}"</strong>
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Button
                  variant='outline'
                  color='danger'
                  size='sm'
                  onClick={() => setSelectedValue('banana')}
                >
                  강제로 'Banana' 선택
                </Button>
                <Button color='danger' size='sm' onClick={() => setSelectedValue('')}>
                  값 초기화
                </Button>
              </div>
            </div>
          </SpecimenRow>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox') as HTMLInputElement;

    await step('1. 초기값 검증: 시작 값이 "apple"인지 확인합니다.', async () => {
      await expect(input.value).toBe('apple');
    });

    await step('2. Empty State 검증: 없는 값 입력 시 안내 문구 노출 확인', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'unknown-value', { delay: 100 });

      await waitFor(() => {
        // 🎯 방법 1: .title 클래스를 가진 요소를 특정하여 중복 회피
        const emptyStateTitle = document.body.querySelector('.empty-state .title');
        expect(emptyStateTitle).toBeInTheDocument();
        expect(emptyStateTitle).toHaveTextContent('검색 결과가 없습니다.');
      });
    });

    await step('3. 키보드 인터랙션 테스트: "cherry" 입력 후 화살표 키와 엔터로 선택', async () => {
      await userEvent.clear(input);
      // 'cherry' 입력 (delay를 주어 상태 업데이트 반영 보장)
      await userEvent.type(input, 'cherry', { delay: 100 });

      // 드롭다운 리스트박스가 나타날 때까지 대기
      await waitFor(() => {
        expect(within(document.body).getByRole('listbox')).toBeInTheDocument();
      });

      // 🔥 키보드 조작: 아래 화살표 키를 눌러 옵션 리스트 내 첫 번째 아이템으로 진입
      await userEvent.keyboard('[ArrowDown]');

      // ✅ 활성화된 옵션 확인: 'Cherry' 텍스트를 포함한 옵션이 존재하는지 검증
      const cherryOption = within(document.body).getByRole('option', {
        name: (content, element) => element?.textContent?.toLowerCase().includes('cherry') ?? false,
      });
      await expect(cherryOption).toBeInTheDocument();

      // 🔥 엔터 키를 눌러 활성화된 옵션 선택
      await userEvent.keyboard('[Enter]');

      // 최종적으로 상위 State와 인풋 값이 'cherry'로 변경되었는지 확인
      await waitFor(() => {
        expect(input.value).toBe('cherry');
      });
    });

    await step('4. 외부 제어 검증: 버튼 클릭으로 상태를 "banana"로 변경', async () => {
      const forceButton = canvas.getByRole('button', { name: /강제로 'Banana' 선택/i });
      await userEvent.click(forceButton);

      await expect(input.value).toBe('banana');
    });

    await step('5. 값 초기화 검증: 초기화 버튼 클릭 시 빈 값이 되는지 확인', async () => {
      const resetButton = canvas.getByRole('button', { name: /값 초기화/i });
      await userEvent.click(resetButton);

      await expect(input.value).toBe('');
    });
  },
};
