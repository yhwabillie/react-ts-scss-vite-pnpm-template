import type { Meta, StoryObj } from '@storybook/react-vite';
import Searchbar from './Searchbar';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenCell, SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';
import { searchbarOptions } from './Searchbar.mock';
import Icon from '../../atoms/Icon/Icon';
import { useId } from 'react';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { GuideCell, GuideGroup, GuideRow } from '../../guide/Guide';

const meta = {
  title: 'UI/Molecules/Combobox/Searchbar',
  component: Searchbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    // 🎨 Style 카테고리: 시각적 외형 정의
    variant: {
      description: '검색바의 전체적인 테마 스타일을 결정합니다.',
      control: 'inline-radio',
      options: ['solid', 'outline'],
      table: {
        category: 'Style',
        type: { summary: "'solid' | 'outline'" },
        defaultValue: { summary: 'outline' },
      },
    },
    color: {
      description: '디자인 시스템에 정의된 브랜드 컬러 테마를 적용합니다.',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        category: 'Style',
        type: { summary: 'Color' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: '검색바의 높이, 패딩 및 내부 폰트 크기를 조절합니다.',
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Style',
        type: { summary: 'Size' },
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      description: '모서리의 굴곡(Border-radius) 정도를 설정합니다.',
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
      table: {
        category: 'Style',
        type: { summary: 'Shape' },
        defaultValue: { summary: 'rounded' },
      },
    },
    buttonProps: {
      description: '내부 버튼(Submit, Clear)의 시각적 속성을 일괄 설정합니다.',
      table: {
        category: 'Style',
        type: { summary: '{ variant: "ghost" | "solid" }' },
      },
    },

    // ⚙️ Configuration 카테고리: 기술적 설정 및 A11y
    id: {
      description: '컴포넌트의 고유 식별자입니다. ARIA 속성 연동의 기준이 됩니다.',
      control: 'text',
      table: { category: 'Configuration' },
    },
    debounceMs: {
      description: '검색어 입력 시 필터링이 발생하기까지의 지연 시간(ms)입니다.',
      control: { type: 'number', min: 0, step: 50 },
      table: {
        category: 'Configuration',
        defaultValue: { summary: '300' },
      },
    },
    inputProps: {
      description: '내부 input 요소에 전달되는 속성 및 접근성 설정입니다.',
      control: 'object',
      table: {
        category: 'Configuration',
        type: { summary: 'InputA11yProps & inputAttributes' },
      },
    },

    // 📊 Data 카테고리: 검색 결과 리스트 데이터
    options: {
      description: '자동완성 리스트에 표시될 데이터 배열입니다. (Memoization 권장)',
      control: 'object',
      table: {
        category: 'Data',
        type: { summary: 'OptionType[]' },
      },
    },

    // 🖱️ Actions 카테고리: 인터랙션 버튼 정의
    actions: {
      description: '검색 전송(Submit) 및 유틸리티(Clear/Toggle) 버튼의 아이콘과 동작을 정의합니다.',
      control: 'object',
      table: {
        category: 'Actions',
        type: { summary: '{ submitAction?: SearchbarAction, utilityAction?: SearchbarAction }' },
      },
    },
  },

  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    shape: 'rounded',
    options: searchbarOptions,
    debounceMs: 300,
    inputProps: {
      role: 'combobox',
      inputId: 'search-input',
      labelText: '검색',
      placeholder: '검색어를 입력해 주세요',
    },
    actions: {
      submitAction: {
        type: 'submit',
        icon: (
          <Icon
            className='icon'
            name='search'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2.5}
          />
        ),
        onClick: () => alert('검색 실행!'),
      },
      utilityAction: {
        type: 'clear',
        icon: (
          <Icon
            className='icon'
            name='x'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2.5}
          />
        ),
      },
    },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args, context) => {
    const { updateArgs } = context;

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <Searchbar
        {...args}
        inputProps={{
          ...args.inputProps,
          // 현재 전달된 args의 value를 사용
          value: args.inputProps?.value,
          onChange: handleValueChange,
        }}
      />
    );
  },
};

