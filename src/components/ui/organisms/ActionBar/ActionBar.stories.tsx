import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBar from './ActionBar';
import ButtonGroup from '../../molecules/ButtonGroup/ButtonGroup';
import Button from '../../molecules/Button/Button';
import AnatomyWrapper from '../../guide/AnatomyWrapper';

const meta = {
  title: 'UI/Organisms/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // 공통 기본값 설정
  args: {
    size: 'md',
    role: 'group',
    children: null, // 필수 props 초기화
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { category: 'Styles' },
    },
    role: { table: { category: 'Advanced' } },
    ariaLabel: { name: 'aria-label', table: { category: 'Advanced' } },
    children: { control: false, table: { category: 'Contents' } },
    className: { table: { category: 'Styles' } },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 헬퍼 함수: ActionBar 내부 표준 버튼 구성을 생성합니다. (2025-12-27 리팩토링)
 * 각 사이즈별로 동일한 구조를 안전하게 복제하기 위해 분리했습니다.
 */
const renderActionBarContent = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => (
  <>
    <ButtonGroup size={size} align='left'>
      <Button as='a' href='#' color='tertiary' size={size} variant='outline' shape='rounded'>
        목록
      </Button>
    </ButtonGroup>
    <ButtonGroup size={size} align='right' role='group' ariaLabel='편집 작업'>
      <Button color='primary' size={size} variant='outline' shape='rounded'>
        수정
      </Button>
      <Button color='primary' size={size} variant='solid' shape='rounded'>
        저장
      </Button>
    </ButtonGroup>
  </>
);

export const Base: Story = {
  args: {
    size: 'xl',
  },
  render: args => {
    // args.size가 undefined일 경우를 대비한 안전장치
    const size = args.size ?? 'md';
    return (
      <AnatomyWrapper title='부모 요소 (800px)' style={{ width: '800px' }}>
        <ActionBar {...args}>{renderActionBarContent(size)}</ActionBar>
      </AnatomyWrapper>
    );
  },
};

export const Sizes: Story = {
  args: {
    ...meta.args,
  },
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    return (
      <div style={{ display: 'inline-flex', gap: '24px', flexDirection: 'column' }}>
        {sizeOptions.map(size => (
          <AnatomyWrapper
            key={size}
            title={`Size: ${size.toUpperCase()}`}
            style={{ width: '800px' }}
          >
            <ActionBar {...args} size={size}>
              {renderActionBarContent(size)}
            </ActionBar>
          </AnatomyWrapper>
        ))}
      </div>
    );
  },
};
