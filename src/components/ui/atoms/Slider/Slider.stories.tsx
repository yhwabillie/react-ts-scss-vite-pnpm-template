import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import Slider from './Slider';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

/**
 * [Slider]
 * 마우스 드래그 및 키보드 화살표 키로 값을 정밀하게 조절할 수 있는 컴포넌트입니다.
 * - **Accessibility**: `role="slider"` 및 ARIA 속성을 준수하여 키보드 제어(Arrow Keys, Home, End)를 지원합니다.
 * - **Step Logic**: 설정된 `step` 단위로 값이 보정되는 자석 효과가 포함되어 있습니다.
 */
const meta = {
  title: 'UI/Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '시스템 볼륨',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
  argTypes: {
    onChange: { action: 'changed' },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Interactive]
 * 실제 useState를 사용하는 환경을 시뮬레이션하여 드래그 시 값이 실시간으로 반영됩니다.
 */
export const Interactive: Story = {
  render: args => {
    // 💡 에러 없는 상태 관리를 위해 로컬 useState 사용 (2025-12-27 로직)
    const [val, setVal] = useState(args.defaultValue);

    // 스토리북 Controls 패널에서defaultValue를 바꿀 때 동기화
    useEffect(() => {
      setVal(args.defaultValue);
    }, [args.defaultValue]);

    return (
      <AnatomyWrapper title='Interactive Slider' style={{ width: '400px' }}>
        <Slider
          {...args}
          defaultValue={val}
          onChange={newVal => {
            setVal(newVal);
            args.onChange?.(newVal);
          }}
        />
        <div style={{ marginTop: '1rem', color: '#666', fontSize: '14px' }}>
          현재 값: <strong>{val}</strong>
        </div>
      </AnatomyWrapper>
    );
  },
};

/**
 * [02. Precision Step]
 * 소수점 단위 조절이나 큰 단위 이동이 필요한 경우입니다.
 */
export const PrecisionStep: Story = {
  args: {
    label: '투명도 조절',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.5,
  },
  render: args => {
    const [val, setVal] = useState(args.defaultValue);
    return (
      <div style={{ width: '300px' }}>
        <Slider
          {...args}
          defaultValue={val}
          onChange={v => {
            setVal(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
};

/**
 * [03. Range Test]
 * 최소/최대값이 큰 경우의 레이아웃 확인용입니다.
 */
export const LargeRange: Story = {
  args: {
    label: '가격 범위',
    min: 1000,
    max: 100000,
    step: 1000,
    defaultValue: 20000,
  },
  render: args => {
    const [val, setVal] = useState(args.defaultValue);
    return (
      <div style={{ width: '500px' }}>
        <Slider
          {...args}
          defaultValue={val}
          onChange={v => {
            setVal(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
};
