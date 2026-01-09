import type { Meta, StoryObj } from '@storybook/react-vite';
import OptionList from './OptionList';
import OptionItem from '../OptionItem/OptionItem';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import { useId } from 'react';

/**
 * [OptionList]
 * 여러 개의 OptionItem을 그룹화하여 리스트 형태로 보여주는 컨테이너입니다.
 * - **Accessibility**: 내부적으로 `ul` 태그에 `role="listbox"`를 부여합니다.
 * - **Style Consistency**: 자식 아이템들에게 통일된 `variant`, `color`, `size`를 적용하기 위한 기준이 됩니다.
 */
const meta = {
  title: 'UI/Molecules/OptionList/Solid',
  component: OptionList,
  tags: ['autodocs'],

  argTypes: {
    // 1. 스타일 핵심 속성 (Appearance)
    variant: {
      description: '버튼의 스타일 유형을 결정합니다.',
      control: { type: 'inline-radio' },
      options: ['solid', 'outline'], // outline은 ghost 로직과 매칭 가능
      table: { category: 'Appearance', defaultValue: { summary: 'solid' } },
    },
    color: {
      description: '디자인 시스템의 6가지 표준 컬러 테마입니다.',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    size: {
      description: '컴포넌트의 크기를 정의합니다.',
      control: { type: 'inline-radio' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },

    // 2. 상태 및 값 제어 (State)
    selectedId: {
      description: '현재 선택된 옵션의 ID입니다. (Controlled 상태 제어)',
      control: { type: 'text' },
      table: { category: 'Status' },
    },

    // 3. 데이터 및 식별 (Content)
    id: {
      description: '컴포넌트의 고유 식별자입니다.',
      control: { type: 'text' },
      table: { category: 'Data' },
    },
    children: {
      description: '옵션 내부에 렌더링될 내용입니다.',
      control: { type: 'text' },
      table: { category: 'Data' },
    },

    // 4. 이벤트 및 기타 (Events/Misc)
    onOptionSelect: {
      description: '옵션이 클릭되었을 때 호출되는 콜백 함수입니다.',
      action: 'optionSelected',
      table: { category: 'Events' },
    },
    className: {
      description: '커스텀 스타일링을 위한 클래스명입니다.',
      control: { type: 'text' },
      table: { category: 'Misc' },
    },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'sm',
    id: 'base-option-list',
    children: undefined, // 필수 props 에러 방지
  },
} satisfies Meta<typeof OptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: args => {
    const uniqueId = useId();
    const uniqueValue = '옵션';

    return (
      <AnatomyWrapper title='OptionList' style={{ width: 'fit-content', margin: 'auto' }}>
        <OptionList {...args} aria-label='옵션 리스트'>
          {['', 1, 2, 3].map((item, idx) => (
            <OptionItem
              key={idx}
              variant='ghost'
              color={args.color}
              size={args.size}
              id={uniqueId}
              value={item === '' ? '옵션을 선택해 주세요' : `${uniqueValue} ${idx + 1}`}
              selected={idx === 1}
              disabled={item === ''}
            />
          ))}
        </OptionList>
      </AnatomyWrapper>
    );
  },
};

export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    const uniqueId = useId();
    const uniqueValue = '옵션';

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {colorOptions.map((color, _) => (
          <SpecimenGroup key={color} title={color}>
            <OptionList {...args} color={color} aria-label='옵션 리스트'>
              {['', 1, 2, 3].map((item, idx) => (
                <OptionItem
                  key={idx}
                  variant='ghost'
                  color={color}
                  size={args.size}
                  id={uniqueId}
                  value={item === '' ? '옵션을 선택해 주세요' : `${uniqueValue} ${idx + 1}`}
                  selected={idx === 1}
                  disabled={item === ''}
                />
              ))}
            </OptionList>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    const uniqueId = useId();
    const uniqueValue = '옵션';

    return (
      <SpecimenWrapper style={{ width: '450px', margin: 'auto' }}>
        {sizeOptions.map((size, _) => (
          <SpecimenGroup key={size} title={size.toUpperCase()}>
            <OptionList {...args} size={size} aria-label='옵션 리스트'>
              {['', 1, 2, 3].map((item, idx) => (
                <OptionItem
                  key={idx}
                  variant='ghost'
                  color={args.color}
                  size={size}
                  id={uniqueId}
                  value={item === '' ? '옵션을 선택해 주세요' : `${uniqueValue} ${idx + 1}`}
                  selected={idx === 1}
                  disabled={item === ''}
                />
              ))}
            </OptionList>
          </SpecimenGroup>
        ))}
      </SpecimenWrapper>
    );
  },
};

/**
 * [02. Long List & Scroll]
 * 항목이 많아질 때의 스크롤 영역과 레이아웃을 확인합니다.
 */
// export const ScrollView: Story = {
//   render: args => {

//     return (
//       <AnatomyWrapper title='Scrollable View' style={{ width: '200px' }}>
//         <OptionList {...args} style={{ maxHeight: '150px', overflowY: 'auto' }}>
//           {Array.from({ length: 10 }, (_, i) => (
//             <OptionItem
//               key={i}

//               id={`item-${i}`}
//               value={`항목 ${i + 1}`}
//               selected={i === 2}
//             />
//           ))}
//         </OptionList>
//       </AnatomyWrapper>
//     );
//   },
// };
