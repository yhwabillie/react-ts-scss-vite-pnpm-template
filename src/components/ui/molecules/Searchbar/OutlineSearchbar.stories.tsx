import type { Meta, StoryObj } from '@storybook/react-vite';
import Searchbar from './Searchbar';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { SpecimenGroup, SpecimenWrapper } from '../../guide/Specimen';
import { searchbarOptions } from './Searchbar.mock';
import Icon from '../../atoms/Icon/Icon';

/**
 * [Searchbar]
 * 검색어 입력, 디바운스된 결과 처리, 자동완성 제안 기능을 제공하는 컴포넌트입니다.
 * - **Debounce**: `debounceMs`를 통해 입력 빈도를 조절하여 성능을 최적화합니다.
 * - **A11y**: 검색 결과 개수를 실시간으로 스크린 리더에 안내합니다.
 * - **Actions**: 검색어 삭제(Clear) 및 검색 실행(Submit) 액션을 커스텀할 수 있습니다.
 */
const meta = {
  title: 'UI/Molecules/Searchbar/Outline',
  component: Searchbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'outline',
    color: 'primary',
    size: 'md',
    shape: 'rounded',
    options: searchbarOptions,
    debounceMs: 300,
    inputProps: {
      inputId: 'search-input',
      labelText: '과일 검색',
      placeholder: '과일 이름을 입력하세요...',
    },
    actions: {
      submitAction: {
        type: 'submit',
        icon: <Icon name='search' />,
        onClick: () => alert('검색 실행!'),
      },
      utilityAction: {
        type: 'clear',
        icon: <Icon name='x' />,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'error'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['square', 'rounded', 'pill'] },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [01. Base]
 * 디바운스 처리된 입력값 변경과 옵션 선택을 확인합니다.
 * updateArgs를 통해 입력창의 값이 스토리북 패널에도 반영됩니다.
 */
export const Base: Story = {
  render: (args, { updateArgs }) => {
    const handleValueChange = (value: string) => {
      // 1. 스토리북 패널의 value 동기화
      updateArgs({ inputProps: { ...args.inputProps, value } });
      // 2. Actions 로그 기록
      console.log('Debounced Value:', value);
    };

    return (
      <AnatomyWrapper title='Standard Searchbar' style={{ width: '450px' }}>
        <Searchbar {...args} inputProps={{ ...args.inputProps, onChange: handleValueChange }} />
      </AnatomyWrapper>
    );
  },
};

/**
 * [02. Shapes]
 * Square, Rounded, Pill 등 컴포넌트 외형 옵션을 검증합니다.
 */
export const Shapes: Story = {
  render: args => (
    <SpecimenWrapper style={{ width: '800px' }}>
      {(['square', 'rounded', 'pill'] as const).map(shape => (
        <SpecimenGroup key={shape} title={shape.toUpperCase()} direction='row'>
          <AnatomyWrapper minimal style={{ width: '400px' }}>
            <Searchbar {...args} shape={shape} />
          </AnatomyWrapper>
        </SpecimenGroup>
      ))}
    </SpecimenWrapper>
  ),
};

/**
 * [03. Debounce Test]
 * 디바운스 시간을 조절하여 부모 컴포넌트로 전달되는 타이밍을 테스트합니다.
 */
export const DebounceTest: Story = {
  args: {
    debounceMs: 1000,
    inputProps: {
      ...meta.args.inputProps,
      placeholder: '입력 후 1초 뒤에 데이터가 업데이트됩니다.',
    },
  },
  render: args => (
    <AnatomyWrapper title='1s Debounce Delay' style={{ width: '450px' }}>
      <Searchbar {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [04. Empty Results]
 * 검색 결과가 없을 때의 UI 피드백과 스크린 리더 안내를 확인합니다.
 */
export const NoResults: Story = {
  args: {
    inputProps: {
      ...meta.args.inputProps,
      value: '존재하지 않는 검색어',
    },
  },
  render: args => (
    <AnatomyWrapper title='Empty State Feedback' style={{ width: '450px' }}>
      <Searchbar {...args} />
    </AnatomyWrapper>
  ),
};

/**
 * [05. Utility Configurations]
 * 특정 액션 버튼(Submit 전용, Clear 전용 등) 구성을 확인합니다.
 */
export const CustomActions: Story = {
  render: args => (
    <SpecimenWrapper>
      <SpecimenGroup title='Only Submit' direction='row'>
        <AnatomyWrapper minimal style={{ width: '400px' }}>
          <Searchbar {...args} actions={{ submitAction: args.actions?.submitAction }} />
        </AnatomyWrapper>
      </SpecimenGroup>
      <SpecimenGroup title='No Actions' direction='row'>
        <AnatomyWrapper minimal style={{ width: '400px' }}>
          <Searchbar {...args} actions={undefined} />
        </AnatomyWrapper>
      </SpecimenGroup>
    </SpecimenWrapper>
  ),
};
