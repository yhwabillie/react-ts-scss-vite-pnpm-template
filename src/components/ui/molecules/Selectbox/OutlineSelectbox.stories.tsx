import type { Meta, StoryObj } from '@storybook/react-vite';
import Selectbox from './Selectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { selectboxOptions } from './Selectbox.mock';
import { SpecimenCell, SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';

const meta = {
  title: 'UI/Molecules/Selectbox/Outline',
  component: Selectbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    options: selectboxOptions,
    placeholder: '상태를 선택해주세요',
    defaultOptionId: '', // 초기값 명시
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    options: { table: { category: 'Contents' } },
    onValueChange: { action: 'valueChanged', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Base]
 * render 함수의 두 번째 인자인 { updateArgs }를 사용하여
 * 외부 훅 임포트 없이 스토리 상태를 동기화합니다.
 */
export const Base: Story = {
  render: (args, { updateArgs }) => {
    const handleChange = (id: string) => {
      // 1. 스토리북 Controls 패널의 defaultOptionId를 즉시 업데이트
      updateArgs({ defaultOptionId: id });
      // 2. Actions 패널에 이벤트 로그 출력
      args.onValueChange?.(id);
    };

    return <Selectbox {...args} onValueChange={handleChange} />;
  },
};

/** [02. Sizes] - 생략된 로직은 위와 동일하게 깔끔하게 유지됩니다. */
export const Colors: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '800px' }}>
      {(['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const).map(
        color => (
          <SpecimenCell caption={color}>
            <Selectbox {...args} color={color} placeholder={`${color} 컬러`} />
          </SpecimenCell>
        ),
      )}
    </SpecimenWrapper>
  ),
};

/** [02. Sizes] - 생략된 로직은 위와 동일하게 깔끔하게 유지됩니다. */
export const Sizes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '800px' }}>
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => (
        <SpecimenCell caption={size}>
          <Selectbox {...args} size={size} placeholder={`${size} 사이즈`} />
        </SpecimenCell>
      ))}
    </SpecimenWrapper>
  ),
};

/** [04. Long Options & Scroll] */
export const LongList: Story = {
  args: {
    options: [
      ...selectboxOptions,
      { id: 'long-1', value: '매우 긴 텍스트가 포함된 옵션 예시입니다.', disabled: false },
    ],
  },
  render: args => <Selectbox {...args} />,
};

/** [05. Status] */
export const Status: Story = {
  render: args => (
    <SpecimenGroup title='Disabled State' direction='row'>
      <Selectbox {...args} disabled placeholder='비활성화된 셀렉트박스' />
    </SpecimenGroup>
  ),
};
