import type { Meta, StoryObj } from '@storybook/react-vite';
import ValidationMsg from './ValidationMsg';
import Icon from '../Icon/Icon';
import FormField from '../../molecules/FormField/FormField';
import Radio from '../Radio/Radio';
import Label from '../Label/Label';
import ControlGroup from '../../molecules/ControlGroup/ControlGroup';
import FormFieldset from '../../molecules/FormFieldset/FormFieldset';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import { useId } from 'react';
import Checkbox from '../Checkbox/Checkbox';
import Input from '../Input/Input';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Molecules/ValidationMsg',
  component: ValidationMsg,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**ValidationMsg**는 입력 필드의 유효성 검사 결과, 경고, 성공 메시지 또는 단순 안내 가이드를 일관된 시각적 언어로 전달합니다. <br /><br />' +
          '• 상태별(Danger, Success 등) 명확한 컬러 시스템을 통해 사용자에게 즉각적인 피드백 제공 <br />' +
          '• 긴 텍스트가 입력되어 줄바꿈이 발생하더라도 아이콘과 텍스트의 정렬이 흐트러지지 않도록 설계 <br />' +
          '• `role="alert"`와 `aria-live` 속성을 통해 스크린 리더 사용자가 실시간 오류 발생 상황을 인지하도록 지원',
      },
    },
  },
  argTypes: {
    // Status & Style
    variant: {
      control: 'select',
      options: ['danger', 'warning', 'success', 'guide'],
      description: '메시지의 성격에 따른 색상과 스타일을 결정합니다.',
      table: { category: 'Status' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '텍스트 크기를 결정합니다.',
      table: { category: 'Styles' },
    },

    // Accessibility
    role: {
      control: 'inline-radio',
      options: ['alert', 'status'],
      description: '스크린 리더의 역할을 정의합니다. (에러 시 alert 권장)',
      table: { category: 'Accessibility' },
    },
    ariaLive: {
      control: 'inline-radio',
      options: ['assertive', 'polite'],
      description: '메시지 발생 시 즉시 읽어줄지 여부를 결정합니다.',
      table: { category: 'Accessibility' },
    },

    // Contents
    children: {
      control: 'text',
      description: `
컴포넌트 내부에 표시될 콘텐츠입니다.
- **Text**: 단순한 경고/안내 문자열을 입력합니다.
- **Icon Combo**: \`<Icon />\`과 \`<span className="text" />\`를 조합하여 시각적 강조가 포함된 메시지를 구성할 수 있습니다.
    `,
      table: {
        type: { summary: 'ReactNode' },
        category: 'Contents',
      },
    },

    // Etc
    className: {
      control: 'text',
      table: {
        category: 'Contents',
      },
    },
  },
  args: {
    variant: 'guide',
    size: 'md',
    role: 'alert',
    ariaLive: 'assertive',
    children: '유효하지 않은 입력값입니다.',
  },
} satisfies Meta<typeof ValidationMsg>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 컴포넌트의 4가지 주요 상태(Danger, Warning, Success, Guide)를 확인합니다.
 * - **Danger**: 즉각적인 수정이 필요한 에러 상황에 사용하여 사용자의 주의를 환기합니다.
 * - **Warning**: 유효하지만 보안 수준이 낮거나 추가 권장 사항이 있을 때 사용합니다.
 * - **Success**: 중복 확인 통과 등 긍정적인 확신을 주어 다음 단계로 유도합니다.
 * - **Guide**: 입력 전 힌트나 정책 안내 등 정보 제공 목적으로 활용합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();

    return (
      <SpecimenWrapper>
        {/* Danger: 명확한 오류 상황 및 즉각적인 수정 필요 시 */}
        <SpecimenGroup title='Danger (Error)'>
          <ValidationMsg {...args} variant='danger'>
            <Icon name='x-circle' className='icon' strokeWidth={2.5} />
            <span className='text'>{t('validation-msg.error.label')}</span>
          </ValidationMsg>
        </SpecimenGroup>

        {/* Warning: 데이터는 유효하나 추가 권장사항이 있는 경우 */}
        <SpecimenGroup title='Warning'>
          <ValidationMsg {...args} variant='warning'>
            <Icon name='warning-triangle' className='icon' strokeWidth={2.5} />
            <span className='text'>{t('validation-msg.warning.label')}</span>
          </ValidationMsg>
        </SpecimenGroup>

        {/* Success: 모든 조건이 충족되어 다음 단계로 진행 가능할 때 */}
        <SpecimenGroup title='Success'>
          <ValidationMsg {...args} variant='success'>
            <Icon name='check-circle' className='icon' strokeWidth={2.5} />
            <span className='text'>{t('validation-msg.success.label')}</span>
          </ValidationMsg>
        </SpecimenGroup>

        {/* Guide: 입력 전 미리 알려주어야 할 힌트나 정책 안내 */}
        <SpecimenGroup title='Guide (Info)'>
          <ValidationMsg {...args} variant='guide'>
            <Icon name='info-circle' className='icon' strokeWidth={2.5} />
            <span className='text'>{t('validation-msg.guide.label')}</span>
          </ValidationMsg>
        </SpecimenGroup>
      </SpecimenWrapper>
    );
  },
};

