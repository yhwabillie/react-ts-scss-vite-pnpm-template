import type { Meta, StoryObj } from '@storybook/react-vite';
import Combobox from './Combobox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { comboboxOptions, comboboxInputProps } from './Combobox.mock';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

/**
 * [Combobox]
 * 사용자의 입력에 따라 옵션을 필터링하고 제안하는 컴포넌트입니다.
 * - **WAI-ARIA**: Combobox 패턴을 준수하며 스크린 리더 검색 결과 안내를 포함합니다.
 * - **Portal**: 드롭다운 메뉴는 부모의 overflow 영향을 받지 않도록 Portal로 렌더링됩니다.
 */
const meta = {
  title: 'UI/Molecules/Combobox/Solid',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    options: comboboxOptions,
    inputProps: comboboxInputProps,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    options: { table: { category: 'Contents' } },
    onValueChange: { action: 'valueChanged', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Base]
 * 입력값에 따른 필터링과 키보드 내비게이션(ArrowUp/Down)을 확인합니다.
 * context의 updateArgs를 사용하여 입력값이 바뀌어도 스토리북 패널과 동기화됩니다.
 */
export const Base: Story = {
  render: (args, { updateArgs }) => {
    const handleValueChange = (value: string) => {
      // 선택된 값을 스토리북 패널의 value(또는 inputValue)와 동기화
      updateArgs({ value });
      args.onValueChange?.(value);
    };

    return <Combobox {...args} onValueChange={handleValueChange} />;
  },
};

/**
 * [02. Sizes]
 * 각 규격별로 인풋과 드롭다운 아이템의 스케일링을 확인합니다.
 */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '800px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => (
        <SpecimenGroup key={size} title={size.toUpperCase()} direction='row'>
          <Combobox {...args} size={size} />
        </SpecimenGroup>
      ))}
    </SpecimenWrapper>
  ),
};

/**
 * [03. Empty State]
 * 검색 결과가 없을 때 표시되는 UI(Empty State)를 확인합니다.
 */
export const EmptyResult: Story = {
  args: {
    inputProps: {
      ...comboboxInputProps,
      defaultValue: '존재하지 않는 직무', // 초기 검색어 강제 설정
    },
  },
  render: args => <Combobox {...args} />,
};

/**
 * [04. Long Options & Overflow]
 * 옵션 텍스트가 길거나 개수가 많을 때의 스크롤 및 레이아웃 안정성을 검증합니다.
 */
export const LongList: Story = {
  args: {
    options: [
      ...comboboxOptions,
      { id: 'long-1', value: '시니어 데이터 사이언티스트 및 머신러닝 엔지니어', disabled: false },
    ],
  },
  render: args => <Combobox {...args} />,
};

/**
 * [05. Status]
 * 비활성화(Disabled) 및 읽기 전용(ReadOnly) 상태를 확인합니다.
 */
export const Status: Story = {
  render: args => (
    <SpecimenWrapper>
      <SpecimenGroup title='Disabled' direction='row'>
        <Combobox {...args} disabled />
      </SpecimenGroup>
      <SpecimenGroup title='ReadOnly' direction='row'>
        <Combobox {...args} readOnly />
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};
