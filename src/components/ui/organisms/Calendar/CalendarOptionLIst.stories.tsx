import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarOptionList from './CalendarOptionList';
import OptionItem from '../../molecules/OptionItem/OptionItem';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

const meta = {
  title: 'UI/Organisms/Calendar/CalendarOptionList',
  component: CalendarOptionList,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    id: 'calendar-listbox',
    children: null, // 필수 Props 에러 방지
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
    },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof CalendarOptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 🎯 [Solution] StyleProps만 추출하는 유틸리티
 * args에서 HTML 요소와 관련된 모든 속성(id, onCopy, onSelect 등)을 제거하고
 * 디자인 시스템 토큰인 variant, color, size만 반환합니다.
 */
const getStyleProps = (args: any) => {
  const { variant, color, size } = args;
  return { variant, color, size };
};

export const Base: Story = {
  render: args => {
    const styleProps = getStyleProps(args);

    return (
      <AnatomyWrapper title='Standard Option List' style={{ width: '200px' }}>
        <CalendarOptionList {...args}>
          {/* styleProps만 전개하고 나머지는 명시적으로 전달 */}
          <OptionItem {...styleProps} id='opt-1' value='2024년' selected />
          <OptionItem {...styleProps} id='opt-2' value='2025년' />
          <OptionItem {...styleProps} id='opt-3' value='2026년' />
          <OptionItem {...styleProps} id='opt-4' value='2027년' disabled />
        </CalendarOptionList>
      </AnatomyWrapper>
    );
  },
};

export const ScrollView: Story = {
  render: args => {
    const styleProps = getStyleProps(args);

    return (
      <AnatomyWrapper title='Scrollable Container' style={{ width: '200px', height: '200px' }}>
        <CalendarOptionList {...args} style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {Array.from({ length: 10 }, (_, i) => (
            <OptionItem
              key={i}
              {...styleProps}
              id={`year-${i}`}
              value={`${2020 + i}년`}
              selected={i === 4}
            />
          ))}
        </CalendarOptionList>
      </AnatomyWrapper>
    );
  },
};

export const Colors: Story = {
  render: args => {
    const styleProps = getStyleProps(args);

    return (
      <SpecimenWrapper>
        {(['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const).map(
          color => (
            <SpecimenGroup key={color} title={color.toUpperCase()} direction='row'>
              <CalendarOptionList {...args} color={color} style={{ width: '150px' }}>
                <OptionItem
                  {...styleProps}
                  color={color}
                  id={`${color}-1`}
                  value='Option 1'
                  selected
                />
                <OptionItem {...styleProps} color={color} id={`${color}-2`} value='Option 2' />
              </CalendarOptionList>
            </SpecimenGroup>
          ),
        )}
      </SpecimenWrapper>
    );
  },
};
