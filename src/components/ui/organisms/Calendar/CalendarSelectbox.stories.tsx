import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarSelectbox from './CalendarSelectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { calendarMonthOptions, calendarYearOptions } from './Calendar.mock';
import { useId } from 'react';

const meta = {
  title: 'UI/Organisms/Calendar/CalendarSelectbox',
  component: CalendarSelectbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**CalendarSelectbox**는 달력 시스템 내에서 연도와 월을 선택하기 위해 최적화된 드롭다운 컴포넌트입니다. <br /><br />' +
          '• **Custom Trigger**: 일반적인 선택창보다 좁은 달력 헤더 공간에 맞춰 콤팩트한 사이즈와 스타일을 지원합니다. <br />' +
          '• **Accessibility Focus**: `role="combobox"` 및 `aria-haspopup` 속성을 통해 보조 공학 기기에 드롭다운 구조임을 명확히 알립니다. <br />' +
          '• **State Sync**: 내부 옵션 리스트와 상태를 동기화하여 키보드 내비게이션 및 선택값 변경을 안전하게 처리합니다.',
      },
    },
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

/**
 * 연도와 월 선택을 위한 셀렉트박스의 기본 렌더링을 확인합니다.
 * - **Checklist**: 연도(4자리)와 월(텍스트/숫자) 각각의 콘텐츠 길이에 따라 셀렉트박스의 너비가 적절히 유지되는지 확인합니다.
 */
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
 * 주요 브랜드 컬러(Primary, Secondary, Tertiary) 테마가 트리거와 옵션 리스트에 일관되게 적용되는지 확인합니다.
 * - **A11y**: `useId`를 활용해 `selectId`와 레이블을 연결하여 스크린 리더 환경에서의 접근성을 보장합니다.
 * - **Controlled**: `defaultOptionId` 설정을 통한 초기값 주입 및 제어 상태를 테스트합니다.
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

/**
 * 컴포넌트의 다양한 상호작용 상태(Normal, Hover, Focus, Disabled)를 검증합니다.
 * - **Visual Feedback**: `pseudo-class` 시뮬레이션을 통해 포커스 링과 호버 효과가 디자인 가이드를 준수하는지 점검합니다.
 * - **Disabled**: 비활성화 시 사용자 클릭 차단 및 시각적 감쇠 처리가 명확한지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <CalendarSelectbox
                  {...args}
                  {...state.props}
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
