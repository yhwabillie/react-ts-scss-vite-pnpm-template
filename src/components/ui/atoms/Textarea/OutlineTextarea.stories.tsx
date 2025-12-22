import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './Textarea';

const meta = {
  title: 'UI/Atoms/Textarea/Outline',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // 1. Identification
    id: { table: { category: 'Identification' } },

    // 2. Styles
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'soft', 'ghost'],
      description: '배경색과 테두리 스타일을 결정합니다.',
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'brand',
        'brand-sub',
        'success',
        'warning',
        'danger',
      ],
      description: '컴포넌트의 테마 색상을 결정합니다.',
      table: { category: 'Styles' },
    },

    // 3. Behavioral (Textarea Specific)
    rows: {
      control: { type: 'number', min: 1 },
      description: '기본적으로 보여질 줄 수를 결정합니다.',
      table: { category: 'Behavioral' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Behavioral' },
    },
    disabled: { control: 'boolean', table: { category: 'Status' } },
    readOnly: { control: 'boolean', table: { category: 'Status' } },
  },
  args: {
    variant: 'outline',
    color: 'tertiary',

    rows: 4,
    placeholder: '내용을 입력해주세요.',
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본적인 텍스트 영역 형태입니다.
 */
export const Default: Story = {};

/**
 * 모든 변형(Variant) 상태를 확인합니다. SCSS에 정의된 4가지 타입을 비교합니다.
 */
export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '600px' }}>
      <Textarea {...args} variant='solid' placeholder='Solid Variant' />
      <Textarea {...args} variant='outline' placeholder='Outline Variant' />
      <Textarea {...args} variant='soft' placeholder='Soft Variant' />
      <Textarea {...args} variant='ghost' placeholder='Ghost Variant' />
    </div>
  ),
};

/**
 * 주요 상태(Disabled, ReadOnly)에 따른 스타일 변화를 확인합니다.
 */
export const Status: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <Textarea {...args} placeholder='Normal State' />
      <Textarea {...args} disabled placeholder='Disabled State' />
      <Textarea
        {...args}
        readOnly
        defaultValue='이것은 읽기 전용 텍스트입니다. 수정할 수 없습니다.'
      />
    </div>
  ),
};

/**
 * 브랜드 색상 및 상태 색상(Success, Danger 등)을 확인합니다.
 */
export const Colors: Story = {
  render: args => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '600px' }}>
      <Textarea {...args} color='brand' placeholder='Brand Color' />
      <Textarea {...args} color='brand-sub' placeholder='Brand-Sub Color' />
      <Textarea {...args} color='success' placeholder='Success Color' />
      <Textarea {...args} color='danger' placeholder='Danger Color' />
    </div>
  ),
};

/**
 * CharacterCount와 조합하여 글자 수 제한이 있는 사용 사례입니다.
 */
// export const WithCharacterCount: Story = {
//   render: (args) => {
//     // 스토리 내부에서 글자 수 상태 관리 시뮬레이션
//     const [text, setText] = useState('');
//     const maxLength = 200;

//     return (
//       <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
//         <Textarea
//           {...args}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           maxLength={maxLength}
//           placeholder="내용을 입력해주세요."
//         />
//         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <CharacterCount
//             current={text.length}
//             max={maxLength}
//             size={args.size}
//           />
//         </div>
//       </div>
//     );
//   },
// };
