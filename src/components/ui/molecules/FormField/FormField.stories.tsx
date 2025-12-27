import type { Meta, StoryObj } from '@storybook/react-vite';
import FormField from '@/components/ui/molecules/FormField/FormField';
import Input from '@/components/ui/atoms/Input/Input';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import Label from '../../atoms/Label/Label';
import { useId } from 'react';
import { GuideCell, GuideRow, GuideWrapper } from '../../guide/Guide';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import ControlGroup from '../ControlGroup/ControlGroup';

const meta = {
  title: 'UI/Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // 1. Identification (식별 및 시맨틱 연결)
    id: {
      control: 'text',
      description:
        '입력 요소의 고유 ID입니다. `htmlFor`와 매칭되어 보조 기술(스크린 리더)의 레이블 인식을 돕습니다.',
      table: {
        category: 'Identification',
        type: { summary: 'string' },
      },
    },
    htmlFor: {
      control: 'text',
      description: `
**[접근성 필수]** 레이블과 컨트롤을 논리적으로 연결합니다.
- **연결 효과**: 텍스트 클릭 시 해당 입력창으로 포커스가 이동하여 **Fitts's Law**에 따른 사용성을 개선합니다.
- **A11y**: 스크린 리더가 입력창에 진입했을 때 어떤 정보를 입력해야 하는지 읽어주는 근거가 됩니다.
      `,
      table: { category: 'Identification' },
    },

    // 2. Contents & Slots (정보 전달)
    labelText: {
      control: 'text',
      description:
        '사용자에게 입력 목적을 알리는 기본 텍스트입니다. 명확하고 간결한 명사형 사용을 권장합니다.',
      table: { category: 'Contents' },
    },
    children: {
      control: false,
      description:
        '실제 입력 컴포넌트(Input, Select 등) 또는 하단 도움말/에러 메시지가 배치되는 슬롯입니다.',
      table: {
        category: 'Contents',
        type: { summary: 'ReactNode' },
      },
    },

    // 3. Styles & Layout (시각적 위계 및 배치)
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '시스템 폰트 스택 및 간격 규격에 따른 전체 스케일을 결정합니다.',
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

    // 4. Status (유효성 및 상태)
    required: {
      control: 'boolean',
      description:
        '필수 값 여부를 나타냅니다. 활성화 시 시각적 표식(*)과 함께 HTML5 유효성 검사 속성이 부여됩니다.',
      table: { category: 'Status' },
    },

    // 5. Utility & Advanced (확장성)
    as: {
      control: 'text',
      description:
        '시맨틱 마크업을 위해 최상위 태그를 변경합니다. 폼 그룹화 시 `fieldset` 사용을 고려하세요.',
      table: {
        category: 'Advanced',
        defaultValue: { summary: 'div' },
      },
    },
    className: {
      control: 'text',
      description: '외부 레이아웃(Grid/Flex)과의 정렬을 위한 추가 클래스 주입구입니다.',
      table: { category: 'Advanced' },
    },
  },
  args: {
    size: 'md',
    direction: 'column',
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

// 반복 데이터
const RADIO_OPTIONS = [
  { id: '1', label: '검색' },
  { id: '2', label: '지인 추천' },
  { id: '3', label: '광고' },
];

/**
 * [01. Base / Layout Specimen]
 * FormField 내에서 단일 입력 요소(Input)와 그룹 요소(Radio/Checkbox)가
 * 방향성(direction)에 따라 어떻게 시각적으로 정렬되는지 검증합니다.
 * - **Column (Primary)**: 레이블이 상단에 위치하여 폼의 너비를 충분히 활용합니다. 모바일 및 정보 입력 중심 폼에 적합합니다.
 * - **Row (Secondary)**: 레이블과 입력 요소가 가로로 배치됩니다. 공간이 제한적이거나 필터바 등 유틸리티 영역에 권장됩니다.
 * - **Alignment**: `SpecimenGroup` 내에서 `alignItems: flex-end` 설정을 통해 요소들의 우측 정렬 가독성을 테스트합니다.
 */
export const Base: Story = {
  args: {
    size: 'md',
    required: false,
  },
  render: args => {
    const uniqueId = useId();

    return (
      <SpecimenWrapper style={{ width: '600px' }}>
        {/* CASE 1. COLUMN LAYOUT: 수직 적층 구조 */}
        <SpecimenGroup title='column'>
          <SpecimenGroup direction='column' style={{ gap: '16px', alignItems: 'flex-end' }}>
            {/* Input 영역 */}
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText='이메일 주소'
                direction='column'
                htmlFor={`${uniqueId}-in-col`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-in-col`}
                  size={args.size}
                  placeholder='example@mail.com'
                  variant='solid'
                />
              </FormField>
            </AnatomyWrapper>
          </SpecimenGroup>
        </SpecimenGroup>

        {/* CASE 2. ROW LAYOUT: 수평 병렬 구조 */}
        <SpecimenGroup title='row'>
          <SpecimenGroup direction='column' style={{ gap: '16px', alignItems: 'flex-end' }}>
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText='이메일 주소'
                direction='row'
                htmlFor={`${uniqueId}-in-row`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-in-row`}
                  size={args.size}
                  placeholder='example@mail.com'
                  variant='solid'
                />
              </FormField>
            </AnatomyWrapper>
          </SpecimenGroup>
        </SpecimenGroup>

        {/* CASE 3. STANDALONE: 개별 요소 수평 배치 */}
        <SpecimenGroup title='standalone (row)'>
          <div style={{ display: 'flex', gap: '20px' }}>
            <AnatomyWrapper minimal>
              <FormField
                as='label'
                htmlFor={`${uniqueId}-single-r`}
                size={args.size}
                direction='row'
              >
                <Radio
                  as='span'
                  id={`${uniqueId}-single-r`}
                  name='gender'
                  size={args.size}
                  defaultChecked
                />
                <Label size={args.size}>사용자 (여)</Label>
              </FormField>
            </AnatomyWrapper>

            <AnatomyWrapper minimal>
              <FormField
                as='label'
                htmlFor={`${uniqueId}-single-c`}
                size={args.size}
                direction='row'
              >
                <Checkbox as='span' id={`${uniqueId}-single-c`} size={args.size} defaultChecked />
                <Label size={args.size}>마케팅 동의</Label>
              </FormField>
            </AnatomyWrapper>
          </div>
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
            {/* 필수 인풋 */}
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText='이메일 주소'
                direction='column'
                htmlFor={`${uniqueId}-col-req`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-col-req`}
                  size={args.size}
                  placeholder='example@mail.com'
                  variant='solid'
                />
              </FormField>
            </AnatomyWrapper>
          </SpecimenGroup>
        </SpecimenGroup>

        {/* CASE 2. ROW LAYOUT (Required) */}
        <SpecimenGroup title='row (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 인풋 */}
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText='이메일 주소'
                direction='row'
                htmlFor={`${uniqueId}-row-req`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-row-req`}
                  size={args.size}
                  placeholder='example@mail.com'
                  variant='solid'
                />
              </FormField>
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
          <SpecimenGroup title={size.toUpperCase()}>
            <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
              <AnatomyWrapper
                minimal
                style={{
                  ...(size === 'xl' && { width: '650px' }),
                }}
              >
                <FormField
                  {...args}
                  labelText='이메일 주소'
                  direction='column'
                  size={size}
                  htmlFor={`${uniqueId}-col-${size}-col-input`}
                >
                  <Input
                    as='div'
                    id={`${uniqueId}-col-${size}-col-input`}
                    size={size}
                    placeholder='example@mail.com'
                    variant='solid'
                  />
                </FormField>
              </AnatomyWrapper>
              <AnatomyWrapper
                minimal
                style={{
                  ...(size === 'xl' && { width: '650px' }),
                }}
              >
                <FormField
                  {...args}
                  size={size}
                  labelText='이메일 주소'
                  direction='row'
                  htmlFor={`${uniqueId}-col-${size}-row-input`}
                >
                  <Input
                    as='div'
                    id={`${uniqueId}-col-${size}-row-input`}
                    size={size}
                    placeholder='example@mail.com'
                    variant='solid'
                  />
                </FormField>
              </AnatomyWrapper>
              <AnatomyWrapper minimal>
                <FormField
                  as='label'
                  htmlFor={`${uniqueId}-${size}-single-r`}
                  size={size}
                  direction='row'
                >
                  <Radio
                    as='span'
                    id={`${uniqueId}-${size}-single-r`}
                    name={`${uniqueId}-${size}-single-r`}
                    size={size}
                    defaultChecked
                  />
                  <Label size={size}>사용자 (여)</Label>
                </FormField>
              </AnatomyWrapper>
              <AnatomyWrapper minimal>
                <FormField
                  as='label'
                  htmlFor={`${uniqueId}-${size}-single-c`}
                  size={size}
                  direction='row'
                >
                  <Checkbox
                    as='span'
                    id={`${uniqueId}-${size}-single-c`}
                    name={`${uniqueId}-${size}-single-c`}
                    size={size}
                    defaultChecked
                  />
                  <Label size={size}>마케팅 동의</Label>
                </FormField>
              </AnatomyWrapper>
            </SpecimenGroup>
          </SpecimenGroup>
        );
      })}
    </SpecimenWrapper>
  ),
};
