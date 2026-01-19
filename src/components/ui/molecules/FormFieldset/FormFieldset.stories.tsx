import type { Meta, StoryObj } from '@storybook/react-vite';
import FormFieldset from './FormFieldset';
import ControlGroup from '../ControlGroup/ControlGroup';
import FormField from '../FormField/FormField';
import Radio from '../../atoms/Radio/Radio';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Label from '../../atoms/Label/Label';
import { useId } from 'react';
import { SpecimenCell, SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useTranslation } from 'react-i18next';
import Card from '../Card/Card';

const meta = {
  title: 'UI/Molecules/FormFieldset',
  component: FormFieldset,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**FormFieldset**은 여러 개의 연관된 폼 컨트롤(Radio, Checkbox 등)을 하나의 논리적 그룹으로 묶어주는 컨테이너입니다. <br /><br />' +
          '• HTML `<fieldset>`과 `<legend>` 태그를 사용하여 스크린 리더 등 보조 기술에 그룹의 목적을 명확히 전달 <br />' +
          '• 그룹 전체에 대한 제목(Legend)과 필수 여부를 일관된 디자인 시스템 규격으로 표시 <br />' +
          '• 부모의 사이즈 설정이 내부의 모든 컨트롤(Radio/Checkbox)에 일괄 적용되어 시각적 통일성 유지',
      },
    },
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
    size: 'md',
    children: null,
    legend: '',
  },
} satisfies Meta<typeof FormFieldset>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * FormFieldset 내부에서 컨트롤 그룹이 방향성(direction)에 따라 어떻게 배치되는지 검증합니다.
 * - **Column**: 레이블(Legend)이 상단에 위치하며, 하단으로 컨트롤들이 나열되어 복잡한 폼에서 안정적인 가독성을 제공합니다.
 * - **Row**: 레이블과 컨트롤들이 수평으로 배치되어 좁은 세로 공간을 효율적으로 활용해야 하는 필터바 등에 적합합니다.
 */
export const Base: Story = {
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    const renderGroupContent = (
      type: 'radio' | 'checkbox',
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined,
      idPrefix: string,
    ) => {
      const RADIO_OPTIONS = [
        { id: '1', label: t('formfieldset.radio.options.label_a') },
        { id: '2', label: t('formfieldset.radio.options.label_a') },
        { id: '3', label: t('formfieldset.radio.options.label_a') },
      ];
      const CHECKBOX_TERMS_OPTIONS = [
        { id: '1', label: t('formfieldset.checkbox.options.label_a') },
        { id: '2', label: t('formfieldset.checkbox.options.label_a') },
        { id: '3', label: t('formfieldset.checkbox.options.label_a') },
      ];

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
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend={t('formfieldset.radio.legend')} direction='column'>
                  {renderGroupContent('radio', args.size, 'r-col')}
                </FormFieldset>
              </AnatomyWrapper>

              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend={t('formfieldset.radio.legend')} direction='row'>
                  {renderGroupContent('radio', args.size, 'r-row')}
                </FormFieldset>
              </AnatomyWrapper>
            </Card>
          </SpecimenCell>

          {/* 2. Checkbox Group Section */}
          <SpecimenCell caption='checkbox'>
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AnatomyWrapper minimal>
                <FormFieldset
                  {...args}
                  legend={t('formfieldset.checkbox.legend')}
                  direction='column'
                >
                  {renderGroupContent('checkbox', args.size, 'c-col')}
                </FormFieldset>
              </AnatomyWrapper>

              <AnatomyWrapper minimal>
                <FormFieldset {...args} legend={t('formfieldset.checkbox.legend')} direction='row'>
                  {renderGroupContent('checkbox', args.size, 'c-row')}
                </FormFieldset>
              </AnatomyWrapper>
            </Card>
          </SpecimenCell>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * 그룹 전체가 필수 선택 항목일 때(`required: true`)의 시각적 표식을 확인합니다.
 * Legend 우측에 에스터리스크(*)가 표시되며, Row/Column 레이아웃에 관계없이 일관된 간격을 유지하는지 체크합니다.
 */
export const Required: Story = {
  args: {
    required: true,
    size: 'md',
  },
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    const RADIO_OPTIONS = [
      { id: '1', label: t('formfieldset.radio.options.label_a') },
      { id: '2', label: t('formfieldset.radio.options.label_b') },
      { id: '3', label: t('formfieldset.radio.options.label_c') },
    ];

    return (
      <SpecimenWrapper style={{ width: '600px' }}>
        {/* CASE 1. COLUMN LAYOUT (Required) */}
        <SpecimenGroup title='column (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 라디오 그룹 */}
            <Card>
              <AnatomyWrapper minimal>
                <FormFieldset
                  {...args}
                  legend={t('formfieldset.radio.legend')}
                  size={args.size}
                  direction='column'
                >
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
            </Card>
          </SpecimenGroup>
        </SpecimenGroup>

        {/* CASE 2. ROW LAYOUT (Required) */}
        <SpecimenGroup title='row (Required)'>
          <SpecimenGroup direction='column' style={{ gap: '20px', alignItems: 'flex-end' }}>
            {/* 필수 라디오 그룹 */}
            <Card>
              <AnatomyWrapper minimal>
                <FormFieldset
                  {...args}
                  legend={t('formfieldset.radio.legend')}
                  size={args.size}
                  direction='row'
                >
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
            </Card>
          </SpecimenGroup>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * 5단계 표준 사이즈(XL ~ XS)에 따른 폰트 크기, 간격(Gap), 그리고 내부 컨트롤들의 스케일 변화를 확인합니다.
 * 특히 작은 사이즈(SM, XS)에서 레이블과 체크 박스가 겹치지 않고 충분한 클릭 영역을 유지하는지 검증합니다.
 */
export const Sizes: Story = {
  render: args => {
    const uniqueId = useId();
    const { t } = useTranslation();

    const RADIO_OPTIONS = [
      { id: '1', label: t('formfieldset.radio.options.label_a') },
      { id: '2', label: t('formfieldset.radio.options.label_b') },
      { id: '3', label: t('formfieldset.radio.options.label_c') },
    ];

    const CHECKBOX_TERMS_OPTIONS = [
      { id: '1', label: t('formfieldset.checkbox.options.label_a') },
      { id: '2', label: t('formfieldset.checkbox.options.label_b') },
      { id: '3', label: t('formfieldset.checkbox.options.label_c') },
    ];

    return (
      <SpecimenWrapper style={{ width: '700px' }}>
        {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => {
          return (
            <SpecimenGroup key={size} title={size.toUpperCase()} direction='column'>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AnatomyWrapper
                  minimal
                  style={{
                    ...((size === 'xl' || size === 'lg') && {
                      width: 'max-content',
                    }),
                  }}
                >
                  <FormFieldset
                    {...args}
                    size={size}
                    legend={t('formfieldset.radio.legend')}
                    direction='column'
                  >
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
                  <FormFieldset
                    {...args}
                    legend={t('formfieldset.radio.legend')}
                    size={size}
                    direction='row'
                  >
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
                  <FormFieldset
                    {...args}
                    size={size}
                    legend={t('formfieldset.checkbox.legend')}
                    direction='column'
                  >
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
                  <FormFieldset
                    {...args}
                    size={size}
                    legend={t('formfieldset.checkbox.legend')}
                    direction='row'
                  >
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
              </Card>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};
