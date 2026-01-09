import type { Meta, StoryObj } from '@storybook/react-vite';
import Selectbox from './Selectbox';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { selectboxOptions } from './Selectbox.mock';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { useId, useState } from 'react';
import Button from '../Button/Button';
import { GuideWrapper } from '../../guide/Guide';
import { within, userEvent, expect, screen } from 'storybook/test';

const meta = {
  title: 'UI/Molecules/Selectbox/Outline',
  component: Selectbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    // Styles
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
      table: { category: 'Styles' },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'],
      table: { category: 'Styles' },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },

    // Contents
    options: {
      control: 'object',
      description: '드롭다운에 표시될 옵션 목록',
      table: { category: 'Contents' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Contents' },
    },

    // States
    defaultOptionId: {
      control: 'text',
      description: '초기 선택값 (비제어)',
      table: { category: 'States' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'States' },
    },
    readOnly: {
      control: 'boolean',
      table: { category: 'States' },
    },
    required: {
      control: 'boolean',
      table: { category: 'States' },
    },

    // Native & Identifiers
    id: {
      control: 'text',
      table: { category: 'Native' },
    },
    selectId: {
      control: 'text',
      description: '내부 select 또는 button 요소의 ID',
      table: { category: 'Native' },
    },

    // Accessibility
    role: {
      control: 'text',
      table: { category: 'Accessibility' },
    },
    'aria-labelledby': {
      control: 'text',
      table: { category: 'Accessibility' },
    },

    // Events
    onValueChange: {
      action: 'valueChanged',
      table: { category: 'Events' },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    role: 'combobox',
    options: selectboxOptions,
    placeholder: '옵션을 선택해 주세요',
    defaultOptionId: '',
  },
} satisfies Meta<typeof Selectbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args, { updateArgs }) => {
    const uniqueId = useId();

    const handleChange = (id: string) => {
      // 스토리북 Controls 패널의 defaultOptionId를 즉시 업데이트
      updateArgs({ defaultOptionId: id });
      // Actions 패널에 이벤트 로그 출력
      args.onValueChange?.(id);
    };

    return <Selectbox {...args} aria-labelledby={uniqueId} onValueChange={handleChange} />;
  },
};

/**
 * 브랜드 컬러 및 상태(Success, Error 등)를 나타내는 각 테마별 스타일을 검토합니다.
 * 1. 테마 일관성: 선택 시 강조색(Primary), 성공(Success), 경고(Warning) 등 각 의미에 맞는 컬러가 테두리와 텍스트에 올바르게 적용되는지 확인합니다.
 * 2. 대비 및 가독성: 배경색과 텍스트 컬러 간의 명도 대비가 충분하여 정보 전달에 문제가 없는지 검토합니다.
 * 3. 피드백 컬러: 드롭다운 아이템의 호버/선택 상태 컬러가 각 테마와 조화를 이루는지 확인합니다.
 * * ※ 개발 가이드: 상황별 의미(예: 오류 발생 시 'danger')에 맞는 적절한 컬러 속성을 사용하여 사용자 경험의 직관성을 높이세요.
 */
