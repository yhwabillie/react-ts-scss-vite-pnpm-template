import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarOptionList from './CalendarOptionList';
import OptionItem from '../../molecules/OptionItem/OptionItem';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useMemo } from 'react';
import { getCalendarMonthOptions, getCalendarYearOptions } from './Calendar.mock';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Organisms/Calendar/CalendarOptionList',
  component: CalendarOptionList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**CalendarOptionList**는 달력 상단에서 연도나 월을 선택하기 위해 사용되는 스크롤 가능한 옵션 목록입니다. <br /><br />' +
          '• **Semantic Listbox**: `role="listbox"`를 통해 보조 공학 기기에 선택 가능한 목록임을 명확히 전달합니다. <br />' +
          '• **Scroll Optimization**: `max-height`를 통해 고정된 영역 내에서 다량의 옵션(예: 100년 단위 연도)을 효율적으로 탐색할 수 있습니다. <br />' +
          '• **Consistent Interaction**: 내부 `OptionItem`들과 연동되어 일관된 호버 및 선택 시각적 피드백을 제공합니다.',
      },
    },
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

/**
 * 연도와 월을 선택하는 가장 기본적인 리스트 형태를 확인합니다.
 * - **UX**: `AnatomyWrapper`를 통해 연도(수치 위주)와 월(텍스트 위주) 각각의 너비 최적화 상태를 점검합니다.
 * - **A11y**: 스토리북 자동 검사 도구의 한계로 인해 `color-contrast` 및 `scrollable-region-focusable` 규칙은 비활성화되어 있으나, 실제 스크롤 영역의 포커스 동작은 수동 검수가 필요합니다.
 */
export const Base: Story = {
  render: args => {
    const { i18n } = useTranslation();
    const yearOptions = useMemo(() => getCalendarYearOptions(i18n.language), [i18n.language]);
    const monthOptions = useMemo(() => getCalendarMonthOptions(i18n.language), [i18n.language]);

    return (
      <SpecimenRow style={{ justifyContent: 'center' }}>
        <SpecimenCell>
          <AnatomyWrapper title='연도 선택' style={{ width: 'fit-content', margin: 'auto' }}>
            <CalendarOptionList {...args} aria-label='연도 옵션 리스트'>
              {yearOptions.map((item, idx) => (
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
              {monthOptions.map((item, idx) => (
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
 * [02. Colors]
 * 브랜드 컬러 시스템에 따른 선택 및 호버 상태의 변화를 점검합니다.
 * - **Usage**: Primary(표준), Success(예약 가능), Danger(마감/불가) 등 데이터의 상태에 맞춘 컬러 전략을 제안합니다.
 */
export const Colors: Story = {
  render: args => {
    const { i18n } = useTranslation();
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    const yearOptions = useMemo(() => getCalendarYearOptions(i18n.language), [i18n.language]);

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {colorOptions.map((color, _) => (
          <SpecimenGroup key={color} title={color}>
            <CalendarOptionList {...args} color={color} aria-label='연도 옵션 리스트'>
              {yearOptions.map((item, idx) => (
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
