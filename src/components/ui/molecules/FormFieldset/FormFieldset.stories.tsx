import type { Meta, StoryObj } from '@storybook/react-vite';
import FormFieldset from './FormFieldset';
import ControlGroup from '../ControlGroup/ControlGroup';
import FormField from '../FormField/FormField';
import Radio from '../../atoms/Radio/Radio';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Label from '../../atoms/Label/Label';
import ValidationMsg from '../../atoms/ValidationMsg/ValidationMsg';
import Icon from '../../atoms/Icon/Icon';
import { useId } from 'react';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

const meta = {
  title: 'UI/Molecules/FormFieldset',
  component: FormFieldset,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // 1. Contents & Slot (구조 및 정보 정보)
    legend: {
      control: 'text',
      description: `
**[접근성 필수]** 그룹 컨트롤의 제목(Context)을 정의합니다.
- **시맨틱**: \`<fieldset>\`의 자식인 \`<legend>\`로 렌더링되어, 스크린 리더가 그룹 진입 시 가장 먼저 읽어주는 핵심 정보입니다.
- **가이드**: 그룹의 목적을 명확히 알 수 있는 명사형 문구(예: '가입 경로', '약관 동의')를 권장합니다.
      `,
      table: {
        category: 'Contents',
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: '그룹 내부에 배치될 Radio, Checkbox 또는 FormField 컴포넌트들입니다.',
      table: {
        category: 'Contents',
        type: { summary: 'ReactNode' },
      },
    },

    // 2. Status & Feedback (상태 제어)
    required: {
      control: 'boolean',
      description:
        '그룹 내 필수 선택 여부를 나타냅니다. 활성 시 `legend` 옆에 에스터리스크(*) 표식이 생성됩니다.',
      table: {
        category: 'Status',
        defaultValue: { summary: 'false' },
      },
    },

    // 3. Styles & Layout (시각적 규격 정책)
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: `
그룹 전체의 스케일을 일괄 제어합니다.
- **Propagating**: 자식 요소로 \`Radio\`, \`Checkbox\` 등이 올 경우 부모의 \`size\`를 상속받아 시각적 일관성을 유지합니다.
      `,
      table: {
        category: 'Styles',
        defaultValue: { summary: 'md' },
      },
    },
    direction: {
      control: 'inline-radio',
      options: ['column', 'row'],
      description: `
레이블과 입력 요소의 배치 전략을 결정합니다.
- **column**: 정보 인지 부하가 낮아 복잡한 폼 작성 시 권장됩니다.
- **row**: 수직 공간이 제한적인 필터바나 툴바 레이아웃에 최적화되어 있습니다.
      `,
      table: {
        category: 'Styles',
        defaultValue: { summary: 'column' },
      },
    },

    // 4. Advanced (확장 및 커스텀)
    className: {
      control: 'text',
      description: '그룹 컨테이너의 레이아웃 조정을 위한 커스텀 클래스를 주입합니다.',
      table: {
        category: 'Advanced',
        type: { summary: 'string' },
      },
    },
    style: {
      control: 'object',
      description: '특수한 상황에서 그룹에 직접 부여할 인라인 스타일 객체입니다.',
      table: {
        category: 'Advanced',
        type: { summary: 'CSSProperties' },
      },
    },
  },
  args: {
    legend: '가입 경로 선택',
    size: 'md',
    children: null,
  },
} satisfies Meta<typeof FormFieldset>;

export default meta;

type Story = StoryObj<typeof meta>;

// 반복 데이터
const RADIO_OPTIONS = [
  { id: '1', label: '검색' },
  { id: '2', label: '지인 추천' },
  { id: '3', label: '광고' },
];
const CHECKBOX_TERMS_OPTIONS = [
  { id: '1', label: '서비스 이용약관 동의' },
  { id: '2', label: '개인정보 수집 및 이용 동의' },
  { id: '3', label: '마케팅 정보 수신 동의' },
];

/**
 * FormFieldset 내부에서 Radio와 Checkbox 그룹이 방향성(direction)에 따라
 * 레이블(Legend)과 어떻게 배치되는지 검증합니다.
 * - **Column Layout**: 레이블(Legend)이 상단에 위치하며, 그룹 요소들이 아래로 나열됩니다. 가장 안정적인 가독성을 제공합니다.
 * - **Row Layout**: 레이블과 그룹 요소가 수평으로 배치됩니다. 좁은 세로 공간을 효율적으로 활용해야 하는 대시보드나 필터바에 적합합니다.
 * - **A11y**: fieldset-legend 구조를 통해 스크린 리더 사용자에게 그룹의 맥락을 명확히 전달합니다.
 */