/**
 * * `Searchbar` 컴포넌트의 테마 색상 시스템을 정의합니다.
 * 프로젝트의 디자인 토큰에 정의된 6가지 핵심 색상(`primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`)을 지원하며,
 * 각 색상은 `variant`(solid, outline)와 결합되어 다양한 시각적 위계를 형성합니다.
 * * **접근성**: 모든 색상 조합은 배경색 대비 최소 명도 대비를 유지하도록 설계되었습니다.
 * - **상태 변화**: 각 컬러 테마는 Hover, Active, Focus 상태에 대한 고유한 피드백 색상을 포함합니다.
 */
export const Colors: Story = {
  render: (args, context) => {
    const colorOptions: Array<'primary' | 'secondary' | 'tertiary'> = [
      'primary',
      'secondary',
      'tertiary',
    ];

    const { updateArgs } = context;

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <SpecimenWrapper>
        {colorOptions.map((color, idx) => {
          return (
            <SpecimenGroup key={color} title={color}>
              <SpecimenRow>
                <Searchbar
                  {...args}
                  color={color}
                  inputProps={{
                    ...args.inputProps,
                    inputId: `${idx}`,
                    value: args.inputProps?.value,
                    onChange: handleValueChange,
                  }}
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
 * * `Searchbar` 컴포넌트의 5가지 표준 크기(`xs`, `sm`, `md`, `lg`, `xl`)를 정의합니다.
 * **특징**:
 * - 각 크기에 따라 `input`의 높이, 패딩, 폰트 사이즈 및 내부 아이콘 버튼의 크기가 유동적으로 조절됩니다.
 * - `updateArgs`를 공유하여 하나의 입력창에 값을 입력하면 모든 크기의 컴포넌트 상태가 동시에 업데이트되므로 시각적 비교가 용이합니다.
 */
export const Sizes: Story = {
  render: (args, context) => {
    const { updateArgs } = context;

    const sizeOptions: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <SpecimenWrapper>
        {sizeOptions.map((size, idx) => {
          return (
            <SpecimenGroup key={size} title={size.toUpperCase()}>
              <SpecimenRow>
                <Searchbar
                  {...args}
                  size={size}
                  inputProps={{
                    ...args.inputProps,
                    inputId: `${idx}`,
                    value: args.inputProps?.value,
                    onChange: handleValueChange,
                  }}
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
 * * `Searchbar` 컴포넌트의 인터랙션 상태별 시각적 피드백을 한눈에 확인합니다.
 * * **필터링 로직 적용**:
 * - 전달된 `className` 중 `pseudo-` 접두사로 시작하는 클래스만 선별적으로 추출하여 적용합니다.
 * - 이를 통해 실제 마우스 오버나 포커스 없이도 `Hover`, `Focus` 등의 디자인 가이드를 고정된 상태로 검증할 수 있습니다.
 * * **상태 정의**:
 * - **Normal**: 아무런 인터랙션이 없는 기본 상태입니다.
 * - **Hover**: 마우스 커서가 컴포넌트 영역 위에 위치했을 때의 상태입니다. (`pseudo-hover`)
 * - **Focus (Typing)**: 입력창에 포커스가 진입하여 텍스트를 입력 중인 상태입니다. (`pseudo-focus-visible`)
 */
export const States: Story = {
  render: (args, context) => {
    const { updateArgs } = context;

    const states = [
      { label: 'Normal', props: {} },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Focus (Typing)', props: { className: 'pseudo-focus-visible' } },
    ];

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <SpecimenWrapper>
        {states.map((state, idx) => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={state.label}>
              <Searchbar
                {...args}
                {...state.props}
                inputProps={{
                  ...args.inputProps,
                  inputId: `${idx}`,
                  value: args.inputProps?.value,
                  onChange: handleValueChange,
                }}
              />
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * `Searchbar` 컴포넌트의 3가지 테두리 형태(`square`, `rounded`, `pill`)를 정의합니다.
 * * **특징**:
 * - **SQUARE**: 직각 형태의 테두리로, 보수적이거나 격식 있는 UI 아키텍처에 적합합니다.
 * - **ROUNDED**: 표준적인 둥근 모서리(Border-radius)를 가지며, 가장 범용적으로 사용됩니다.
 * - **PILL**: 완전히 둥근 형태(Capsule shape)로, 모던하고 부드러운 인상을 주며 모바일 친화적인 UX에 권장됩니다.
 * * **데이터 동기화**: `updateArgs`를 통해 모든 형상의 입력값을 동기화하므로, 형상에 따른 텍스트 가독성과 버튼 배치를 쉽게 비교할 수 있습니다.
 */
export const Shapes: Story = {
  render: (args, context) => {
    const shapeOptions: Array<'square' | 'rounded' | 'pill'> = ['square', 'rounded', 'pill'];
    const { updateArgs } = context;

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <GuideGroup direction='column'>
        {shapeOptions.map((shape, idx) => (
          <GuideRow key={shape} direction='column'>
            {/* 상단 캡션용 Cell */}
            <GuideCell caption={shape.toUpperCase()}>
              <Searchbar
                {...args}
                shape={shape}
                inputProps={{
                  ...args.inputProps,
                  inputId: `${idx}`,
                  value: args.inputProps?.value,
                  onChange: handleValueChange,
                }}
              />
            </GuideCell>
          </GuideRow>
        ))}
      </GuideGroup>
    );
  },
};

/**
 * * `Searchbar` 내부 액션 버튼(Submit, Utility)의 시각적 스타일(`ghost`, `solid`)을 정의합니다.
 * * **특징**:
 * - **GHOST**: 배경색 없이 아이콘만 강조되어, 입력창과의 시각적 간섭을 최소화하고 미니멀한 디자인을 유지할 때 사용합니다.
 * - **SOLID**: 버튼에 배경색을 채워 시각적 위계(Visual Hierarchy)를 높이며, 검색 동작을 명확한 호출(Call-to-Action)로 강조하고 싶을 때 적합합니다.
 * * **인터랙션**: `updateArgs`를 통해 모든 인스턴스의 값이 실시간으로 동기화되므로, 버튼 스타일 변화에 따른 전체적인 밸런스를 한눈에 파악할 수 있습니다.
 */
export const Variants: Story = {
  render: (args, context) => {
    const { updateArgs } = context;

    type btnVariantsType = 'ghost' | 'solid';

    const btnVariants: btnVariantsType[] = ['ghost', 'solid'];

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <SpecimenWrapper>
        {btnVariants.map((variant, idx) => {
          const uniqueId = useId();

          return (
            <SpecimenGroup key={uniqueId} title={variant}>
              <Searchbar
                {...args}
                buttonProps={{ variant: variant }}
                inputProps={{
                  ...args.inputProps,
                  inputId: `${idx}`,
                  value: args.inputProps?.value,
                  onChange: handleValueChange,
                }}
              />
            </SpecimenGroup>
          );
        })}
      </SpecimenWrapper>
    );
  },
};

/**
 * * 부모 요소가 `overflow: hidden`인 열악한 레이아웃 환경에서도 옵션 리스트가 정상적으로 노출되는지 테스트합니다.
 * **검증 포인트**:
 * - `OptionListPortal`을 사용하여 DOM 구조상 `body` 하단에 렌더링되므로 부모의 `overflow` 설정에 영향을 받지 않습니다.
 * - 리사이즈 및 스크롤 발생 시 `getBoundingClientRect`를 통해 위치가 실시간으로 재계산되는지 확인합니다.
 */
export const PortalTest: Story = {
  render: (args, context) => {
    const { updateArgs } = context;

    const handleValueChange = (value: string) => {
      if (typeof updateArgs === 'function') {
        updateArgs({
          inputProps: {
            ...args.inputProps,
            value,
          },
        });
      }
    };

    return (
      <AnatomyWrapper
        title='부모 요소가 overflow: hidden 상태입니다.'
        style={{ overflow: 'hidden' }}
      >
        <Searchbar
          {...args}
          inputProps={{
            ...args.inputProps,
            value: args.inputProps?.value,
            onChange: handleValueChange,
          }}
        />
      </AnatomyWrapper>
    );
  },
};

/**
 * * 실제 사용자의 인터랙션 흐름을 시뮬레이션하여 컴포넌트의 비즈니스 로직과 접근성을 자동 검증합니다.
 * **테스트 시나리오**:
 * 1. **검색 필터링**: 키워드 입력 시 관련 옵션만 필터링되어 나타나는지 확인합니다.
 * 2. **삭제(Clear) 동작**: 유틸리티 버튼 클릭 시 입력값 초기화 및 포커스가 입력창으로 안전하게 복구되는지 검증합니다.
 * 3. **Empty State**: 일치하는 결과가 없을 때 안내 문구가 노출되는지 확인합니다.
 * 4. **키보드 접근성 (ESC)**: `Escape` 키 입력 시 리스트가 즉시 닫히는지 확인합니다.
 * 5. **네비게이션 & 선택**: 화살표 키(`ArrowDown`)로 옵션에 진입하고, `Enter` 입력 시 해당 옵션의 링크(href) 정보를 정확히 파악하는지 검증합니다.
 */
export const InteractiveTest: Story = {
  ...Base,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('검색어를 입력해 주세요');

    await step('1. "개발" 검색 및 관련 검색어 노출 확인', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '개발');

      await waitFor(() => {
        const portal = within(document.body);
        expect(portal.getByText(/개발/)).toBeInTheDocument();
        expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
      });
    });

    // 🎯 추가된 삭제 버튼 테스트 케이스
    await step('2. 삭제 버튼 클릭 시 입력값 초기화 및 포커스 복원 확인', async () => {
      // 1. 삭제 버튼(X) 찾기
      const clearButton = canvas.getByLabelText('검색어 지우기');
      await expect(clearButton).toBeInTheDocument();

      // 2. 삭제 버튼 클릭
      await userEvent.click(clearButton);

      // 3. 값 초기화 검증
      await expect(input).toHaveValue('');

      // 4. 포커스가 다시 input으로 돌아왔는지 확인 (중요)
      await waitFor(
        () => {
          expect(input).toHaveFocus();
        },
        { timeout: 1000 },
      );

      // 5. 필터링이 풀려 리스트가 닫히거나 초기화되었는지 확인 (현재 로직은 closeList 실행)
      await waitFor(() => {
        expect(document.body.querySelector('[role="listbox"]')).not.toBeInTheDocument();
      });
    });

    await step('3. 검색 결과가 없는 경우 Empty State 확인', async () => {
      await userEvent.type(input, '존재하지않는검색어');

      await waitFor(() => {
        const portal = within(document.body);
        expect(portal.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
      });
    });

    await step('4. ESC 키 입력 시 리스트 닫힘 확인', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '개발');

      await waitFor(() => {
        expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
      });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(document.body.querySelector('[role="listbox"]')).not.toBeInTheDocument();
      });
    });

    await step('5. ArrowDown 진입 및 링크 정보 로그 출력', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '데이터');

      await waitFor(() => {
        expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
      });

      // 화살표 키로 리스트 진입
      await userEvent.keyboard('{ArrowDown}');

      const portal = within(document.body);
      const targetLink = portal.getByText(/데이터/i).closest('a');

      if (targetLink) {
        await expect(targetLink).toHaveFocus();

        const href = targetLink.getAttribute('href');
        const target = targetLink.getAttribute('target') || '_self';
        console.log(`[Final Test] 선택된 링크: ${href}, 타겟: ${target}`);

        expect(href).toBe('/interview/data-science');

        // 실제 이동 방지 처리
        targetLink.addEventListener('click', e => e.preventDefault(), { once: true });
        await userEvent.keyboard('{Enter}');
      }

      await waitFor(() => {
        expect(document.body.querySelector('[role="listbox"]')).not.toBeInTheDocument();
      });
    });
  },
};
