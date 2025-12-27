import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';
import FormField from '../../molecules/FormField/FormField';
import Radio from '../Radio/Radio';
import Checkbox from '../Checkbox/Checkbox';
import Switch from '../../molecules/Switch/Switch';
import AnatomyWrapper from '@/components/ui/guide/AnatomyWrapper';

const meta = {
  title: 'UI/Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Label 컴포넌트는 입력 요소(Switch, Checkbox 등)의 설명을 텍스트로 제공합니다. <br />' +
          '5가지 표준 사이즈를 제공하여 다양한 UI 컨텍스트에 유연하게 대응합니다.',
      },
    },
  },
  argTypes: {
    // Styles
    size: {
      control: 'inline-radio',
      description: '라벨의 크기를 결정합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Etc
    children: {
      control: 'text',
      description: '라벨에 표시될 텍스트 또는 컴포넌트 콘텐츠입니다.',
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
    children: '기본 라벨 텍스트',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Label 컴포넌트의 가장 기본이 되는 형태입니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {
    size: 'xl',
    children: '기본 라벨 텍스트',
  },
};

/**
 * 5가지 표준 사이즈(XS ~ XL)에 따른 텍스트 크기 변화를 확인합니다.
 * 본문의 위계나 주변 입력 요소의 크기에 맞춰 선택하여 사용합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sizes.map(size => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Label {...args} size={size}>
              {size.toUpperCase()} - The quick brown fox jumps over the lazy dog
            </Label>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 라벨과 실제 입력 요소(Radio, Checkbox, Switch 등)가 결합되었을 때의 실제 정렬과 크기 조화를 확인합니다.
 */
export const Usage: Story = {
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <FormField as='label' htmlFor='radio-id' size={args.size}>
        <Radio
          as='span'
          id='radio-id'
          defaultChecked
          name='radio-name'
          color='primary'
          size={args.size}
        />
        <AnatomyWrapper minimal={true}>
          <Label size={args.size}>라디오 옵션 라벨</Label>
        </AnatomyWrapper>
      </FormField>

      <FormField as='label' htmlFor='checkbox-id' size={args.size}>
        <Checkbox
          as='span'
          id='checkbox-id'
          defaultChecked
          name='checkbox-name'
          color='primary'
          size={args.size}
        />
        <AnatomyWrapper minimal={true}>
          <Label size={args.size}>체크박스 옵션 라벨</Label>
        </AnatomyWrapper>
      </FormField>
      <Switch
        color='primary'
        id='switch-id'
        name='switch-name'
        size={args.size}
        defaultChecked
        children={
          <AnatomyWrapper minimal={true}>
            <Label size={args.size}>라디오 옵션 1</Label>
          </AnatomyWrapper>
        }
      />
    </div>
  ),
};
