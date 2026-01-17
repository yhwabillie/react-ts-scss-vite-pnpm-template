import type { Meta, StoryObj } from '@storybook/react-vite';
import FormField from '@/components/ui/molecules/FormField/FormField';
import Input from '@/components/ui/atoms/Input/Input';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import Label from '../../atoms/Label/Label';
import { useId } from 'react';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**FormField**는 레이블(Label), 입력 요소(Input/Control), 그리고 도움말 및 에러 메시지를 하나로 묶어주는 폼 구성의 최소 단위입니다. <br /><br />' +
          '•`htmlFor`와 `id`를 매핑하여 클릭 영역 확장 및 스크린 리더 접근성 확보 <br />' +
          '• 정보 인지 부하가 낮은 수직(Column) 배치와 공간 효율적인 수평(Row) 배치 지원 <br />' +
          '• 필수 입력 표식 및 사이즈별 간격 규격을 일관되게 유지하여 폼의 완성도 향상',
      },
    },
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

/**
 * 입력 요소의 성격(단일 인풋 vs 그룹 라디오)과 방향성에 따른 정렬 방식을 확인합니다.
 * - **Column**: 레이블이 상단에 위치하여 모바일 환경 및 복잡한 입력 양식에 권장됩니다.
 * - **Row**: 레이블과 인풋이 가로로 배치되어 필터바나 공간이 좁은 영역에 적합합니다.
 */
export const Base: Story = {
  args: {
    size: 'md',
    required: false,
  },
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <SpecimenWrapper style={{ width: '600px' }}>
        {/* CASE 1. COLUMN LAYOUT: 수직 적층 구조 */}
        <SpecimenGroup title='column'>
          <SpecimenGroup direction='column' style={{ gap: '16px', alignItems: 'flex-end' }}>
            {/* Input 영역 */}
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText={t('formfield.input.label')}
                direction='column'
                htmlFor={`${uniqueId}-in-col`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-in-col`}
                  size={args.size}
                  placeholder={t('formfield.input.placeholder')}
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
                  placeholder={t('formfield.input.placeholder')}
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
                <Label size={args.size}>{t('formfield.radio.label')}</Label>
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
                <Label size={args.size}>{t('formfield.checkbox.label')}</Label>
              </FormField>
            </AnatomyWrapper>
          </div>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * 필수 입력 항목(`required: true`)에 대한 시각적 표식(에스터리스크)을 검증합니다.
 * 레이블 우측의 표식이 레이아웃 방향(Row/Column)에 관계없이 가독성을 해치지 않는지 확인합니다.
 */
export const Required: Story = {
  args: {
    required: true,
    size: 'md',
  },
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    return (
      <SpecimenWrapper style={{ width: '600px' }}>
        {/* CASE 1. COLUMN LAYOUT (Required) */}
        <SpecimenGroup title='column (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 인풋 */}
            <AnatomyWrapper minimal>
              <FormField
                {...args}
                labelText={t('formfield.input.label')}
                direction='column'
                htmlFor={`${uniqueId}-col-req`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-col-req`}
                  size={args.size}
                  placeholder={t('formfield.input.placeholder')}
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
                labelText={t('formfield.input.label')}
                direction='row'
                htmlFor={`${uniqueId}-row-req`}
              >
                <Input
                  as='div'
                  id={`${uniqueId}-row-req`}
                  size={args.size}
                  placeholder={t('formfield.input.placeholder')}
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
 * 5단계 표준 사이즈에 따른 레이블 폰트와 컨트롤 간의 간격(Gap) 변화를 대조합니다.
 * 특히 가장 작은 XS 사이즈에서도 레이블 클릭을 통한 포커스 이동이 원활한지(Hit Area) 확인합니다.
 */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '700px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => {
        const uniqueId = useId();
        const { t } = useTranslation();

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
                  labelText={t('formfield.input.label')}
                  direction='column'
                  size={size}
                  htmlFor={`${uniqueId}-col-${size}-col-input`}
                >
                  <Input
                    as='div'
                    id={`${uniqueId}-col-${size}-col-input`}
                    size={size}
                    placeholder={t('formfield.input.placeholder')}
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
                  labelText={t('formfield.input.label')}
                  direction='row'
                  htmlFor={`${uniqueId}-col-${size}-row-input`}
                >
                  <Input
                    as='div'
                    id={`${uniqueId}-col-${size}-row-input`}
                    size={size}
                    placeholder={t('formfield.input.placeholder')}
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
                  <Label size={size}>{t('formfield.radio.label')}</Label>
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
                  <Label size={size}>{t('formfield.checkbox.label')}</Label>
                </FormField>
              </AnatomyWrapper>
            </SpecimenGroup>
          </SpecimenGroup>
        );
      })}
    </SpecimenWrapper>
  ),
};
