import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarSelectbox from './CalendarSelectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

const mockOptions = [
  { id: '2023', value: '2023년', selected: false, disabled: false },
  { id: '2024', value: '2024년', selected: true, disabled: false },
  { id: '2025', value: '2025년', selected: false, disabled: false },
  { id: '2026', value: '2026년', selected: false, disabled: false },
  { id: '2027', value: '2027년', selected: false, disabled: true },
];

const meta = {
  title: 'UI/Organisms/Calendar/CalendarSelectbox',
  component: CalendarSelectbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    // 실제 사용 코드의 스펙 반영
    'aria-label': '연도 선택',
    variant: 'outline',
    color: 'primary',
    size: 'xs',
    role: 'combobox',
    id: 'year-switch-component',
    selectId: 'year-switch-select',
    options: mockOptions,
    defaultOptionId: '2024',
    placeholder: '연도 선택',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'error'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    onValueChange: { action: 'yearChanged' },
    onOpenChange: { action: 'openStateChanged' },
  },
} satisfies Meta<typeof CalendarSelectbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Year Switcher Case]
 * 실제 캘린더 헤더에서 연도를 변경하는 시나리오를 시뮬레이션합니다.
 * '2024년' -> 2024 (Number) 변환 로직이 포함되어 있습니다.
 */
export const YearSwitcher: Story = {
  render: (args, { updateArgs }) => {
    const handleYearChange = (id: string, option?: any) => {
      if (!option) return;

      // 1. 실제 사용처의 데이터 변환 로직 검증
      const yearValue = Number(option.value.replace('년', ''));
      console.log(`변환된 연도 데이터: ${yearValue} (Type: ${typeof yearValue})`);

      // 2. 스토리북 UI 동기화 (context 사용)
      updateArgs({ defaultOptionId: id });

      // 3. Actions 패널 기록
      args.onValueChange?.(id, option);
    };

    return <CalendarSelectbox {...args} onValueChange={handleYearChange} />;
  },
};

/**
 * [02. Accessibility Check]
 * aria-labelledby와 id가 제대로 연결되어 스크린 리더가 인식하는지 확인합니다.
 */
export const Accessibility: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label id='year-switch-label' style={{ fontSize: '12px', color: '#666' }}>
        연도 선택 (Label 연결 확인)
      </label>
      <CalendarSelectbox {...args} aria-labelledby='year-switch-label' />
    </div>
  ),
};

/**
 * [03. Long Year Range]
 * 10년 이상의 연도 리스트에서 자동 스크롤(Auto-focus)이 정상 작동하는지 확인합니다.
 */
export const LongYearRange: Story = {
  args: {
    defaultOptionId: 'y-2030',
    options: Array.from({ length: 20 }, (_, i) => ({
      id: `y-${2020 + i}`,
      value: `${2020 + i}년`,
      selected: 2020 + i === 2030,
      disabled: false,
    })),
  },
};
