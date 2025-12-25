import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './Textarea';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import React from 'react';

const meta = {
  title: 'UI/Atoms/Textarea/Outline',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Identification
    id: {
      control: 'text',
      table: { category: 'Identification' },
    },
    name: {
      control: 'text',
      table: { category: 'Identification' },
    },

    // Control
    defaultValue: {
      control: 'text',
      table: { category: 'Control' },
    },
    value: {
      control: 'text',
      table: { category: 'Control' },
    },
    onChange: {
      table: { category: 'Control' },
    },

    // Styles
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '배경색과 테두리 스타일을 결정합니다.',
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      description: '컴포넌트의 테마 색상을 결정합니다.',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      description: 'Textarea 크기를 조절합니다.',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Behavioral
    placeholder: {
      control: 'text',
      table: { category: 'Behavioral' },
    },
    rows: {
      control: { type: 'number', min: 1 },
      description: '기본적으로 보여질 줄 수를 결정합니다.',
      table: { category: 'Behavioral' },
    },
    maxLength: {
      control: { type: 'number', max: 400 },
      table: { category: 'Behavioral' },
    },

    // Status
    disabled: { control: 'boolean', table: { category: 'Status' } },
    readOnly: { control: 'boolean', table: { category: 'Status' } },

    // Etc
    showCount: {
      control: 'boolean',
      table: { category: 'Etc' },
    },
    className: {
      control: 'text',
      table: { category: 'Etc' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'xs',
    rows: 4,
    placeholder: '내용을 입력해주세요.',
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본적인 텍스트 영역 형태입니다.
 */
export const Base: Story = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {},
  render: args => {
    /** * Storybook Autodocs에서는 같은 스토리가 여러 번 렌더링될 수 있으므로,
     * 각 인스턴스가 고유한 name과 id를 갖도록 랜덤값을 활용하거나
     * 고유한 접미사를 붙여줌.
     */
    const uniqueId = `textarea-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <AnatomyWrapper title='부모 요소 : 800px'>
        <SpecimenRow>
          <SpecimenCell style={{ width: '800px' }}>
            <Textarea {...args} id={uniqueId} name={uniqueId} />
          </SpecimenCell>
        </SpecimenRow>
      </AnatomyWrapper>
    );
  },
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '디자인 시스템의 시멘틱 컬러를 적용한 모습입니다. 각 컬러에 따라 테두리(Focus), 카운터 숫자, 배경색의 톤이 결정됩니다.',
      },
    },
  },
  args: {
    name: 'textarea-color-group',
  },
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = `textarea-color-${color}`;

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <SpecimenCell caption='Empty'>
                  <Textarea
                    {...args}
                    color={color}
                    id={`${uniqueId}-empty`}
                    name={`${uniqueId}-empty`}
                    defaultValue=''
                  />
                </SpecimenCell>
                <SpecimenCell caption='Filled'>
                  <Textarea
                    {...args}
                    color={color}
                    id={`${uniqueId}-fill`}
                    name={`${uniqueId}-fill`}
                    defaultValue='내용이 입력된 상태입니다.'
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'SCSS Map으로 정의된 5가지 표준 너비 규격입니다. 각 사이즈는 가독성을 고려한 max-width를 가집니다.',
      },
    },
  },
  render: args => {
    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <SpecimenGroup direction='column'>
        {sizeOptions.map(size => (
          <React.Fragment key={size}>
            {size === 'xl' ? (
              <AnatomyWrapper title='부모 요소 : 800px'>
                <SpecimenRow>
                  <SpecimenCell caption='XL (100%)' style={{ width: '800px' }}>
                    <Textarea {...args} size={size} />
                  </SpecimenCell>
                </SpecimenRow>
              </AnatomyWrapper>
            ) : (
              <SpecimenRow>
                <SpecimenCell caption={size}>
                  <Textarea {...args} size={size} />
                </SpecimenCell>
              </SpecimenRow>
            )}
          </React.Fragment>
        ))}
      </SpecimenGroup>
    );
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textarea의 비활성화, 읽기 전용, 글자 수 제한 등 다양한 인터랙션 상태를 확인합니다.',
      },
    },
  },
  render: args => {
    const states = [
      { label: 'Normal', class: '' },
      { label: 'Hover', class: 'pseudo-hover' },
      { label: 'Focus', class: 'pseudo-focus-visible' },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = `textarea-${Math.random().toString(36).slice(2, 7)}`;

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <SpecimenCell caption='Empty'>
                  <Textarea
                    {...args}
                    className={state.class}
                    {...state.props}
                    id={`${uniqueId}-empty`}
                    name={`${uniqueId}-empty`}
                  />
                </SpecimenCell>
                <SpecimenCell caption='Filled'>
                  <Textarea
                    {...args}
                    className={state.class}
                    {...state.props}
                    id={`${uniqueId}-fill`}
                    name={`${uniqueId}-fill`}
                    defaultValue='내용이 입력된 상태입니다.'
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

export const WithCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`showCount`와 `maxLength`를 조합하여 실시간 글자 수를 표시합니다. 최대치 도달 시 강조 스타일이 적용됩니다.',
      },
    },
  },
  render: args => {
    const scenarios = [
      { label: 'Empty', props: { defaultValue: '', placeholder: '글자를 입력해보세요.' } },
      { label: 'Typing', props: { defaultValue: '현재 입력 중인 상태입니다.' } },
      {
        label: 'Max Limit',
        props: { defaultValue: '최대 글자 수에 도달하면 카운터 색상이 변합니다.' },
      },
    ];

    return (
      <SpecimenWrapper>
        {scenarios.map(scenario => {
          const isMax = scenario.label === 'Max Limit';

          return (
            <SpecimenGroup key={scenario.label} title={scenario.label}>
              <SpecimenRow>
                <SpecimenCell>
                  <Textarea
                    {...args}
                    {...scenario.props}
                    showCount
                    // Max Limit 시나리오에서는 글자 수에 딱 맞게 maxLength 설정
                    maxLength={isMax ? scenario.props.defaultValue.length : 17}
                  />
                </SpecimenCell>
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};
