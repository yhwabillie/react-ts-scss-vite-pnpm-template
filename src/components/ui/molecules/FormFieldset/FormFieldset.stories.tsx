import type { Meta, StoryObj } from '@storybook/react-vite';
import FormFieldset from './FormFieldset';
import ControlGroup from '../ControlGroup/ControlGroup';
import FormField from '../FormField/FormField';
import Radio from '../../atoms/Radio/Radio';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Label from '../../atoms/Label/Label';
import ValidationMsg from '../../atoms/ValidationMsg/ValidationMsg';
import Icon from '../../atoms/Icon/Icon';

const meta = {
  title: 'UI/Molecules/FormFieldset',
  component: FormFieldset,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: '그룹의 제목을 정의합니다. (fieldset의 legend)',
      table: { category: 'Contents' },
    },
    required: {
      control: 'boolean',
      description: '그룹 전체에 대한 필수 여부를 표시합니다.',
      table: { category: 'Status' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '내부 요소들의 전반적인 크기를 결정합니다.',
      table: { category: 'Styles' },
    },
    children: {
      table: { category: 'Etc' },
    },
  },
  args: {
    legend: '기본 레전드',
    size: 'md',
    required: false,
    children: null, // 혹은 기본적으로 들어갈 요소를 넣으세요.
  },
} satisfies Meta<typeof FormFieldset>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Radio 그룹과 다양한 유효성 검사 문구가 포함된 기본 형태입니다.
 */
export const Base: Story = {
  render: args => (
    <div style={{ width: '600px' }}>
      <FormFieldset {...args}>
        <ControlGroup size={args.size} direction='row' style={{ marginBottom: '16px' }}>
          {[1, 2, 3].map(num => (
            <FormField
              key={num}
              as='label'
              htmlFor={`fs-radio-${num}`}
              size={args.size}
              direction='row'
            >
              <Radio
                as='span'
                id={`fs-radio-${num}`}
                name='fieldset-radio-group'
                size={args.size}
                defaultChecked={num === 1}
              />
              <Label size={args.size}>라디오 옵션 {num}</Label>
            </FormField>
          ))}
        </ControlGroup>

        {/* 피드백 메시지 모음 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ValidationMsg variant='danger' role='alert' size={args.size} ariaLive='assertive'>
            <Icon name='x-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 에러</span>
          </ValidationMsg>
          <ValidationMsg variant='warning' role='alert' size={args.size} ariaLive='assertive'>
            <Icon name='warning-triangle' className='icon' />
            <span className='text'>유효성검사 문구 : 워닝</span>
          </ValidationMsg>
          <ValidationMsg variant='success' role='alert' size={args.size} ariaLive='assertive'>
            <Icon name='check-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 성공</span>
          </ValidationMsg>
          <ValidationMsg variant='guide' role='alert' size={args.size} ariaLive='assertive'>
            <Icon name='info-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 가이드</span>
          </ValidationMsg>
        </div>
      </FormFieldset>
    </div>
  ),
};

/**
 * 다중 선택 체크박스 그룹과 결합된 형태입니다.
 */
export const WithCheckboxGroup: Story = {
  args: {
    legend: '관심 분야 선택 (중복 가능)',
    required: false,
  },
  render: args => (
    <div style={{ width: '600px' }}>
      <FormFieldset {...args}>
        <ControlGroup
          size={args.size}
          direction='column'
          style={{ gap: '12px', marginBottom: '16px' }}
        >
          <FormField as='label' htmlFor='chk-1' size={args.size} direction='row'>
            <Checkbox id='chk-1' size={args.size} />
            <Label size={args.size}>프론트엔드 개발</Label>
          </FormField>
          <FormField as='label' htmlFor='chk-2' size={args.size} direction='row'>
            <Checkbox id='chk-2' size={args.size} />
            <Label size={args.size}>UI/UX 디자인</Label>
          </FormField>
        </ControlGroup>
        <ValidationMsg variant='guide' role='alert' size={args.size} ariaLive='assertive'>
          <Icon name='info-circle' />
          <span>최대 3개까지 선택 가능합니다.</span>
        </ValidationMsg>
      </FormFieldset>
    </div>
  ),
};
