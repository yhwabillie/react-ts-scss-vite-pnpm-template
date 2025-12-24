import type { Meta, StoryObj } from '@storybook/react-vite';
import ControlGroup from './ControlGroup';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Radio from '../../atoms/Radio/Radio';
import FormField from '../FormField/FormField';
import Label from '../../atoms/Label/Label';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenRow } from '../../guide/Specimen';
import { GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useId } from 'react';

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
  render: args => {
    // 스토리 세션 내에서 고유한 prefix 생성
    const baseId = useId();

    const controlTypes = [
      { type: 'radio', label: 'Radio ControlGroup', Component: Radio },
      { type: 'checkbox', label: 'Checkbox ControlGroup', Component: Checkbox },
    ];

    const options = [
      { label: '옵션 1', defaultChecked: true },
      { label: '옵션 2' },
      { label: '옵션 3' },
    ];

    return (
      <GuideGroup direction='column'>
        {controlTypes.map(({ type, label, Component }) => {
          // 각 그룹별 고유 ID 생성
          const groupId = `${baseId}-${type}`;

          return (
            <GuideWrapper key={groupId} title={label}>
              <SpecimenRow>
                <SpecimenCell>
                  <AnatomyWrapper style={{ width: '600px' }} minimal={true}>
                    <ControlGroup {...args}>
                      {options.map((option, optIndex) => {
                        // 각 옵션별 고유 ID 자동 발급
                        const uniqueId = `${groupId}-opt-${optIndex}`;

                        return (
                          <FormField
                            key={uniqueId}
                            as='label'
                            htmlFor={uniqueId}
                            size={args.size}
                            direction={args.direction}
                          >
                            <Component
                              as='span'
                              id={uniqueId}
                              name={groupId}
                              color='primary'
                              size={args.size}
                              value={option.label}
                              defaultChecked={option.defaultChecked}
                            />
                            <Label size={args.size}>{option.label}</Label>
                          </FormField>
                        );
                      })}
                    </ControlGroup>
                  </AnatomyWrapper>
                </SpecimenCell>
              </SpecimenRow>
            </GuideWrapper>
          );
        })}
      </GuideGroup>
    );
  },
};

/**
 * 5가지 표준 사이즈(XL ~ XS)에 따른 그룹 내 요소들의 변화를 확인합니다.
 * 모든 자식 요소(FormField, Radio, Checkbox, Label)의 사이즈가 부모와 동기화되는지 검증합니다.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'XS부터 XL까지 각 사이즈별 컨트롤 요소와 라벨의 정렬 및 비율을 확인합니다.',
      },
    },
  },
  render: args => {
    const baseId = useId();
    const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

    // 반복되는 컴포넌트 타입 정의
    const controlTypes = [
      { type: 'radio', Component: Radio },
      { type: 'checkbox', Component: Checkbox },
    ];

    // 옵션 데이터
    const options = [
      { label: '옵션 1', defaultChecked: true },
      { label: '옵션 2' },
      { label: '옵션 3' },
    ];

    return (
      <GuideGroup direction='column'>
        {sizes.map(size => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {controlTypes.map(({ type, Component }) => {
              const groupId = `${baseId}-${size}-${type}`;

              return (
                <SpecimenRow key={groupId}>
                  <GuideWrapper title={type === 'radio' ? size.toUpperCase() : undefined}>
                    <AnatomyWrapper style={{ width: '600px' }} minimal={true}>
                      <ControlGroup {...args}>
                        {options.map((option, index) => {
                          const uniqueId = `${groupId}-${index}`;
                          return (
                            <FormField
                              key={uniqueId}
                              as='label'
                              htmlFor={uniqueId}
                              size={size}
                              direction={args.direction}
                            >
                              <Component
                                as='span'
                                id={uniqueId}
                                name={groupId}
                                color='primary'
                                size={size}
                                value={option.label}
                                defaultChecked={option.defaultChecked}
                              />
                              <Label size={size}>{option.label}</Label>
                            </FormField>
                          );
                        })}
                      </ControlGroup>
                    </AnatomyWrapper>
                  </GuideWrapper>
                </SpecimenRow>
              );
            })}
          </div>
        ))}
      </GuideGroup>
    );
  },
};