export const Base: Story = {
  render: args => {
    const uniqueId = useId();

    const renderGroupContent = (
      type: 'radio' | 'checkbox',
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined,
      idPrefix: string,
    ) => {
      const options = type === 'radio' ? RADIO_OPTIONS : CHECKBOX_TERMS_OPTIONS;
      const Component = type === 'radio' ? Radio : Checkbox;

      return (
        <ControlGroup role='group' size={size} ariaLabel={`${type} 그룹`}>
          {options.map(opt => (
            <FormField
              key={opt.id}
              as='label'
              htmlFor={`${uniqueId}-${idPrefix}-${opt.id}`}
              size={size}
              direction='row'
            >
              <Component
                as='span'
                id={`${uniqueId}-${idPrefix}-${opt.id}`}
                name={`${uniqueId}-${idPrefix}`}
                size={size}
                defaultChecked={opt.id === '1' || (opt as any).required}
              />
              <Label size={size}>{opt.label}</Label>
            </FormField>
          ))}
        </ControlGroup>
      );
    };

    return (
      <SpecimenWrapper>
        <SpecimenGroup direction='column' style={{ gap: '40px' }}>
          {/* 1. Radio Group Section */}
          <SpecimenCell caption='radio'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend='가입 경로 선택' direction='column'>
                  {renderGroupContent('radio', args.size, 'r-col')}
                </FormFieldset>
              </AnatomyWrapper>

              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend='가입 경로 선택' direction='row'>
                  {renderGroupContent('radio', args.size, 'r-row')}
                </FormFieldset>
              </AnatomyWrapper>
            </div>
          </SpecimenCell>

          {/* 2. Checkbox Group Section */}
          <SpecimenCell caption='checkbox'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend='약관 동의' direction='column'>
                  {renderGroupContent('checkbox', args.size, 'c-col')}
                </FormFieldset>
              </AnatomyWrapper>

              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend='약관 동의' direction='row'>
                  {renderGroupContent('checkbox', args.size, 'c-row')}
                </FormFieldset>
              </AnatomyWrapper>
            </div>
          </SpecimenCell>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * [02. Status / Required Indicators]
 * 필수 입력 항목(`required: true`)에 대한 시각적 표식과 레이아웃 대응을 검증합니다.
 * - **Visual Cue**: 레이블 우측에 에스터리스크(*)가 누락 없이 표시되는지 확인합니다.
 * - **Consistency**: 단일 입력(Input)과 그룹 입력(Radio Group) 모두에서 필수 표식이 동일한 위계로 노출되는지 체크합니다.
 * - **Layout Adaptability**: `row` 레이아웃에서 레이블이 필수 표식과 함께 출력될 때 인풋과의 간격이 적절한지 검수합니다.
 */
export const Required: Story = {
  args: {
    required: true,
    size: 'md',
  },
  render: args => {
    const uniqueId = useId();

    // 1. 반복 데이터 외부 참조 (2025-12-26 최적화)
    const RADIO_OPTIONS = [
      { id: '1', label: '검색' },
      { id: '2', label: '지인 추천' },
      { id: '3', label: '광고' },
    ];

    return (
      <SpecimenWrapper style={{ width: '600px' }}>
        {/* CASE 1. COLUMN LAYOUT (Required) */}
        <SpecimenGroup title='column (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 라디오 그룹 */}
            <AnatomyWrapper minimal>
              <FormFieldset {...args} legend='가입 경로 선택' size={args.size} direction='column'>
                <ControlGroup role='group' size={args.size} ariaLabel='가입 경로 필수 선택'>
                  {RADIO_OPTIONS.map(opt => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-r-col-${opt.id}`}
                      size={args.size}
                      direction='row'
                    >
                      <Radio
                        as='span'
                        id={`${uniqueId}-r-col-${opt.id}`}
                        name={`${uniqueId}-r-grp-col`}
                        size={args.size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={args.size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>
          </SpecimenGroup>
        </SpecimenGroup>

        {/* CASE 2. ROW LAYOUT (Required) */}
        <SpecimenGroup title='row (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 라디오 그룹 */}
            <AnatomyWrapper minimal>
              <FormFieldset {...args} legend='가입 경로 선택' size={args.size} direction='row'>
                <ControlGroup role='group' size={args.size} ariaLabel='가입 경로 필수 선택'>
                  {RADIO_OPTIONS.map(opt => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-r-row-${opt.id}`}
                      size={args.size}
                      direction='row'
                    >
                      <Radio
                        as='span'
                        id={`${uniqueId}-r-row-${opt.id}`}
                        name={`${uniqueId}-r-grp-row`}
                        size={args.size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={args.size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>
          </SpecimenGroup>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * XL부터 XS까지 5단계 사이즈에 따른 입력 요소와 그룹 레이아웃의 시각적 변화를 검증합니다.
 * - **Scaling Consistency**: 사이즈가 작아짐에 따라 폰트, 패딩, 간격(Gap)이 비례하여 축소되는지 확인합니다.
 * - **Layout Adaptability**: `row` 레이아웃에서 작은 사이즈(SM, XS) 적용 시 레이블과 컨트롤의 정렬이 유지되는지 체크합니다.
 * - **Hit Area**: XS 사이즈에서도 `label-input` 연결을 통해 최소한의 클릭 영역이 확보되는지 검수합니다.
 */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '700px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => {
        const uniqueId = useId();

        return (
          <SpecimenGroup title={size.toUpperCase()} direction='column' style={{ gap: '10px' }}>
            <AnatomyWrapper
              minimal
              style={{
                ...((size === 'xl' || size === 'lg') && {
                  width: 'max-content',
                }),
              }}
            >
              <FormFieldset {...args} size={size} legend='가입 경로 선택' direction='column'>
                <ControlGroup role='group' size={size} ariaLabel='가입 경로 그룹'>
                  {RADIO_OPTIONS.map((opt, idx) => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-${opt.id}-${size}-col-radio-${idx}`}
                      size={size}
                      direction='row'
                    >
                      <Radio
                        as='span'
                        id={`${uniqueId}-${opt.id}-${size}-col-radio-${idx}`}
                        name={`${uniqueId}-r-group-col-${size}-radio`}
                        size={size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>
            <AnatomyWrapper
              minimal
              style={{
                ...((size === 'xl' || size === 'lg') && {
                  width: 'max-content',
                }),
              }}
            >
              <FormFieldset {...args} legend='가입 경로 선택' size={size} direction='row'>
                <ControlGroup role='group' size={size} ariaLabel='가입 경로 그룹'>
                  {RADIO_OPTIONS.map((opt, idx) => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-${opt.id}-${size}-row-radio-${idx}`}
                      size={size}
                      direction='row'
                    >
                      <Radio
                        as='span'
                        id={`${uniqueId}-${opt.id}-${size}-row-radio-${idx}`}
                        name={`${uniqueId}-r-group-row-${size}-radio`}
                        size={size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>

            <AnatomyWrapper
              minimal
              style={{
                ...((size === 'xl' || size === 'lg') && {
                  width: 'max-content',
                }),
              }}
            >
              <FormFieldset {...args} size={size} legend='가입 경로 선택' direction='column'>
                <ControlGroup role='group' size={size} ariaLabel='가입 경로 그룹'>
                  {CHECKBOX_TERMS_OPTIONS.map((opt, idx) => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-${opt.id}-${size}-col-checkbox-${idx}`}
                      size={size}
                      direction='row'
                    >
                      <Checkbox
                        as='span'
                        id={`${uniqueId}-${opt.id}-${size}-col-checkbox-${idx}`}
                        name={`${uniqueId}-r-group-col-${size}-checkbox`}
                        size={size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>
            <AnatomyWrapper
              minimal
              style={{
                ...((size === 'xl' || size === 'lg') && {
                  width: 'max-content',
                }),
              }}
            >
              <FormFieldset {...args} size={size} legend='가입 경로 선택' direction='row'>
                <ControlGroup role='group' size={size} ariaLabel='가입 경로 그룹'>
                  {CHECKBOX_TERMS_OPTIONS.map((opt, idx) => (
                    <FormField
                      key={opt.id}
                      as='label'
                      htmlFor={`${uniqueId}-${opt.id}-${size}-row-checkbox-${idx}`}
                      size={size}
                      direction='row'
                    >
                      <Checkbox
                        as='span'
                        id={`${uniqueId}-${opt.id}-${size}-row-checkbox-${idx}`}
                        name={`${uniqueId}-r-group-row-${size}-checkbox`}
                        size={size}
                        defaultChecked={opt.id === '1'}
                      />
                      <Label size={size}>{opt.label}</Label>
                    </FormField>
                  ))}
                </ControlGroup>
              </FormFieldset>
            </AnatomyWrapper>
          </SpecimenGroup>
        );
      })}
    </SpecimenWrapper>
  ),
};
