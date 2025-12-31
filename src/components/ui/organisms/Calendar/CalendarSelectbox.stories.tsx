import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarSelectbox from './CalendarSelectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { calendarMonthOptions, calendarYearOptions } from './Calendar.mock';
import { useId } from 'react';

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

  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    onValueChange: { action: 'yearChanged' },
    onOpenChange: { action: 'openStateChanged' },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'xs',
    role: 'combobox',
    options: undefined,
  },
} satisfies Meta<typeof CalendarSelectbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: args => {
    const uniqueId = useId();

    return (
      <SpecimenGroup>
        <SpecimenRow>
          <AnatomyWrapper title='연도 선택'>
            <CalendarSelectbox
              {...args}
              selectId={`${uniqueId}-year`}
              options={calendarYearOptions}
              defaultOptionId='year-2020'
              aria-label='연도 선택'
            />
          </AnatomyWrapper>
        </SpecimenRow>
        <SpecimenRow>
          <AnatomyWrapper title='월 선택'>
            <CalendarSelectbox
              {...args}
              selectId={`${uniqueId}-month`}
              options={calendarMonthOptions}
              defaultOptionId='month-3'
              aria-label='월 선택'
            />
          </AnatomyWrapper>
        </SpecimenRow>
      </SpecimenGroup>
    );
  },
};

/**
 * CalendarSelectbox의 주요 브랜드 컬러(`primary`, `secondary`, `tertiary`)별
 * 시각적 렌더링과 테마 적용 상태를 확인하기 위한 스토리입니다.
 * * 🛠️ 주요 로직:
 * 1. `colorOptions` 배열을 순회하며 각 테마별 셀렉트박스를 생성합니다.
 * 2. `useId`를 사용하여 접근성(A11y)을 위한 고유 식별자를 각 인스턴스에 부여합니다.
 * - `selectId`: 네이티브 select 요소와 동기화
 * - `aria-labelledby`: 보조기기가 읽어줄 레이블과의 연결
 * 3. `defaultOptionId`를 'month-3'으로 설정하여 초기 제어(Controlled) 상태를 테스트합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <CalendarSelectbox
                  {...args}
                  color={color}
                  selectId={`${uniqueId}-month`}
                  aria-labelledby={`${uniqueId}-month-label`}
                  options={calendarMonthOptions}
                  defaultOptionId='month-3'
                />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};
