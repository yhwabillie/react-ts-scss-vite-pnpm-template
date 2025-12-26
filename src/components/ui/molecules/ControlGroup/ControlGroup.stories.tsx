import type { Meta, StoryObj } from '@storybook/react-vite';
import ControlGroup from './ControlGroup';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import FormField from '../FormField/FormField';
import Label from '../../atoms/Label/Label';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenRow } from '../../guide/Specimen';
import { GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useId } from 'react';

const meta = {
  title: 'UI/Molecules/ControlGroup',
  component: ControlGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // 1. Accessibility (접근성 및 시맨틱)
    role: {
      control: 'inline-radio',
      options: ['group', 'toolbar'],
      description: `
컴포넌트의 논리적 역할을 정의합니다.
- **group**: 관련 있는 입력 요소들의 집합 (예: 설문 항목)
- **toolbar**: 공통 작업을 수행하는 버튼들의 집합 (예: 에디터 도구모음)
      `,
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'group' },
      },
    },
    ariaLabel: {
      control: 'text',
      description:
        '시각적 라벨이 없을 때 스크린 리더가 이 그룹의 목적을 식별할 수 있도록 제공하는 설명입니다.',
      table: { category: 'Accessibility' },
    },

    // 2. Styles & Layout (시각적 규격 및 배치)
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '내부 아이템(Button, Input 등)의 공통 크기 규격입니다.',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'md' },
      },
    },

    // 3. Contents & Utility (내부 요소 및 확장)
    children: {
      control: false,
      description: '그룹 내부에 배치될 구성 요소들입니다.',
      table: {
        category: 'Advanced',
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: '커스텀 스타일 및 여백(Margin/Padding) 조정을 위한 클래스명입니다.',
      table: { category: 'Advanced' },
    },
  },
  args: {
    size: 'xl',

    role: 'group',
    children: undefined,
    ariaLabel: '선택 옵션 그룹',
  },
} satisfies Meta<typeof ControlGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Radio 및 Checkbox 등 선택형 요소들을 그룹화하여 일관된 레이아웃과 접근성을 제공하는 기본 구성입니다.
 * - **복합 구성**: 단일 그룹 내에서 `FormField`와 결합하여 라벨 클릭 범위 확장 및 시각적 위계를 관리합니다.
 * - **ID 관리**: `useId`와 맵핑 로직을 통해 `htmlFor`와 `id`를 동기화하여 접근성 결함을 방지합니다.
 */
export const Base: Story = {
  render: args => {
    const baseId = useId();

    const CONTROL_TYPES = [
      { type: 'radio', label: 'Radio ControlGroup', Component: Radio },
      { type: 'checkbox', label: 'Checkbox ControlGroup', Component: Checkbox },
    ] as const;

    const OPTIONS = [
      { label: '옵션 1', defaultChecked: true },
      { label: '옵션 2' },
      { label: '옵션 3' },
    ];

    return (
      <GuideGroup direction='column'>
        {CONTROL_TYPES.map(({ type, label, Component }) => {
          const groupId = `${baseId}-${type}`;

          return (
            <GuideWrapper key={groupId} title={label}>
              <SpecimenRow>
                <SpecimenCell>
                  <AnatomyWrapper minimal={true}>
                    <ControlGroup {...args}>
                      {OPTIONS.map((option, idx) => {
                        const fieldId = `${groupId}-opt-${idx}`;

                        return (
                          <FormField key={fieldId} as='label' htmlFor={fieldId} size={args.size}>
                            <Component
                              as='span'
                              id={fieldId}
                              name={groupId}
                              color='primary'
                              size={args.size}
                              value={option.label}
                              defaultChecked={option.defaultChecked}
                            />
                            <Label size={args.size}>{option.label}</Label>
                          </FormField>
                        );
                      })}
                    </ControlGroup>
                  </AnatomyWrapper>
                </SpecimenCell>
              </SpecimenRow>
            </GuideWrapper>
          );
        })}
      </GuideGroup>
    );
  },
};

/**
 * [02. Sizes / Scaling Synchronization]
 * 시스템 표준 5가지 사이즈(XL ~ XS)에 따른 그룹 내 요소들의 시각적 조화를 확인합니다.
 * - **동기화**: 부모(`ControlGroup`)의 사이즈가 모든 자식(`FormField`, `Radio/Checkbox`, `Label`)에 전파되는지 확인합니다.
 * - **가독성**: 작은 사이즈(SM, XS)에서도 체크 표시나 라벨의 텍스트가 뭉쳐 보이지 않는지 검수합니다.
 * - **터치 영역**: XS 사이즈의 경우, 접근성 가이드에 따라 최소 클릭 영역이 확보되었는지 체크합니다.
 */
export const Sizes: Story = {
  render: args => {
    const baseId = useId();

    // 1. 상수 데이터 추출 (렌더링 최적화 및 가독성)
    const SIZE_OPTIONS = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
    const CONTROL_TYPES = [
      { type: 'radio', Component: Radio },
      { type: 'checkbox', Component: Checkbox },
    ] as const;

    const SAMPLE_OPTIONS = [
      { label: '옵션 1', defaultChecked: true },
      { label: '옵션 2' },
      { label: '옵션 3' },
    ];

    return (
      <GuideGroup direction='column'>
        {SIZE_OPTIONS.map(size => (
          <GuideWrapper key={`${baseId}-${size}`} title={`${size.toUpperCase()}`}>
            {CONTROL_TYPES.map(({ type, Component }) => {
              const groupId = `${baseId}-${size}-${type}`;

              return (
                <SpecimenRow key={groupId}>
                  <SpecimenCell>
                    <AnatomyWrapper minimal={true}>
                      <ControlGroup {...args} size={size}>
                        {SAMPLE_OPTIONS.map((option, idx) => {
                          const fieldId = `${groupId}-opt-${idx}`;

                          return (
                            <FormField key={fieldId} as='label' htmlFor={fieldId} size={size}>
                              <Component
                                as='span'
                                id={fieldId}
                                name={type === 'radio' ? groupId : fieldId}
                                color='primary'
                                size={size}
                                value={option.label}
                                defaultChecked={option.defaultChecked}
                              />
                              <Label size={size}>{option.label}</Label>
                            </FormField>
                          );
                        })}
                      </ControlGroup>
                    </AnatomyWrapper>
                  </SpecimenCell>
                </SpecimenRow>
              );
            })}
          </GuideWrapper>
        ))}
      </GuideGroup>
    );
  },
};
