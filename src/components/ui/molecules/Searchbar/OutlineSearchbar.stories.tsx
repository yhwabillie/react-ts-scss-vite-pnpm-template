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
    docs: {
      description: {
        component:
          '**Searchbar**는 텍스트 입력과 동시에 실시간으로 추천 검색어를 제안하는 지능형 검색 컨트롤입니다. <br /><br />' +
          '• 검색어 전송(Submit)과 즉시 삭제(Clear) 버튼을 내장하여 검색 과정의 편의성을 높였습니다. <br />' +
          '• 잦은 상태 업데이트로 인한 성능 저하를 방지하기 위해 디바운싱(Debounce) 로직이 적용되어 있습니다. <br />' +
          '• `pill`, `rounded`, `square` 등 다양한 외형을 지원하여 서비스의 디자인 톤앤매너에 유연하게 대응합니다.',
      },
    },
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

/**
 * 컴포넌트의 가장 기본적인 렌더링 형태입니다.
 * `updateArgs`를 통해 스토리북 내에서 실시간으로 입력 상태가 동기화되도록 설계되었습니다.
 */
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
 * 브랜드 아이덴티티를 나타내는 3가지 핵심 컬러 테마를 대조합니다.
 * - **Visual Hierarchy**: 각 테마 색상이 보더, 포커스 링, 버튼 아이콘에 어떻게 투영되는지 확인합니다.
 * - **Accessibility**: 배경 대비 아이콘과 텍스트의 명도 대비가 표준 가이드라인을 준수하는지 검증합니다.
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
 * XS부터 XL까지 5단계 표준 크기를 확인합니다.
 * - **Alignment**: 높이 변화에 따라 검색 아이콘, 삭제 버튼, 입력 텍스트가 완벽한 수직 중앙 정렬을 유지하는지 체크합니다.
 * - **Proportional Scaling**: 사이즈별로 폰트 크기와 내부 패딩이 조화롭게 스케일링되는지 검수합니다.
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
 * 인터랙션 과정에서 발생하는 시각적 피드백을 고정된 상태로 검증합니다.
 * - **Pseudo-classes**: 호버(Hover) 시의 미세한 색상 변화와 포커스(Focus) 시의 강조 가이드를 디자인 QA 관점에서 확인합니다.
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
 * 서비스의 성격에 맞는 3가지 테두리 형상을 제안합니다.
 * - **Square/Rounded**: 일반적인 웹 대시보드나 전문적인 툴에 권장됩니다.
 * - **Pill**: 모바일 앱 스타일이나 검색 중심의 모던한 서비스 인터페이스에 적합합니다.
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
 * 검색바 내부 버튼의 시각적 위계를 결정하는 두 가지 스타일을 비교합니다.
 * - **Ghost**: 입력창과의 일체감을 강조하며 심플한 룩을 제공합니다.
 * - **Solid**: 검색 버튼을 명확한 호출(CTA) 요소로 강조하고 싶을 때 사용합니다.
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
 * 부모 요소가 레이아웃을 제한(`overflow: hidden`)하는 상황에서도
 * 추천 검색어 리스트가 뷰포트 최상단에 안전하게 표시되는지 검증합니다.
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
 * 실제 사용자의 검색 시나리오를 자동화 테스트로 검증합니다.
 * - **Search Flow**: 키워드 입력 → 리스트 노출 → 키보드 탐색 → 링크 이동으로 이어지는 전체 흐름을 확인합니다.
 * - **UX Detail**: 검색어 삭제 시 포커스가 인풋으로 자동 복구되는지, ESC 키로 리스트가 즉시 닫히는지 등 세밀한 사용성을 체크합니다.
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
