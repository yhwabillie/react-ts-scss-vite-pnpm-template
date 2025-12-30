import type { Meta, StoryObj } from '@storybook/react-vite';
import Combobox from './Combobox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { comboboxOptions, comboboxInputProps } from './Combobox.mock';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useEffect, useId, useState } from 'react';
import { GuideWrapper } from '../../guide/Guide';
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
 * 브랜드 컬러 및 상태(Success, Error 등)를 나타내는 각 테마별 스타일을 검토합니다.
 * 1. 테마 일관성: 선택 시 강조색(Primary), 성공(Success), 경고(Warning) 등 각 의미에 맞는 컬러가 테두리와 텍스트에 올바르게 적용되는지 확인합니다.
 * 2. 대비 및 가독성: 배경색과 텍스트 컬러 간의 명도 대비가 충분하여 정보 전달에 문제가 없는지 검토합니다.
 * 3. 피드백 컬러: 드롭다운 아이템의 호버/선택 상태 컬러가 각 테마와 조화를 이루는지 확인합니다.
 * * ※ 개발 가이드: 상황별 의미(예: 오류 발생 시 'danger')에 맞는 적절한 컬러 속성을 사용하여 사용자 경험의 직관성을 높이세요.
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
 * 시스템에서 정의된 5가지 사이즈(XS ~ XL)를 비교 검토합니다.
 * 1. 수직 정렬(Vertical Alignment): 높이 변화에 따라 내부 텍스트와 화살표 아이콘의 중앙 정렬이 유지되는지 확인합니다.
 * 2. 폰트 스케일링: 사이즈에 맞춰 글꼴 크기(`font-size`)와 여백(`padding`)이 적절히 조절되어 가독성을 해치지 않는지 검토합니다.
 * 3. 반응형 및 그리드 대응: 각 사이즈가 프로젝트의 그리드 시스템(예: 8px 단위 등)과 조화를 이루는지 확인합니다.
 * * ※ 개발 가이드: 컴포넌트가 배치될 영역의 너비와 높이 제약에 따라 적절한 사이즈를 선택하세요.
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
 * Combobox의 생명주기에서 발생할 수 있는 주요 시각적 상태들을 한눈에 검증합니다.
 * 1. 가상 클래스(Pseudo-classes): `pseudo-hover`, `pseudo-focus` 등을 통해 실제 이벤트 없이도 스타일 CSS를 강제 적용하여 디자인 QA를 용이하게 합니다.
 * 2. 인터랙션 제한: `Read Only`와 `Disabled` 상태에서 클릭 및 드롭다운 오픈이 정상적으로 차단되는지 확인합니다.
 * 3. 접근성(A11y): 각 상태 변화에 따라 스크린 리더가 인지할 수 있는 ARIA 속성이 적절히 변경되는지 검토합니다.
 * * ※ 개발 가이드: 특정 상태의 스타일 수정이 필요할 때 이 스토리를 참고하여 사이드 이펙트를 확인하세요.
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
 * 부모 요소에 `overflow: hidden` 또는 `clip` 속성이 있어도
 * 드롭다운 리스트가 잘리지 않고 정상적으로 노출되는지 확인하는 스토리입니다.
 */
export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Combobox {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * React의 상태(State)에 의해 값이 제어되는 Controlled Component 방식을 검증합니다.
 * 1. 상태 동기화: 외부에서 주입된 `value` 상태가 변경될 때 컴포넌트의 선택된 아이템이 즉각적으로 업데이트되는지 확인합니다.
 * 2. 이벤트 콜백: `onValueChange` 핸들러를 통해 선택된 값과 옵션 객체가 부모 상태로 정확히 전달되는지 검토하며, 타입 안정성을 확인합니다.
 * 3. 단방향 데이터 흐름: 사용자가 입력을 시도하더라도 상태값이 고정되어 있다면 UI가 변경되지 않아야 하며, 상태 변경을 통해서만 업데이트되는지 확인합니다.
 * * ※ 개발 가이드: 폼 라이브러리(React Hook Form 등)와 연동하거나, 선택된 값에 따라 다른 UI를 제어해야 하는 복잡한 로직에서 이 패턴을 사용하세요.
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
