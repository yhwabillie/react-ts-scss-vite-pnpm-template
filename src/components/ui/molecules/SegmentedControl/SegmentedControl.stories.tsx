import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react'; // 💡 외부 패키지 대신 리액트 기본 훅 사용
import SegmentedControl from './SegmentedControl';

const meta = {
  title: 'UI/Molecules/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'view-mode',
    title: '정렬 방식',
    options: [
      { label: '최신순', value: 'latest' },
      { label: '인기순', value: 'popular' },
      { label: '가격순', value: 'price' },
    ],
    selectedValue: 'popular',
    onChange: (value: string) => {},
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: args => {
    // 💡 1. 실제 컴포넌트 사용 환경과 똑같이 로컬 useState를 선언합니다.
    const [viewType, setViewType] = useState(args.selectedValue);

    return (
      <SegmentedControl
        {...args}
        selectedValue={viewType} // 💡 2. 로컬 상태를 주입
        onChange={value => {
          setViewType(value); // 💡 3. 클릭 시 로컬 상태 변경 -> 인디케이터 이동
          args.onChange?.(value); // Actions 로그 기록
        }}
      />
    );
  },
};

/**
 * [02. Binary Choice]
 * 다른 스토리들도 동일한 패턴으로 작성하면 에러 없이 작동합니다.
 */
export const Binary: Story = {
  args: {
    ...meta.args,
    title: '상태 선택',
    options: [
      { label: '활성화', value: 'on' },
      { label: '비활성화', value: 'off' },
    ],
    selectedValue: 'on',
  },
  render: function Render(args) {
    const [val, setVal] = useState(args.selectedValue);
    return (
      <div style={{ width: '240px' }}>
        <SegmentedControl
          {...args}
          selectedValue={val}
          onChange={v => {
            setVal(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
};
