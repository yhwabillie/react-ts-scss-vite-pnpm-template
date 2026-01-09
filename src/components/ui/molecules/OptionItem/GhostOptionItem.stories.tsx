import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionItem from './OptionItem';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useId } from 'react';

/**
 * [OptionItem]
 * 셀렉트박스나 리스트 내의 개별 선택 항목입니다.
 * - **Accessibility**: `role="option"`을 가지며 `aria-selected`와 `aria-disabled`를 지원합니다.
 * - **Visual Feedback**: 선택 시 체크 아이콘이 나타나며, 활성화(`isActive`) 상태 시 포커스 스타일이 적용됩니다.
 */
const meta = {
  title: 'UI/Molecules/OptionItem/Ghost',
  component: OptionItem,
  tags: ['autodocs'],

  argTypes: {
    // 🏷️ Data & Identification
    id: {
      description: '옵션 아이템의 고유 식별자입니다.',
      control: 'text',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    value: {
      description: '옵션 선택 시 전달될 실제 데이터 값입니다.',
      control: 'text',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    label: {
      description: '사용자에게 화면상으로 보여줄 텍스트입니다.',
      control: 'text',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    index: {
      description: '리스트 내에서의 순서(Index)를 나타냅니다.',
      control: 'number',
      table: {
        category: 'Data',
        type: { summary: 'number' },
      },
    },

    // ✨ Appearance
    variant: {
      description: '옵션 아이템의 시각적 스타일 변형을 선택합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'solid' },
      },
    },
    color: {
      description: '디자인 시스템에 정의된 의미론적 색상을 적용합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: '아이템의 크기(높이, 패딩, 폰트 사이즈)를 결정합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },

    // ⚡ Status
    isActive: {
      description: '현재 포커스되어 있거나 활성화된 상태인지 여부입니다.',
      control: 'boolean',
      table: {
        category: 'Status',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      description: '현재 선택된 상태인지 여부를 나타냅니다.',
      control: 'boolean',
      table: {
        category: 'Status',
        type: { summary: 'any' },
      },
    },
    disabled: {
      description: '비활성화 상태 여부로, true일 경우 모든 인터랙션이 차단됩니다.',
      control: 'boolean',
      table: {
        category: 'Status',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // 📞 Events
    onSelect: {
      description: '아이템이 선택되었을 때 실행되는 콜백 함수입니다.',
      action: 'selected',
      table: {
        category: 'Events',
        type: { summary: '(id: string, value: string) => void' },
      },
    },
    onMount: {
      description: '컴포넌트가 마운트될 때 DOM 엘리먼트와 인덱스를 반환합니다.',
      table: {
        category: 'Events',
        type: { summary: '(el: HTMLLIElement | null, idx: number) => void' },
      },
    },

    // 📦 Others
    placeholder: {
      description: '데이터가 없을 때 표시할 임시 텍스트입니다.',
      control: 'text',
      table: {
        category: 'Others',
        type: { summary: 'string' },
      },
    },
    className: {
      description: '커스텀 스타일을 위한 CSS 클래스명입니다.',
      control: 'text',
      table: {
        category: 'Others',
        type: { summary: 'string' },
      },
    },
  },
  args: {
    id: undefined,
    value: undefined,
    variant: 'ghost',
    color: 'primary',
    size: 'xl',
    selected: false,
    disabled: false,
  },
} satisfies Meta<typeof OptionItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 가장 기본적인 렌더링 형태를 확인합니다.
 * 기본적인 너비 제약 상황에서 단일 아이템이 어떻게 출력되는지 검증합니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  render: args => {
    const uniqueId = useId();

    return (
      <AnatomyWrapper
        title='OptionList width: 400px'
        style={{ width: '400px', margin: 'auto' }}
        role='listbox'
        aria-label='옵션 리스트'
      >
        <OptionItem {...args} id={uniqueId} value='개발자' />
      </AnatomyWrapper>
    );
  },
};

/**
 * 디자인 시스템의 의미론적(Semantic) 색상 팔레트 6종을 검증합니다.
 * Primary, Success, Warning, Danger 등 각 테마가 다크모드/라이트모드에서
 * 적절한 명도 대비를 유지하는지 확인합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    const uniqueId = useId();
    const uniqueValue = '옵션';

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {colorOptions.map((color, idx) => (
          <SpecimenGroup key={color} title={color}>
            <SpecimenRow style={{ width: '300px' }} role='listbox' aria-label='옵션 리스트'>
              <OptionItem
                {...args}
                color={color}
                id={uniqueId}
                value={`${uniqueValue} ${idx + 1}`}
              />
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * UI의 생명주기와 인터랙션에 따른 모든 시각적 변화를 검증합니다.
 * - Placeholder: 데이터가 없는 초기 상태에서 사용자에게 가이드를 제공하는지 확인합니다.
 * - Interaction: Hover, Focus, Active 상태에서 사용자 조작에 따른 즉각적인 피드백을 검증합니다.
 * - Status: Checked(선택 완료)와 Disabled(조작 차단) 상태의 시각적 구분감을 확인하여
 * 사용자가 현재 시스템 상태를 명확히 인지할 수 있는지 테스트합니다.
 */
export const States: Story = {
  render: args => {
    const uniqueId = useId();
    const uniqueValue = '옵션';

    const states = [
      { label: 'Normal', class: '' },
      { label: 'Placeholder', props: { disabled: true, selected: false } },
      { label: 'Checked', props: { selected: true } },
      { label: 'Hover', class: 'pseudo-hover' },
      { label: 'Focus', class: 'pseudo-focus-visible' },
      { label: 'Active', class: 'pseudo-active' },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {states.map((state, idx) => {
          return (
            <SpecimenGroup key={state.label} title={state.label}>
              <SpecimenRow style={{ width: '300px' }} role='listbox' aria-label='옵션 리스트'>
                <OptionItem
                  {...args}
                  id={uniqueId}
                  value={
                    state.label === 'Placeholder'
                      ? '옵션을 선택해 주세요'
                      : `${uniqueValue} ${idx + 1}`
                  }
                  className={state.class}
                  {...state.props}
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
 * XL부터 XS까지 5단계 크기 변이를 검증합니다.
 * 각 사이즈별 폰트 크기, 패딩, 높이가 레이아웃 가이드라인에 맞게
 * 일관성 있게 구현되었는지 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    const uniqueId = useId();
    const uniqueValue = '옵션';

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {sizeOptions.map((size, idx) => (
          <SpecimenGroup key={size} title={size.toUpperCase()}>
            <SpecimenRow style={{ width: '300px' }} role='listbox' aria-label='옵션 리스트'>
              <OptionItem {...args} size={size} id={uniqueId} value={`${uniqueValue} ${idx + 1}`} />
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * 텍스트 내용이 컨테이너 너비를 초과할 경우의 말줄임표(Ellipsis) 처리를 검증합니다.
 * 텍스트가 잘릴 때 시각적 깨짐이 없는지, 선택된 상태(Selected)에서도
 * 텍스트 가독성이 유지되는지 확인합니다.
 */
export const LongText: Story = {
  render: args => {
    const uniqueId = useId();

    return (
      <AnatomyWrapper
        title='OptionList width: 400px'
        style={{ width: '400px', margin: 'auto' }}
        role='listbox'
        aria-label='옵션 리스트'
      >
        <OptionItem
          {...args}
          id={`${uniqueId}-1`}
          value='이 옵션은 공간이 부족할 경우 말줄임표가 제대로 표시되는지 테스트하기 위한 긴 문장입니다.'
        />
        <OptionItem
          {...args}
          id={`${uniqueId}-2`}
          value='이 옵션은 공간이 부족할 경우 말줄임표가 제대로 표시되는지 테스트하기 위한 긴 문장입니다.'
          selected={true}
        />
      </AnatomyWrapper>
    );
  },
};
