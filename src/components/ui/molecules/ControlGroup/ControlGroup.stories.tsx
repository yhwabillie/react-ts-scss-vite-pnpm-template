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
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Molecules/ControlGroup',
  component: ControlGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**ControlGroup**은 라디오, 체크박스 등 연관된 선택 요소들을 논리적으로 그룹화하여 일관된 레이아웃과 접근성 맥락을 제공합니다. <br /><br />' +
          '• `role="group"`을 통해 여러 컨트롤이 하나의 주제(Question)에 속해 있음을 보조 기술에 전달 <br />' +
          '• 내부 요소 간의 일정한 간격과 정렬을 유지하며, 부모의 사이즈가 자식 요소에 일괄 적용되도록 설계 <br />' +
          '• 그룹 전체에 대한 `aria-label`을 통해 시각적 라벨이 없는 상황에서도 맥락 파악 가능',
      },
    },
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
 * Radio 및 Checkbox 등 선택형 요소들을 그룹화한 기본 형태입니다.
 * - **복합 구성**: `FormField`와 결합하여 라벨 클릭 범위를 확장하고, `useId`를 통해 컨트롤의 ID와 레이블의 `htmlFor`를 동기화합니다.
 * - **맥락 유지**: 단일 선택(Radio)과 다중 선택(Checkbox) 상황에서 그룹 내부 아이템들이 시각적으로 조화롭게 배치되는지 확인합니다.
 */
export const Base: Story = {
  render: args => {
    const baseId = useId();
    const { t } = useTranslation();

    const CONTROL_TYPES = [
      { type: 'radio', label: 'Radio ControlGroup', Component: Radio },
      { type: 'checkbox', label: 'Checkbox ControlGroup', Component: Checkbox },
    ] as const;

    const OPTIONS = [
      { label: t('control-group.options.label_a'), defaultChecked: true },
      { label: t('control-group.options.label_b') },
      { label: t('control-group.options.label_c') },
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
 * 시스템 표준 5가지 사이즈(XL ~ XS)에 따른 그룹 내부 요소들의 시각적 변화를 검증합니다.
 * - **동기화**: 부모(ControlGroup)에서 설정한 `size`가 내부의 모든 자식(`FormField`, `Radio/Checkbox`, `Label`)에 전파되어 일관된 스케일을 유지하는지 체크합니다.
 * - **사용성**: 가장 작은 XS 사이즈에서도 `label-input` 연결을 통해 충분한 터치/클릭 영역(Hit Area)이 확보되는지 검수합니다.
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