/**
 * 시스템 표준 5단계 사이즈에 따른 텍스트와 아이콘의 크기 변화를 대조합니다.
 * 상위 FormField의 크기와 동기화되어 시각적 위계가 깨지지 않는지 검수합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
    const { t } = useTranslation();

    return (
      <SpecimenWrapper>
        {sizes.map(size => {
          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <ValidationMsg {...args} size={size}>
                <Icon name='info-circle' className='icon' strokeWidth={2.5} />
                <span className='text'>{t('validation-msg.guide.label')}</span>
              </ValidationMsg>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 텍스트가 부모 너비를 초과하여 줄바꿈이 일어날 때의 레이아웃 대응력을 확인합니다.
 * 아이콘은 항상 첫 번째 줄 상단에 고정(Alignment)되어야 하며, 텍스트는 아이콘의 너비를 확보한 채 흐르는지 검증합니다.
 */
export const LongContent: Story = {
  render: args => {
    const { t } = useTranslation();

    return (
      <SpecimenWrapper>
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* 1. Danger: 긴 오류 메시지 */}
          <SpecimenGroup title='Danger'>
            <ValidationMsg {...args} variant='danger'>
              <Icon name='x-circle' className='icon' strokeWidth={2.5} />
              <span className='text'>{t('validation-msg.guide.long-label')}</span>
            </ValidationMsg>
          </SpecimenGroup>

          {/* 2. Warning: 구체적인 패스워드 정책 안내 */}
          <SpecimenGroup title='Warning'>
            <ValidationMsg {...args} variant='warning'>
              <Icon name='warning-triangle' className='icon' strokeWidth={2.5} />
              <span className='text'>{t('validation-msg.warning.long-label')}</span>
            </ValidationMsg>
          </SpecimenGroup>

          {/* 3. Guide: 긴 정책 안내문 (영문 포함) */}
          <SpecimenGroup title='Guide'>
            <ValidationMsg {...args} variant='guide'>
              <Icon name='info-circle' className='icon' strokeWidth={2.5} />
              <span className='text'>{t('validation-msg.guide.long-label')}</span>
            </ValidationMsg>
          </SpecimenGroup>

          <SpecimenGroup title='Success'>
            <ValidationMsg {...args} variant='success'>
              <Icon name='check-circle' className='icon' strokeWidth={2.5} />
              <span className='text'>{t('validation-msg.success.long-label')}</span>
            </ValidationMsg>
          </SpecimenGroup>
        </div>
      </SpecimenWrapper>
    );
  },
};

/**
 * 실제 폼 환경(Input, Radio, Checkbox)에서 ValidationMsg가 결합된 케이스입니다.
 * - **Alignment**: 수평(Row) 및 수직(Column) 레이아웃 환경에서 메시지가 입력 요소와 올바른 간격을 유지하는지 확인합니다.
 * - **Context**: 각 컨트롤의 상태 변화에 따라 적절한 메시지 타입(Danger/Success 등)이 배치된 예시를 보여줍니다.
 */
