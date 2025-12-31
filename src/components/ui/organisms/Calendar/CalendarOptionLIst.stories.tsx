import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarOptionList from './CalendarOptionList';
import OptionItem from '../../molecules/OptionItem/OptionItem';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useId } from 'react';
import { calendarMonthOptions, calendarYearOptions } from './Calendar.mock';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';

const meta = {
  title: 'UI/Organisms/Calendar/CalendarOptionList',
  component: CalendarOptionList,
  tags: ['autodocs'],
  parameters: {
    // 웹접근성 검사 차단, storybook 검사 도구 한계
    // max-height로 가려진 스크롤 영역으로 가려지는 부분을 배경 색상 감지 불가로 체크
    // 웹접근성 에러가 아닌데 도구의 한계로 에러로 알려줌
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: false },
          { id: 'scrollable-region-focusable', enabled: false },
        ],
      },
    },
  },

  argTypes: {
    // 🎨 Style 카테고리
    variant: {
      description: '리스트 아이템의 배경 및 테두리 스타일을 결정합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline'], // 인터페이스에 정의된 값에 맞춤
      table: {
        category: 'Style',
        type: { summary: "'solid' | 'outline'" },
      },
    },
    color: {
      description: '선택된 아이템이나 호버 시 적용될 브랜드 컬러입니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: {
        category: 'Style',
        type: { summary: 'Color' },
      },
    },
    className: {
      description: '커스텀 스타일 적용을 위한 클래스명입니다.',
      control: 'text',
      table: { category: 'Style' },
    },

    // ⚙️ Configuration 카테고리
    id: {
      description: '`listbox` 역할의 고유 식별자입니다. ARIA 속성과 연동됩니다.',
      control: 'text',
      table: { category: 'Configuration' },
    },
    selectedId: {
      description: '현재 선택된 옵션의 ID입니다.',
      control: 'text',
      table: { category: 'Configuration' },
    },
    children: {
      description: '`OptionItem` 컴포넌트들이 위치하는 영역입니다.',
      table: { category: 'Configuration', type: { summary: 'ReactNode' } },
    },

    // 🖱️ Actions 카테고리
    onOptionSelect: {
      description: '옵션 클릭 시 해당 ID와 Value를 전달하는 콜백 함수입니다.',
      action: 'selected',
      table: {
        category: 'Actions',
        type: { summary: '(id: string, value: string) => void' },
      },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    id: 'calendar-option-list',
    children: undefined,
  },
} satisfies Meta<typeof CalendarOptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: args => {
    return (
      <SpecimenRow style={{ justifyContent: 'center' }}>
        <SpecimenCell>
          <AnatomyWrapper title='연도 선택' style={{ width: 'fit-content', margin: 'auto' }}>
            <CalendarOptionList {...args} aria-label='연도 옵션 리스트'>
              {calendarYearOptions.map((item, idx) => (
                <OptionItem
                  key={item.id}
                  variant='ghost'
                  color={args.color}
                  size='xs'
                  id={item.id}
                  value={item.value}
                  selected={idx === 2}
                />
              ))}
            </CalendarOptionList>
          </AnatomyWrapper>
        </SpecimenCell>
        <SpecimenCell>
          <AnatomyWrapper title='월 선택' style={{ width: 'fit-content', margin: 'auto' }}>
            <CalendarOptionList {...args} aria-label='월 옵션 리스트'>
              {calendarMonthOptions.map((item, idx) => (
                <OptionItem
                  key={item.id}
                  variant='ghost'
                  color={args.color}
                  size='xs'
                  id={item.id}
                  value={item.value}
                  selected={idx === 2}
                />
              ))}
            </CalendarOptionList>
          </AnatomyWrapper>
        </SpecimenCell>
      </SpecimenRow>
    );
  },
};

/**
 * * `CalendarOptionList`에 적용되는 다양한 브랜드 컬러 테마를 확인합니다.
 * * **사용 가이드**:
 * - **Primary**: 일반적인 날짜 선택(연도, 월) 시 표준으로 사용합니다.
 * - **Secondary / Tertiary**: 보조적인 정보나 대체 선택 그룹을 구분할 때 활용합니다.
 * - **Success / Warning / Danger**: 특정 기간의 예약 상태, 마감 임박, 선택 불가능한 날짜 등 데이터의 성격에 따른 상태 피드백이 필요한 경우 전략적으로 선택합니다.
 * - 각 컬러는 호버(Hover) 및 선택(Selected) 상태의 시각적 피드백에 반영됩니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {colorOptions.map((color, _) => (
          <SpecimenGroup key={color} title={color}>
            <CalendarOptionList {...args} color={color} aria-label='연도 옵션 리스트'>
              {calendarYearOptions.map((item, idx) => (
                <OptionItem
                  key={item.id}
                  variant='ghost'
                  color={color}
                  size='xs'
                  id={item.id}
                  value={item.value}
                  selected={idx === 2}
                />
              ))}
            </CalendarOptionList>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};
