import type { Meta, StoryObj } from '@storybook/react-vite';
import ValidationMsg from './ValidationMsg';
import Icon from '../Icon/Icon';
import FormField from '../../molecules/FormField/FormField';
import Radio from '../Radio/Radio';
import Label from '../Label/Label';
import ControlGroup from '../../molecules/ControlGroup/ControlGroup';
import FormFieldset from '../../molecules/FormFieldset/FormFieldset';

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
export const Variants: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ValidationMsg {...args} variant='danger'>
        아이디를 입력해주세요. (Danger)
      </ValidationMsg>
      <ValidationMsg {...args} variant='warning'>
        8자 이상의 영문, 숫자를 조합해주세요. (Warning)
      </ValidationMsg>
      <ValidationMsg {...args} variant='success'>
        사용 가능한 아이디입니다. (Success)
      </ValidationMsg>
      <ValidationMsg {...args} variant='guide'>
        영문 대소문자를 구분합니다. (Guide)
      </ValidationMsg>
    </div>
  ),
};

/**
 * 사이즈별 텍스트 크기 변화를 확인합니다.
 */
export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => (
        <div key={size}>
          <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>
            {size.toUpperCase()}
          </p>
          <ValidationMsg {...args} size={size}>
            사이즈 {size}의 검증 메시지입니다.
          </ValidationMsg>
        </div>
      ))}
    </div>
  ),
};

/**
 * 실제 FormField와 결합하여 에러 메시지가 어떻게 노출되는지 보여주는 시나리오입니다.
 */
export const InFormField: Story = {
  render: args => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>비밀번호</label>
      <input
        type='password'
        style={{ padding: '10px', border: '1px solid #ff4d4f', borderRadius: '4px' }}
        defaultValue='123'
      />
      <ValidationMsg {...args} variant='danger' size='sm'>
        비밀번호는 최소 8자 이상이어야 합니다.
      </ValidationMsg>
    </div>
  ),
};

/**
 * 아이콘과 텍스트를 조합하여 사용자에게 더 명확한 시각적 가이드를 제공하는 예시입니다.
 * 상태별로 적절한 아이콘을 사용하여 정보의 성격을 직관적으로 전달합니다.
 */
export const WithIcon: Story = {
  args: {
    size: 'xl',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. 에러 케이스 (Danger) - 즉각적인 수정 필요 */}
      <ValidationMsg {...args} variant='danger' role='alert' ariaLive='assertive'>
        <Icon name='x-circle' className='icon' />
        <span className='text'>필수 입력 항목입니다. 다시 확인해주세요.</span>
      </ValidationMsg>

      {/* 2. 주의 케이스 (Warning) - 확인 권장 (추가됨) */}
      <ValidationMsg {...args} variant='warning' role='status' ariaLive='polite'>
        <Icon name='warning-triangle' className='icon' />
        <span className='text'>비밀번호 보안 수준이 낮습니다. (영문/숫자 조합 권장)</span>
      </ValidationMsg>

      {/* 3. 성공 케이스 (Success) - 검증 완료 */}
      <ValidationMsg {...args} variant='success'>
        <Icon name='check-circle' className='icon' />
        <span className='text'>사용 가능한 비밀번호입니다.</span>
      </ValidationMsg>

      {/* 4. 가이드 케이스 (Guide) - 일반 안내 */}
      <ValidationMsg {...args} variant='guide'>
        <Icon name='info-circle' className='icon' />
        <span className='text'>유효성검사 문구 : 가이드</span>
      </ValidationMsg>
    </div>
  ),
};

/**
 * 라벨과 실제 입력 요소(Radio, Checkbox, Switch 등)가 결합되었을 때의 실제 정렬과 크기 조화를 확인합니다.
 */
export const Usage: Story = {
  render: args => (
    <div style={{ width: '800px', display: 'flex', flexDirection: 'row', gap: '30px' }}>
      <FormFieldset size='xl' legend='체크박스 옵션 선택' required={true}>
        <ControlGroup
          ariaLabel='라벨'
          size={args.size}
          direction='row'
          aria-describedby='checkbox-error-msg checkbox-warning-msg checkbox-success-msg checkbox-guide-msg'
        >
          <FormField as='label' htmlFor='radio-id-1' size={args.size}>
            <Radio
              as='span'
              id='radio-id-1'
              defaultChecked
              name='radio-name'
              color='primary'
              size={args.size}
            />
            <Label size={args.size}>라디오 옵션 라벨</Label>
          </FormField>
          <FormField as='label' htmlFor='radio-id-2' size={args.size}>
            <Radio as='span' id='radio-id-2' name='radio-name' color='primary' size={args.size} />
            <Label size={args.size}>라디오 옵션 라벨</Label>
          </FormField>
          <FormField as='label' htmlFor='radio-id-3' size={args.size}>
            <Radio as='span' id='radio-id-3' name='radio-name' color='primary' size={args.size} />
            <Label size={args.size}>라디오 옵션 라벨</Label>
          </FormField>
        </ControlGroup>

        <ValidationMsg
          id='checkbox-error-msg'
          variant='danger'
          role='alert'
          ariaLive='assertive'
          size={args.size}
        >
          <Icon name='x-circle' className='icon' />
          <span className='text'>유효성검사 문구 : 에러</span>
        </ValidationMsg>
      </FormFieldset>
    </div>
  ),
};
