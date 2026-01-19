import type { Meta, StoryObj } from '@storybook/react-vite';
import Selectbox from './Selectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { selectboxOptions } from './Selectbox.mock';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useId, useState } from 'react';
import Button from '../Button/Button';
import { GuideWrapper } from '../../guide/Guide';
import { within, userEvent, expect, screen } from 'storybook/test';
import { useTranslation } from 'react-i18next';

const SELECTBOX_ITEM_KEYS = [
  'label_a',
  'label_b',
  'label_c',
  'label_d',
  'label_e',
  'label_f',
  'label_g',
  'label_h',
  'label_i',
  'label_j',
];

const localizeSelectboxOptions = (t: (key: string) => string, options: typeof selectboxOptions) => {
  let index = 0;

  return options.map(option => {
    if (option.id === 'placeholder') return option;

    const key = SELECTBOX_ITEM_KEYS[index];
    index += 1;

    if (!key) return option;

    return {
      ...option,
      value: t(`selectbox.items.${key}`),
    };
  });
};

const meta = {
  title: 'UI/Molecules/Selectbox/Outline',
  component: Selectbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Selectbox (Outline)**는 사용자에게 미리 정의된 목록에서 하나를 선택할 수 있게 하는 드롭다운 컨트롤입니다. <br /><br />' +
          '• 클릭 시 하단(혹은 상단)으로 `OptionList`가 전개되며, 포털(Portal) 기술을 사용하여 레이아웃 간섭 없이 렌더링됩니다. <br />' +
          '• `defaultOptionId`를 통한 초기값 설정뿐만 아니라 외부 상태와의 바인딩을 지원합니다. <br />' +
          '• `role="combobox"` 및 `aria-haspopup` 등 웹 표준 속성을 준수하여 스크린 리더와 키보드 인터랙션을 지원합니다.',
      },
    },
  },

  argTypes: {
    // Styles
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Contents
    options: {
      control: 'object',
      description: '드롭다운에 표시될 옵션 목록',
      table: { category: 'Contents' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Contents' },
    },

    // States
    defaultOptionId: {
      control: 'text',
      description: '초기 선택값 (비제어)',
      table: { category: 'States' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'States' },
    },
    readOnly: {
      control: 'boolean',
      table: { category: 'States' },
    },
    required: {
      control: 'boolean',
      table: { category: 'States' },
    },

    // Native & Identifiers
    id: {
      control: 'text',
      table: { category: 'Native' },
    },
    selectId: {
      control: 'text',
      description: '내부 select 또는 button 요소의 ID',
      table: { category: 'Native' },
    },

    // Accessibility
    role: {
      control: 'text',
      table: { category: 'Accessibility' },
    },
    'aria-labelledby': {
      control: 'text',
      table: { category: 'Accessibility' },
    },

    // Events
    onValueChange: {
      action: 'valueChanged',
      table: { category: 'Events' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    role: 'combobox',
    options: selectboxOptions,
    placeholder: '옵션을 선택해 주세요',
    defaultOptionId: '',
  },
} satisfies Meta<typeof Selectbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 형태의 셀렉트박스입니다.
 * `updateArgs`를 연동하여 스토리북 컨트롤 패널에서도 선택 상태가 실시간으로 동기화되도록 구성되었습니다.
 */
export const Base: Story = {
  render: (args, context) => {
    const { t } = useTranslation();
    const uniqueId = useId();
    const localizedOptions = localizeSelectboxOptions(t, args.options);
    const { updateArgs } = context;

    const handleChange = (id: string) => {
      // 스토리북 Controls 패널의 defaultOptionId를 즉시 업데이트
      if (typeof updateArgs === 'function') {
        updateArgs({ defaultOptionId: id });
      }
      // Actions 패널에 이벤트 로그 출력
      args.onValueChange?.(id);
    };

    return (
      <Selectbox
        {...args}
        aria-labelledby={uniqueId}
        onValueChange={handleChange}
        options={localizedOptions}
        placeholder={t('selectbox.placeholder')}
      />
    );
  },
};

/**
 * 브랜드 컬러 및 시스템 상태(성공, 에러 등)를 나타내는 각 테마별 스타일을 검토합니다.
 * - **Visual Consistency**: 트리거 버튼의 테두리와 내부 아이템의 강조색이 테마에 맞게 일관성을 유지하는지 확인합니다.
 * - **Contextual Use**: 에러 발생 시 `danger`, 긍정적 확신이 필요할 때 `success` 등 상황에 맞는 컬러 사용을 권장합니다.
 */
export const Colors: Story = {
  render: args => {
    const { t } = useTranslation();
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    const localizedOptions = localizeSelectboxOptions(t, args.options);

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Selectbox
                  {...args}
                  color={color}
                  aria-labelledby={uniqueId}
                  options={localizedOptions}
                  placeholder={t('selectbox.placeholder')}
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
 * 시스템에서 정의된 5가지 사이즈(XS ~ XL)를 비교 검토합니다.
 * - **Vertical Alignment**: 높이가 변하더라도 내부 텍스트와 화살표 아이콘의 수직 중앙 정렬이 유지되는지 확인합니다.
 * - **Grid System**: 각 사이즈가 8px 단위의 그리드 시스템 내에서 다른 폼 요소(Input, Button)들과 조화롭게 배치되는지 검증합니다.
 */
export const Sizes: Story = {
  render: args => {
    const { t } = useTranslation();
    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];
    const localizedOptions = localizeSelectboxOptions(t, args.options);

    return (
      <SpecimenWrapper>
        {sizeOptions.map(size => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <SpecimenRow>
                <Selectbox
                  {...args}
                  size={size}
                  aria-labelledby={uniqueId}
                  options={localizedOptions}
                  placeholder={t('selectbox.placeholder')}
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
 * 셀렉트박스의 생명주기에서 발생할 수 있는 주요 시각적 상태들을 검증합니다.
 * - **Pseudo-classes**: Hover, Focus 등 실제 조작 없이도 스타일 가이드를 확인할 수 있습니다.
 * - **Interaction Restriction**: `Read Only`와 `Disabled` 상태에서 드롭다운이 열리지 않도록 차단되는지 체크합니다.
 */
export const States: Story = {
  render: args => {
    const { t } = useTranslation();
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];
    const localizedOptions = localizeSelectboxOptions(t, args.options);

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <Selectbox
                  {...args}
                  {...state.props}
                  aria-labelledby={uniqueId}
                  defaultOptionId='select-3'
                  options={localizedOptions}
                  placeholder={t('selectbox.placeholder')}
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
 * 부모 요소에 `overflow: hidden`이나 `clip` 속성이 있는 극한의 환경에서도
 * 드롭다운 리스트가 잘리지 않고 정상적으로 노출(Portal 렌더링)되는지 확인합니다.
 */
export const PortalTest: Story = {
  render: args => {
    const { t } = useTranslation();
    const localizedOptions = localizeSelectboxOptions(t, args.options);

    return (
      <AnatomyWrapper
        title='부모 요소가 overflow: hidden 상태입니다.'
        style={{ overflow: 'hidden' }}
      >
        <Selectbox
          {...args}
          options={localizedOptions}
          placeholder={t('selectbox.placeholder')}
        />
      </AnatomyWrapper>
    );
  },
};

/**
 * 외부 상태(`useState`)를 통해 셀렉트박스의 값을 강제로 제어하거나 초기화하는 실무 패턴입니다.
 * - **Reset Strategy**: `key` 속성에 상태값을 바인딩하여, 초기화 시 컴포넌트를 재마운트(Re-mount)시키는 방식으로 내부 상태를 쉽고 안전하게 리셋합니다.
 * - **Interaction Testing**: `play` 함수를 통해 옵션 선택부터 리셋 버튼 동작까지의 사용자 시나리오를 자동 검증합니다.
 */
export const Controlled: Story = {
  render: args => {
    const { t } = useTranslation();
    const uniqueId = useId();
    const localizedOptions = localizeSelectboxOptions(t, args.options);

    // 실제 상태 관리
    const [value, setValue] = useState('');

    // 초기화 버튼 클릭 시 실행될 핸들러
    const handleReset = () => {
      setValue(''); // 상태를 빈 값으로 리셋
    };

    return (
      <GuideWrapper title={`Selected ID: ${value || 'none'}`}>
        {/* key에 value를 바인딩.
           value가 바뀌면(reset 포함) Selectbox가 새롭게 마운트되면서
           내부 useState가 args.defaultOptionId(변경된 value)로 다시 초기화.
        */}
        <Selectbox
          {...args}
          key={value}
          aria-labelledby={uniqueId}
          defaultOptionId={value}
          onValueChange={id => setValue(id)}
          options={localizedOptions}
          placeholder={t('selectbox.placeholder')}
        />
        <Button variant='solid' color='danger' size='sm' onClick={handleReset}>
          Reset (Re-mount)
        </Button>
      </GuideWrapper>
    );
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 1. 트리거 요소(combobox) 탐색 및 클릭
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // 2. 옵션 선택 테스트 (Portal 대응을 위해 screen 사용)
    const targetOption = args.options?.[1]; // 두 번째 옵션
    if (targetOption) {
      // 중복 텍스트 에러 방지: role="option"인 요소 중 이름이 일치하는 것만 탐색
      const optionNamePattern = new RegExp(targetOption.value.replace(/\s+/g, '\\s*'), 'i');
      const optionElement = await screen.findByRole('option', {
        name: optionNamePattern,
      });
      await userEvent.click(optionElement);

      // 3. 상태 업데이트 확인 (텍스트 매처 함수 사용으로 유연하게 검증)
      await expect(
        canvas.getByText(content => content.includes(`Selected ID: ${targetOption.id}`)),
      ).toBeInTheDocument();
    }

    // 4. 리셋 버튼 동작 테스트 (Re-mount 검증)
    const resetBtn = canvas.getByRole('button', { name: /reset/i });
    await userEvent.click(resetBtn);

    // 5. 초기 상태 복구 확인
    const expectedPlaceholder = args.placeholder ?? '옵션을 선택해 주세요';
    expect(canvas.getByText(expectedPlaceholder)).toBeInTheDocument();
    expect(canvas.getByText(/Selected ID: none/)).toBeInTheDocument();
  },
};
