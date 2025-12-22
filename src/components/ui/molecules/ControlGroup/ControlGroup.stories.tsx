import type { Meta, StoryObj } from '@storybook/react-vite';
import ControlGroup from './ControlGroup';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import FormField from '../FormField/FormField';
import Label from '../../atoms/Label/Label';

const meta = {
  title: 'UI/Molecules/ControlGroup',
  component: ControlGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Accessibility
    role: {
      control: 'inline-radio',
      options: ['group', 'toolbar'],
      description: '컴포넌트의 접근성 역할을 정의합니다.',
      table: { category: 'Accessibility' },
    },
    ariaLabel: {
      control: 'text',
      description: '스크린 리더를 위한 그룹 설명입니다.',
      table: { category: 'Accessibility' },
    },

    // Styles
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '내부 요소들의 전반적인 크기를 결정합니다.',
      table: { category: 'Styles' },
    },
    direction: {
      control: 'inline-radio',
      options: ['row', 'column'],
      description: '요소들의 배치 방향을 결정합니다.',
      table: { category: 'Styles' },
    },

    // Etc
    children: {
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      table: { category: 'Etc' },
    },
  },
  args: {
    size: 'xl',
    direction: 'row',
    children: undefined,
  },
} satisfies Meta<typeof ControlGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 라디오 버튼들을 세로로 나열하여 선택지를 명확히 보여주는 형태입니다.
 */
export const Base: Story = {
  args: {
    direction: 'row',
  },
  render: args => (
    <>
      <div
        style={{ width: '800px', border: '1px dashed rgb(204, 204, 204)', marginBottom: '20px' }}
      >
        <p style={{ fontSize: '12px', color: 'rgb(51, 51, 51)', marginBottom: '10px' }}>
          부모 요소
        </p>
        <ControlGroup {...args}>
          <FormField as='label' htmlFor='id-1' size={args.size} direction={args.direction}>
            <Radio
              as='span'
              id='id-1'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
              defaultChecked
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='id-2' size={args.size} direction={args.direction}>
            <Radio
              as='span'
              id='id-2'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='id-3' size={args.size} direction={args.direction}>
            <Radio
              as='span'
              id='id-3'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
        </ControlGroup>
      </div>
      <div style={{ width: '800px', border: '1px dashed rgb(204, 204, 204)' }}>
        <p style={{ fontSize: '12px', color: 'rgb(51, 51, 51)', marginBottom: '10px' }}>
          부모 요소
        </p>
        <ControlGroup {...args}>
          <FormField as='label' htmlFor='id-1' size={args.size} direction={args.direction}>
            <Checkbox
              as='span'
              id='id-1'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
              defaultChecked
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='id-2' size={args.size} direction={args.direction}>
            <Checkbox
              as='span'
              id='id-2'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='id-3' size={args.size} direction={args.direction}>
            <Checkbox
              as='span'
              id='id-3'
              name='id-1-name'
              color='primary'
              size={args.size}
              value='라디오 옵션 1'
            />
            <Label size={args.size}>라디오 옵션 1</Label>
          </FormField>
        </ControlGroup>
      </div>
    </>
  ),
};

/**
 * 5가지 표준 사이즈(XL ~ XS)에 따른 그룹 내 요소들의 변화를 확인합니다.
 * 모든 자식 요소(FormField, Radio, Checkbox, Label)의 사이즈가 부모와 동기화되는지 검증합니다.
 */
export const Sizes: Story = {
  render: args => {
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    return (
      <div style={{}}>
        {sizes.map(size => {
          return (
            <>
              <div
                style={{
                  width: '800px',
                  border: '1px dashed rgb(204, 204, 204)',
                }}
              >
                <p style={{ fontSize: '12px', color: 'rgb(51, 51, 51)' }}>부모 요소</p>
                <ControlGroup {...args}>
                  <FormField as='label' htmlFor='id-1' size={size} direction={args.direction}>
                    <Radio
                      as='span'
                      id='id-1'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                      defaultChecked
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                  <FormField as='label' htmlFor='id-2' size={size} direction={args.direction}>
                    <Radio
                      as='span'
                      id='id-2'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                  <FormField as='label' htmlFor='id-3' size={size} direction={args.direction}>
                    <Radio
                      as='span'
                      id='id-3'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                </ControlGroup>
              </div>
              <div style={{ width: '800px', border: '1px dashed rgb(204, 204, 204)' }}>
                <p style={{ fontSize: '12px', color: 'rgb(51, 51, 51)' }}>부모 요소</p>
                <ControlGroup {...args}>
                  <FormField as='label' htmlFor='id-1' size={size} direction={args.direction}>
                    <Checkbox
                      as='span'
                      id='id-1'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                      defaultChecked
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                  <FormField as='label' htmlFor='id-2' size={size} direction={args.direction}>
                    <Checkbox
                      as='span'
                      id='id-2'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                  <FormField as='label' htmlFor='id-3' size={size} direction={args.direction}>
                    <Checkbox
                      as='span'
                      id='id-3'
                      name='id-1-name'
                      color='primary'
                      size={size}
                      value='라디오 옵션 1'
                    />
                    <Label size={size}>라디오 옵션 1</Label>
                  </FormField>
                </ControlGroup>
              </div>
            </>
          );
        })}
      </div>
    );
  },
};
