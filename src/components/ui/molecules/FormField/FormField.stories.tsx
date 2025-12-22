import type { Meta, StoryObj } from '@storybook/react-vite';
import FormField from '@/components/ui/molecules/FormField/FormField';
import Input from '@/components/ui/atoms/Input/Input';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import Label from '../../atoms/Label/Label';

const meta = {
  title: 'UI/Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Identification
    id: {
      control: 'text',
      description: '컴포넌트의 고유 ID입니다. 미지정 시 내부적으로 생성됩니다.',
      table: { category: 'Identification' },
    },
    htmlFor: {
      control: 'text',
      description: `
라벨(\`label\`)과 입력창(\`input\`)을 연결하는 속성입니다. 
**ID와 일치**시켜야 하며, 이를 통해 라벨 텍스트를 클릭해도 체크박스가 선택되도록 **클릭 범위를 확장**해 줍니다.
    `,
      table: { category: 'Identification' },
    },

    // Contents
    labelText: {
      control: 'text',
      description: '표시될 라벨의 텍스트입니다.',
      table: { category: 'Contents' },
    },

    // States
    required: {
      control: 'boolean',
      description: '필수 입력 항목 여부를 표시합니다.',
      table: { category: 'Status' },
    },

    // Styles
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '내부 요소 및 라벨의 전체적인 크기를 결정합니다.',
      table: { category: 'Styles' },
    },
    direction: {
      control: 'inline-radio',
      options: ['column', 'row'],
      description: '라벨과 콘텐츠의 배치 방향을 결정합니다.',
      table: { category: 'Styles' },
    },

    // Etc
    as: {
      control: 'text',
      description: '렌더링될 최상위 태그를 변경합니다.',
      table: { category: 'Etc' },
    },
    children: {
      description: `
컴포넌트 내부에 렌더링될 콘텐츠입니다.
- **Text**: 단순한 라벨 문자열을 입력할 수 있습니다.
- **Component**: 다른 리액트 컴포넌트를 주입할 수 있습니다.
    `,
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      description: '외부 커스텀 스타일을 위한 클래스명입니다.',
      table: { category: 'Etc' },
    },
  },
  args: {
    size: 'xl',
    htmlFor: 'base-input',
    labelText: 'Input 라벨',
    direction: 'column',
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 가장 기본적인 세로 배치 형태입니다. 주로 텍스트 입력창과 함께 사용됩니다.
 */
export const Base: Story = {
  args: {},
  render: args => {
    return (
      <FormField {...args}>
        <Input
          as='div'
          id='base-input'
          type='text'
          shape='rounded'
          variant='solid'
          color='tertiary'
          size={args.size}
          placeholder='값을 입력하세요.'
        />
      </FormField>
    );
  },
};

/**
 * 가로 배치 형태입니다. 필터 조건이나 간단한 설정창에서 주로 사용됩니다.
 */
export const RowDirection: Story = {
  args: {
    direction: 'row',
  },
  render: args => {
    return (
      <FormField {...args}>
        <Input
          as='div'
          id='base-input'
          type='text'
          shape='rounded'
          variant='solid'
          color='tertiary'
          size={args.size}
          placeholder='값을 입력하세요.'
        />
      </FormField>
    );
  },
};

/**
 * 필수 항목 표시(*)가 포함된 상태입니다. 스크린 리더는 '필수 항목'으로 읽어줍니다.
 */
export const Required: Story = {
  args: {
    required: true,
  },
  render: args => {
    return (
      <FormField {...args}>
        <Input
          as='div'
          id='base-input'
          type='text'
          shape='rounded'
          variant='solid'
          color='tertiary'
          size={args.size}
          required={args.required}
          placeholder='값을 입력하세요.'
        />
      </FormField>
    );
  },
};

/**
 * 다양한 사이즈별 렌더링 결과입니다.
 */
export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '400px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => (
        <FormField key={size} {...args} size={size} labelText={`Size ${size.toUpperCase()}`}>
          <Input
            as='div'
            id='base-input'
            type='text'
            shape='rounded'
            variant='solid'
            color='tertiary'
            size={args.size}
            required={args.required}
            placeholder='값을 입력하세요.'
          />
        </FormField>
      ))}
    </div>
  ),
};

/**
 * Checkbox와 Radio 컴포넌트가 FormField와 결합된 실제 사용 사례입니다.
 * 단일 선택(Radio)과 다중 선택(Checkbox), 그리고 레이아웃 방향에 따른 조화를 확인할 수 있습니다.
 */
export const Usage: Story = {
  render: args => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '500px',
        padding: '20px',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
      }}
    >
      {/* 1. Checkbox Case - Row Direction */}
      <section>
        <h4 style={{ marginBottom: '16px', color: '#888' }}># Checkbox Case (Row)</h4>
        <FormField as='label' htmlFor='formfield-test-7' size='xl' direction='row'>
          <Checkbox
            as='span'
            id='formfield-test-7'
            name='formfield-checkbox'
            color='primary'
            size='xl'
            value='체크박스 옵션 1'
            defaultChecked
          />
          <Label size='xl'>체크박스 옵션 1</Label>
        </FormField>
      </section>

      {/* 2. Radio Group Case - Column Direction */}
      <section>
        <h4 style={{ marginBottom: '16px', color: '#888' }}># Radio Group Case (Column)</h4>
        <FormField as='label' htmlFor='formfield-test-13' size='lg' direction='row'>
          <Radio
            as='span'
            id='formfield-test-13'
            name='formfield-radio'
            color='primary'
            size='xl'
            value='라디오 옵션 2'
          />
          <Label size='xl'>라디오 옵션 2</Label>
        </FormField>
      </section>

      <section>
        <h4 style={{ marginBottom: '16px', color: '#888' }}># Radio Group Case (Column)</h4>
        <FormField as='div' labelText='라벨' htmlFor='formfield-test-13' size='lg' direction='row'>
          <Input
            as='div'
            id='base-input'
            type='text'
            shape='rounded'
            variant='solid'
            color='tertiary'
            size={args.size}
            required={args.required}
            placeholder='값을 입력하세요.'
          />
        </FormField>
      </section>

      <section>
        <h4 style={{ marginBottom: '16px', color: '#888' }}># Radio Group Case (Column)</h4>
        <FormField
          as='div'
          labelText='라벨'
          htmlFor='formfield-test-13'
          size='lg'
          direction='column'
        >
          <Input
            as='div'
            id='base-input'
            type='text'
            shape='rounded'
            variant='solid'
            color='tertiary'
            size={args.size}
            required={args.required}
            placeholder='값을 입력하세요.'
          />
        </FormField>
      </section>
    </div>
  ),
};
