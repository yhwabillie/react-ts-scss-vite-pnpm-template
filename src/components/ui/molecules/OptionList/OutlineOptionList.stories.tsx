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
  title: 'UI/Molecules/OptionList/Outline',
  component: OptionList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**OptionList (Outline)**는 여러 개의 `OptionItem`을 논리적/시각적으로 그룹화하는 리스트 컨테이너입니다. <br /><br />' +
          '• 내부적으로 `<ul>` 태그와 `role="listbox"`를 사용하여 표준 리스트박스 구조를 형성합니다. <br />' +
          '• 테두리가 강조된 컨테이너 스타일로, 드롭다운 메뉴나 선택 목록의 경계를 명확하게 구분해 줍니다. <br />' +
          '• 자식 요소인 OptionItem들이 통일된 `color`, `size`를 상속받을 수 있도록 맥락을 제공합니다.',
      },
    },
  },

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
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    id: 'base-option-list',
    children: undefined,
  },
} satisfies Meta<typeof OptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 가장 기본적인 구성입니다.
 * Outline 컨테이너 내부에서 Ghost 타입의 아이템들이 조화롭게 배치되는지 확인합니다.
 */
export const Base: Story = {
  render: args => {
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
              id={idx.toString()}
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

/**
 * 디자인 시스템의 6가지 시멘틱 컬러 테마가 적용된 리스트를 비교합니다.
 * - **Visual Consistency**: 리스트 전체의 테두리 컬러와 내부 아이템의 선택 상태(Selected) 컬러가 일관되게 적용되는지 검수합니다.
 * - **A11y Check**: 배경색과 보더 라인의 명도 대비가 각 컬러 테마에서도 충분히 확보되는지 확인합니다.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

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
                  id={idx.toString()}
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
 * XL부터 XS까지 5단계 크기 변이에 따른 리스트의 너비와 내부 아이템의 높이 변화를 확인합니다.
 * - **Size Management**: 부모인 OptionList의 사이즈 설정에 따라 자식 아이템들의 텍스트 크기와 패딩이 동기화되는지 검증합니다.
 * - **Touch Target**: 특히 작은 사이즈(SM, XS)에서 리스트 항목 간의 클릭 영역이 충분히 분리되어 오클릭을 방지하는지 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];
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
                  id={idx.toString()}
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