export const Colors: Story = {
  render: args => {
    const colorOptions: Array<
      'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
    > = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

    return (
      <SpecimenWrapper>
        {colorOptions.map(color => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Selectbox {...args} color={color} aria-labelledby={uniqueId} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 시스템에서 정의된 5가지 사이즈(XS ~ XL)를 비교 검토합니다.
 * 1. 수직 정렬(Vertical Alignment): 높이 변화에 따라 내부 텍스트와 화살표 아이콘의 중앙 정렬이 유지되는지 확인합니다.
 * 2. 폰트 스케일링: 사이즈에 맞춰 글꼴 크기(`font-size`)와 여백(`padding`)이 적절히 조절되어 가독성을 해치지 않는지 검토합니다.
 * 3. 반응형 및 그리드 대응: 각 사이즈가 프로젝트의 그리드 시스템(예: 8px 단위 등)과 조화를 이루는지 확인합니다.
 * * ※ 개발 가이드: 컴포넌트가 배치될 영역의 너비와 높이 제약에 따라 적절한 사이즈를 선택하세요.
 */
export const Sizes: Story = {
  render: args => {
    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <SpecimenWrapper>
        {sizeOptions.map(size => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <SpecimenRow>
                <Selectbox {...args} size={size} aria-labelledby={uniqueId} />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * Selectbox의 생명주기에서 발생할 수 있는 주요 시각적 상태들을 한눈에 검증합니다.
 * 1. 가상 클래스(Pseudo-classes): `pseudo-hover`, `pseudo-focus` 등을 통해 실제 이벤트 없이도 스타일 CSS를 강제 적용하여 디자인 QA를 용이하게 합니다.
 * 2. 인터랙션 제한: `Read Only`와 `Disabled` 상태에서 클릭 및 드롭다운 오픈이 정상적으로 차단되는지 확인합니다.
 * 3. 접근성(A11y): 각 상태 변화에 따라 스크린 리더가 인지할 수 있는 ARIA 속성이 적절히 변경되는지 검토합니다.
 * * ※ 개발 가이드: 특정 상태의 스타일 수정이 필요할 때 이 스토리를 참고하여 사이드 이펙트를 확인하세요.
 */
export const States: Story = {
  render: args => {
    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus', props: { className: 'pseudo-focus-visible' } },
      { label: 'Read Only', props: { readOnly: true } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <SpecimenWrapper>
        {states.map(state => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <SpecimenRow>
                <Selectbox
                  {...args}
                  {...state.props}
                  aria-labelledby={uniqueId}
                  defaultOptionId='select-3'
                />
              </SpecimenRow>
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * 부모 요소에 `overflow: hidden` 또는 `clip` 속성이 있어도
 * 드롭다운 리스트가 잘리지 않고 정상적으로 노출되는지 확인하는 스토리입니다.
 */
export const PortalTest: Story = {
  render: args => (
    <AnatomyWrapper title='부모 요소가 overflow: hidden 상태입니다.' style={{ overflow: 'hidden' }}>
      <Selectbox {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [제어 컴포넌트 & 초기화 패턴]
 * 외부 상태(useState)를 통해 Selectbox의 값을 강제로 변경하거나 초기화(Reset)하는 예제입니다.
 * * 핵심 구현 팁:
 * 1. Selectbox 내부 로직을 수정하지 않고도 외부에서 Reset을 구현하려면 `key` prop을 활용하세요.
 * 2. `key={value}`를 설정하면, value가 빈 값('')으로 바뀔 때 React가 컴포넌트를 재마운트(Re-mount)합니다.
 * 3. 이 과정에서 내부 상태가 `defaultOptionId`로 전달된 새 값(빈 값)으로 자동 초기화됩니다.
 * * ※ 개발 시 주의: 폼 초기화 기능이 필요한 화면에서 이 패턴을 그대로 복사해서 사용하세요.
 */
export const Controlled: Story = {
  render: args => {
    const uniqueId = useId();

    // 실제 상태 관리
    const [value, setValue] = useState('');

    // 초기화 버튼 클릭 시 실행될 핸들러
    const handleReset = () => {
      setValue(''); // 상태를 빈 값으로 리셋
    };

    return (
      <GuideWrapper title={`Selected ID: ${value || 'none'}`}>
        {/* key에 value를 바인딩.
           value가 바뀌면(reset 포함) Selectbox가 새롭게 마운트되면서
           내부 useState가 args.defaultOptionId(변경된 value)로 다시 초기화.
        */}
        <Selectbox
          {...args}
          key={value}
          aria-labelledby={uniqueId}
          defaultOptionId={value}
          onValueChange={id => setValue(id)}
        />
        <Button variant='solid' color='danger' size='sm' onClick={handleReset}>
          Reset (Re-mount)
        </Button>
      </GuideWrapper>
    );
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 1. 트리거 요소(combobox) 탐색 및 클릭
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // 2. 옵션 선택 테스트 (Portal 대응을 위해 screen 사용)
    const targetOption = args.options?.[1]; // '진행 중' 등 두 번째 옵션
    if (targetOption) {
      // 중복 텍스트 에러 방지: role="option"인 요소 중 이름이 일치하는 것만 탐색
      const optionElement = await screen.findByRole('option', {
        name: new RegExp(targetOption.value, 'i'),
      });
      await userEvent.click(optionElement);

      // 3. 상태 업데이트 확인 (텍스트 매처 함수 사용으로 유연하게 검증)
      await expect(
        canvas.getByText(content => content.includes(`Selected ID: ${targetOption.id}`)),
      ).toBeInTheDocument();
    }

    // 4. 리셋 버튼 동작 테스트 (Re-mount 검증)
    const resetBtn = canvas.getByRole('button', { name: /reset/i });
    await userEvent.click(resetBtn);

    // 5. 초기 상태 복구 확인
    const expectedPlaceholder = args.placeholder ?? '옵션을 선택해 주세요';
    expect(canvas.getByText(expectedPlaceholder)).toBeInTheDocument();
    expect(canvas.getByText(/Selected ID: none/)).toBeInTheDocument();
  },
};
