import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionItem from './OptionItem';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

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
  parameters: {
    docs: {
      description: {
        component:
          '**OptionItem (Ghost)**은 셀렉트 박스, 콤보박스 또는 메뉴 리스트 내에서 개별 선택 항목을 구성하는 컴포넌트입니다. <br /><br />' +
          '• *평상시에는 배경색이 없다가 호버나 포커스 시에만 배경이 드러나는 절제된 스타일로, 리스트의 시각적 무게감을 줄여줍니다. <br />' +
          '• role="option"`과 `aria-selected` 속성을 통해 스크린 리더 사용자에게 현재 선택 상태를 명확히 전달합니다. <br />' +
          '• 항목 선택 시 우측에 체크 아이콘이 표시되어 시각적으로 선택 여부를 직관적으로 인지할 수 있습니다.',
      },
    },
  },

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
 * Ghost 타입 특유의 투명한 배경과 마우스 오버 시의 변화를 중점적으로 검증합니다.
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
    const { t } = useTranslation();

    return (
      <AnatomyWrapper
        title='OptionList width: 400px'
        style={{ width: '400px', margin: 'auto' }}
        role='listbox'
        aria-label='옵션 리스트'
      >
        <OptionItem {...args} id={uniqueId} value={t('option-item.items.label_a')} />
      </AnatomyWrapper>
    );
  },
};

/**
 * 6가지 시멘틱 컬러(Primary ~ Danger)가 적용된 상태를 대조합니다.
 * 선택(Selected) 상태에서 나타나는 체크 아이콘과 텍스트의 컬러가 각 테마에 맞게 변경되는지 확인합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    const uniqueId = useId();
    const { t } = useTranslation();
    const labels = ['label_a', 'label_b', 'label_c', 'label_d', 'label_e', 'label_f'];

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {colorOptions.map((color, idx) => (
          <SpecimenGroup key={color} title={color}>
            <SpecimenRow style={{ width: '300px' }} role='listbox' aria-label='옵션 리스트'>
              <OptionItem
                {...args}
                color={color}
                id={uniqueId}
                value={t(`option-item.items.${labels[idx]}`)}
              />
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * 아이템의 생애주기에 따른 시각적 피드백을 검증합니다.
 * - **Placeholder**: 비활성화된 안내 문구로서의 스타일을 확인합니다.
 * - **Checked**: 선택 완료 시 아이콘 노출과 텍스트 강조 효과를 체크합니다.
 * - **Pseudo Classes**: Hover, Focus, Active 등 사용자 인터랙션에 따른 배경색 변화를 테스트합니다.
 */
export const States: Story = {
  render: args => {
    const uniqueId = useId();

    const states = [
      { label: 'Normal', class: '' },
      { label: 'Placeholder', props: { disabled: true, selected: false } },
      { label: 'Checked', props: { selected: true } },
      { label: 'Hover', class: 'pseudo-hover' },
      { label: 'Focus', class: 'pseudo-focus-visible' },
      { label: 'Active', class: 'pseudo-active' },
      { label: 'Disabled', props: { disabled: true } },
    ];

    const { t } = useTranslation();
    const labels = ['label_a', 'label_b', 'label_c', 'label_d', 'label_e', 'label_f', 'label_g'];

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
                      ? t('option-item.placeholder')
                      : t(`option-item.items.${labels[idx]}`)
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
 * XL부터 XS까지 5단계 규격에 따른 높이와 내부 여백을 확인합니다.
 * 상위 Select 컴포넌트의 사이즈와 동기화되어 일관된 리스트 디자인을 유지하는지 검수합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    const uniqueId = useId();
    const { t } = useTranslation();
    const labels = ['label_a', 'label_b', 'label_c', 'label_d', 'label_e'];

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {sizeOptions.map((size, idx) => (
          <SpecimenGroup key={size} title={size.toUpperCase()}>
            <SpecimenRow style={{ width: '300px' }} role='listbox' aria-label='옵션 리스트'>
              <OptionItem
                {...args}
                size={size}
                id={uniqueId}
                value={t(`option-item.items.${labels[idx]}`)}
              />
            </SpecimenRow>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * 항목의 텍스트가 리스트 너비를 초과할 경우의 말줄임(Ellipsis) 처리 로직을 확인합니다.
 * 우측 체크 아이콘 영역을 침범하지 않고 안전하게 텍스트가 생략되는지 검증합니다.
 */
export const LongText: Story = {
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <AnatomyWrapper
        title='OptionList width: 400px'
        style={{ width: '400px', margin: 'auto' }}
        role='listbox'
        aria-label='옵션 리스트'
      >
        <OptionItem {...args} id={`${uniqueId}-1`} value={t('long-text')} />
        <OptionItem {...args} id={`${uniqueId}-2`} value={t('long-text')} selected={true} />
      </AnatomyWrapper>
    );
  },
};
