import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionList from './OptionList';
import OptionItem from '../OptionItem/OptionItem';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

/**
 * [OptionList]
 * 여러 개의 OptionItem을 그룹화하여 리스트 형태로 보여주는 컨테이너입니다.
 * - **Accessibility**: 내부적으로 `ul` 태그에 `role="listbox"`를 부여합니다.
 * - **Style Consistency**: 자식 아이템들에게 통일된 `variant`, `color`, `size`를 적용하기 위한 기준이 됩니다.
 */
const meta = {
  title: 'UI/Molecules/OptionList',
  component: OptionList,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    id: 'base-option-list',
    children: null, // 필수 props 에러 방지
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'brand', 'success', 'warning', 'danger'],
    },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    onOptionSelect: { action: 'optionSelected' },
  },
} satisfies Meta<typeof OptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 💡 OptionItem 전달용 Props 추출 유틸리티
 * List의 args 중 아이템의 스타일에 영향을 주는 속성만 골라냅니다.
 */
const getOptionStyleProps = (args: any) => {
  const { variant, color, size } = args;
  // OptionList는 'soft'를 지원하지만 OptionItem은 'solid' 등을 지원할 수 있으므로 타입 호환성 확인 필요
  return { variant: variant === 'soft' ? 'solid' : variant, color, size };
};

export const Base: Story = {
  render: args => {
    const itemProps = getOptionStyleProps(args);
    return (
      <AnatomyWrapper title='Standard Option List' style={{ width: '200px' }}>
        <OptionList {...args}>
          <OptionItem {...itemProps} id='1' value='옵션 항목 1' selected />
          <OptionItem {...itemProps} id='2' value='옵션 항목 2' />
          <OptionItem {...itemProps} id='3' value='옵션 항목 3' />
          <OptionItem {...itemProps} id='4' value='비활성 항목' disabled />
        </OptionList>
      </AnatomyWrapper>
    );
  },
};

/**
 * [02. Long List & Scroll]
 * 항목이 많아질 때의 스크롤 영역과 레이아웃을 확인합니다.
 */
export const ScrollView: Story = {
  render: args => {
    const itemProps = getOptionStyleProps(args);
    return (
      <AnatomyWrapper title='Scrollable View' style={{ width: '200px' }}>
        <OptionList {...args} style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {Array.from({ length: 10 }, (_, i) => (
            <OptionItem
              key={i}
              {...itemProps}
              id={`item-${i}`}
              value={`항목 ${i + 1}`}
              selected={i === 2}
            />
          ))}
        </OptionList>
      </AnatomyWrapper>
    );
  },
};

/**
 * [03. Color Variations]
 * 주요 브랜드 컬러 및 시맨틱 컬러가 리스트 전체에 적용된 모습입니다.
 */
export const Colors: Story = {
  render: args => (
    <SpecimenWrapper>
      {(['primary', 'secondary', 'tertiary', 'success', 'danger'] as const).map(color => (
        <SpecimenGroup key={color} title={color.toUpperCase()} direction='row'>
          <OptionList {...args} color={color} style={{ width: '160px' }}>
            <OptionItem
              {...getOptionStyleProps({ ...args, color })}
              id={`${color}-1`}
              value='선택됨'
              selected
            />
            <OptionItem
              {...getOptionStyleProps({ ...args, color })}
              id={`${color}-2`}
              value='기본'
            />
          </OptionList>
        </SpecimenGroup>
      ))}
    </SpecimenWrapper>
  ),
};