export const Usage: Story = {
  args: {
    size: 'md',
  },
  render: args => {
    const baseId = useId();
    const { t } = useTranslation();

    // ID 자동 할당
    const renderControls = (type: 'radio' | 'checkbox', items: string[], groupName: string) => {
      const Component = type === 'radio' ? Radio : Checkbox;
      return items.map((item, idx) => {
        const itemId = `${baseId}-${type}-${groupName}-${idx}`;
        return (
          <FormField key={itemId} as='label' direction='row' size={args.size} htmlFor={itemId}>
            <Component
              as='span'
              id={itemId}
              name={`${baseId}-${groupName}`}
              size={args.size}
              defaultChecked={idx === 0}
            />
            <Label size={args.size}>{item}</Label>
          </FormField>
        );
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        {/* --- SECTION 1: ROW LAYOUT (수평 레이아웃) --- */}
        {/* 1-1. Input (Row) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FormField
            direction='row'
            htmlFor={`${baseId}-email-row`}
            labelText={t('validation-msg.usage.row.input.formfield.label')}
            size={args.size}
            required
          >
            <Input
              as='div'
              id={`${baseId}-email-row`}
              placeholder={t('validation-msg.usage.row.input.formfield.placeholder')}
              size={args.size}
              variant='solid'
            />
          </FormField>
          <ValidationMsg size={args.size} variant='success'>
            <Icon name='check-circle' className='icon' strokeWidth={2.5} />
            <span className='text'>
              {t('validation-msg.usage.row.input.validation-msg.success.label')}
            </span>
          </ValidationMsg>
        </div>

        {/* 1-2. Radio (Row) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FormFieldset
            direction='row'
            legend={t('validation-msg.usage.row.radio.formfieldset.legend')}
            size={args.size}
          >
            <ControlGroup role='group' size={args.size}>
              {renderControls(
                'radio',
                [
                  t('validation-msg.usage.row.radio.formfieldset.control-group.items.label_a'),
                  t('validation-msg.usage.row.radio.formfieldset.control-group.items.label_b'),
                  t('validation-msg.usage.row.radio.formfieldset.control-group.items.label_c'),
                ],
                'join-row',
              )}
            </ControlGroup>
          </FormFieldset>
          <ValidationMsg size={args.size} variant='warning'>
            <Icon name='warning-triangle' className='icon' strokeWidth={2.5} />
            <span className='text'>
              {t('validation-msg.usage.row.radio.validation-msg.warning.label')}
            </span>
          </ValidationMsg>
        </div>

        {/* 1-3. Checkbox (Row) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FormFieldset
            direction='row'
            legend={t('validation-msg.usage.row.checkbox.formfieldset.legend')}
            size={args.size}
          >
            <ControlGroup role='group' size={args.size}>
              {renderControls(
                'checkbox',
                [
                  t('validation-msg.usage.row.checkbox.formfieldset.control-group.items.label_a'),
                  t('validation-msg.usage.row.checkbox.formfieldset.control-group.items.label_b'),
                  t('validation-msg.usage.row.checkbox.formfieldset.control-group.items.label_c'),
                ],
                'interest-row',
              )}
            </ControlGroup>
          </FormFieldset>
          <ValidationMsg size={args.size} variant='guide'>
            <Icon name='info-circle' className='icon' strokeWidth={2.5} />
            <span className='text'>
              {t('validation-msg.usage.row.checkbox.validation-msg.warning.label')}
            </span>
          </ValidationMsg>
        </div>

        {/* --- SECTION 2: COLUMN LAYOUT (수직 레이아웃) --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* 2-1. Input (Column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FormField
              direction='column'
              htmlFor={`${baseId}-pw-col`}
              labelText={t('validation-msg.usage.column.input.formfield.label')}
              size={args.size}
              required
            >
              <Input
                as='div'
                id={`${baseId}-pw-col`}
                type='password'
                placeholder={t('validation-msg.usage.column.input.formfield.placeholder')}
                size={args.size}
                defaultValue={1234}
                variant='solid'
              />
            </FormField>
            <ValidationMsg size={args.size} variant='danger'>
              <Icon name='x-circle' className='icon' strokeWidth={2.5} />
              <span className='text'>
                {t('validation-msg.usage.column.input.validation-msg.error.label')}
              </span>
            </ValidationMsg>
          </div>

          {/* 2-2. Radio (Column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FormFieldset
              direction='column'
              legend={t('validation-msg.usage.column.radio.formfieldset.legend')}
              size={args.size}
            >
              <ControlGroup role='group' size={args.size}>
                {renderControls(
                  'radio',
                  [
                    t('validation-msg.usage.column.radio.formfieldset.control-group.items.label_a'),
                    t('validation-msg.usage.column.radio.formfieldset.control-group.items.label_b'),
                    t('validation-msg.usage.column.radio.formfieldset.control-group.items.label_c'),
                  ],
                  'term-col',
                )}
              </ControlGroup>
            </FormFieldset>
            <ValidationMsg size={args.size} variant='warning'>
              <Icon name='warning-triangle' className='icon' strokeWidth={2.5} />
              <span className='text'>
                {t('validation-msg.usage.column.radio.validation-msg.warning.label')}
              </span>
            </ValidationMsg>
          </div>

          {/* 2-3. Checkbox (Column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FormFieldset
              direction='column'
              legend={t('validation-msg.usage.column.checkbox.formfieldset.legend')}
              size={args.size}
              required
            >
              <ControlGroup role='group' size={args.size}>
                {renderControls(
                  'checkbox',
                  [
                    t(
                      'validation-msg.usage.column.checkbox.formfieldset.control-group.items.label_a',
                    ),
                    t(
                      'validation-msg.usage.column.checkbox.formfieldset.control-group.items.label_b',
                    ),
                    t(
                      'validation-msg.usage.column.checkbox.formfieldset.control-group.items.label_c',
                    ),
                  ],
                  'policy-col',
                )}
              </ControlGroup>
            </FormFieldset>
            <ValidationMsg size={args.size} variant='guide'>
              <Icon name='info-circle' className='icon' strokeWidth={2.5} />
              <span className='text'>
                {t('validation-msg.usage.column.checkbox.validation-msg.guide.label')}
              </span>
            </ValidationMsg>
          </div>
        </div>
      </div>
    );
  },
};
