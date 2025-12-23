import type { Meta, StoryObj } from '@storybook/react-vite';
import ValidationMsg from './ValidationMsg';
import Icon from '../Icon/Icon';
import FormField from '../../molecules/FormField/FormField';
import Radio from '../Radio/Radio';
import Label from '../Label/Label';
import ControlGroup from '../../molecules/ControlGroup/ControlGroup';
import FormFieldset from '../../molecules/FormFieldset/FormFieldset';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import React from 'react';
import Checkbox from '../Checkbox/Checkbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

const meta = {
  title: 'UI/Atoms/ValidationMsg',
  component: ValidationMsg,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
    size: 'xl',
    role: 'alert',
    ariaLive: 'assertive',
    children: '유효하지 않은 입력값입니다.',
  },
} satisfies Meta<typeof ValidationMsg>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 모든 상태별(Variant) 메시지 형태를 확인합니다.
 */
export const Base: Story = {
  render: args => (
    <SpecimenWrapper>
      <SpecimenGroup title='Danger'>
        <ValidationMsg {...args} variant='danger'>
          아이디를 입력해주세요. (Danger)
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Warning'>
        <ValidationMsg {...args} variant='warning'>
          8자 이상의 영문, 숫자를 조합해주세요. (Warning)
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Success'>
        <ValidationMsg {...args} variant='success'>
          사용 가능한 아이디입니다. (Success)
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Guide'>
        <ValidationMsg {...args} variant='guide'>
          영문 대소문자를 구분합니다. (Guide)
        </ValidationMsg>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * 사이즈별 텍스트 크기 변화를 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    return (
      <SpecimenWrapper>
        {sizes.map(size => {
          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <ValidationMsg {...args} size={size}>
                사이즈 {size}의 검증 메시지입니다.
              </ValidationMsg>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 아이콘과 텍스트를 조합하여 사용자에게 더 명확한 시각적 가이드를 제공하는 예시입니다.
 * 상태별로 적절한 아이콘을 사용하여 정보의 성격을 직관적으로 전달합니다.
 */
export const WithIcon: Story = {
  args: {},
  render: args => (
    <SpecimenWrapper>
      <SpecimenGroup title='Danger'>
        <ValidationMsg {...args} variant='danger' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' />
          <span className='text'>필수 입력 항목입니다. 다시 확인해주세요.</span>
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Warning'>
        <ValidationMsg {...args} variant='warning' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          <span className='text'>비밀번호 보안 수준이 낮습니다. (영문/숫자 조합 권장)</span>
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Success'>
        <ValidationMsg {...args} variant='success'>
          <Icon name='check-circle' className='icon' />
          <span className='text'>사용 가능한 비밀번호입니다.</span>
        </ValidationMsg>
      </SpecimenGroup>
      <SpecimenGroup title='Guide'>
        <ValidationMsg {...args} variant='guide'>
          <Icon name='info-circle' className='icon' />
          <span className='text'>유효성검사 문구 : 가이드</span>
        </ValidationMsg>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};

/**
 * 라벨과 실제 입력 요소(Radio, Checkbox, Switch 등)가 결합되었을 때의 실제 정렬과 크기 조화를 확인합니다.
 */
export const Usage: Story = {
  render: args => {
    // 스토리 인스턴스마다 고유한 접두사 생성 (Math.random 활용)
    const uniquePrefix = React.useMemo(() => `form-${Math.random().toString(36).slice(2, 7)}`, []);

    // 하위 요소들에 사용될 ID들 정의
    const radioId = `${uniquePrefix}-radio`;
    const checkboxId = `${uniquePrefix}-checkbox`;

    return (
      <SpecimenWrapper>
        <FormFieldset
          size='xl'
          legend='라디오 옵션 선택'
          required={true}
          style={{ width: '800px' }}
        >
          <ControlGroup
            ariaLabel='라벨'
            size={args.size}
            direction='row'
            aria-describedby={radioId}
          >
            {[1, 2, 3].map(num => {
              const radioId = `${uniquePrefix}-radio-${num}`;
              return (
                <FormField key={radioId} as='label' htmlFor={radioId} size={args.size}>
                  <Radio
                    as='span'
                    id={radioId}
                    name={`${uniquePrefix}-group`}
                    color='primary'
                    size={args.size}
                  />
                  <Label size={args.size}>라디오 옵션 라벨 {num}</Label>
                </FormField>
              );
            })}
          </ControlGroup>
          <AnatomyWrapper>
            <ValidationMsg
              id={radioId}
              variant='danger'
              role='alert'
              ariaLive='assertive'
              size={args.size}
            >
              <Icon name='x-circle' className='icon' />
              <span className='text'>필수 입력 항목입니다. 다시 확인해주세요.</span>
            </ValidationMsg>
          </AnatomyWrapper>
        </FormFieldset>

        <FormFieldset
          size='xl'
          legend='체크박스 옵션 선택'
          required={true}
          style={{ width: '800px' }}
        >
          <ControlGroup
            ariaLabel='라벨'
            size={args.size}
            direction='row'
            aria-describedby={checkboxId}
          >
            {[1, 2, 3].map(num => {
              const checkboxId = `${uniquePrefix}-checkbox-${num}`;
              return (
                <FormField key={checkboxId} as='label' htmlFor={checkboxId} size={args.size}>
                  <Checkbox
                    as='span'
                    id={checkboxId}
                    name={`${uniquePrefix}-group`}
                    color='primary'
                    size={args.size}
                  />
                  <Label size={args.size}>체크박스 옵션 라벨 {num}</Label>
                </FormField>
              );
            })}
          </ControlGroup>
          <AnatomyWrapper>
            <ValidationMsg
              id={checkboxId}
              variant='danger'
              role='alert'
              ariaLive='assertive'
              size={args.size}
            >
              <Icon name='x-circle' className='icon' />
              <span className='text'>필수 입력 항목입니다. 다시 확인해주세요.</span>
            </ValidationMsg>
          </AnatomyWrapper>
        </FormFieldset>
      </SpecimenWrapper>
    );
  },
};
