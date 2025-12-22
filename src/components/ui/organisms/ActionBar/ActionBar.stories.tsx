import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBar from './ActionBar';
import ButtonGroup from '../../molecules/ButtonGroup/ButtonGroup';
import Button from '../../molecules/Button/Button';

const meta = {
  title: 'UI/Organisms/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ActionBar는 페이지 하단이나 폼(Form)의 끝에서 주요 액션을 실행하기 위한 레이아웃 컴포넌트입니다. <br />' +
          '좌우 공간을 활용하여 "목록으로 이동"과 같은 보조 액션과 "저장/수정"과 같은 주요 액션을 시각적으로 분리하여 배치하는 역할을 합니다.',
      },
    },
  },
  args: {
    size: 'xl',
    role: 'group',
    ariaLabel: '편집 작업',
    children: undefined,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ActionBar의 가장 전형적인 구성입니다. <br> 좌측에는 목록 이동 등 현재 맥락을 벗어나는 버튼을, ' +
          '우측에는 데이터 보존 및 변경을 위한 핵심 버튼 그룹을 배치하여 사용자의 시선 흐름을 유도합니다.',
      },
    },
  },
  args: {},
  render: args => {
    return (
      <div style={{ width: '800px', border: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>
        <ActionBar {...args}>
          <ButtonGroup size={args.size} align='left'>
            <Button
              as='a'
              href='#'
              color='tertiary'
              size={args.size}
              variant='outline'
              shape='rounded'
            >
              목록
            </Button>
          </ButtonGroup>
          <ButtonGroup size={args.size} align='right' role='group' ariaLabel='편집 작업'>
            <Button color='primary' size={args.size} variant='outline' shape='rounded'>
              수정
            </Button>
            <Button color='primary' size={args.size} variant='solid' shape='rounded'>
              저장
            </Button>
          </ButtonGroup>
        </ActionBar>
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '다양한 뷰포트나 컨텐츠의 중요도에 따라 5가지 사이즈를 제공합니다. <br>' +
          'ActionBar 내부의 모든 구성 요소(ButtonGroup, Button)는 일관된 수직 리듬을 유지하기 위해 상위 레벨에서 정의된 동일한 사이즈를 상속받아 사용합니다.',
      },
    },
  },
  render: args => {
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];

    return (
      <div
        style={{ display: 'inline-flex', gap: '15px', alignItems: 'end', flexDirection: 'column' }}
      >
        {sizeOptions.map(size => (
          <div
            key={size}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 'bold',
              }}
            >
              {size.toUpperCase()}
            </span>

            <div style={{ width: '800px', border: '1px dashed #ccc' }}>
              <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>

              <ActionBar {...args}>
                <ButtonGroup size={size} align='left'>
                  <Button
                    as='a'
                    href='#'
                    color='tertiary'
                    size={size}
                    variant='outline'
                    shape='rounded'
                  >
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
              </ActionBar>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
