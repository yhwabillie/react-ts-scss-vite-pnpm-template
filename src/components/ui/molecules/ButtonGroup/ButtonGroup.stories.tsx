import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';

const meta = {
  title: 'UI/Molecules/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ButtonGroup은 서로 연관된 동작을 수행하는 버튼들을 하나의 논리적 단위로 묶어주는 컨테이너입니다. <br />' +
          '단순한 시각적 정렬뿐만 아니라 스크린 리더 등 보조 공학 기기 사용자에게 버튼들 간의 관계를 명확히 전달합니다.',
      },
    },
  },
  args: {
    size: 'xl',
    align: 'center',
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
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  args: {},
  render: args => {
    return (
      <ButtonGroup {...args}>
        <Button variant='outline' size={args.size}>
          수정
        </Button>
        <Button variant='solid' size={args.size}>
          저장
        </Button>
      </ButtonGroup>
    );
  },
};

export const AlignLeft: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '버튼 그룹을 부모 컨테이너 내에서 왼쪽, 중앙, 오른쪽으로 정렬합니다. 페이지의 레이아웃 맥락(예: 모달 하단, 폼 하단 등)에 따라 적절한 정렬 방식을 선택합니다.',
      },
    },
  },
  args: {
    align: 'left',
  },
  render: args => {
    return (
      <div style={{ width: '500px', border: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>
        <ButtonGroup {...args}>
          <Button variant='outline' size={args.size}>
            수정
          </Button>
          <Button variant='solid' size={args.size}>
            저장
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

export const AlignCenter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '중앙 정렬은 주로 모달 창의 하단 액션이나 랜딩 페이지의 핵심 섹션에서 시선을 집중시킬 때 사용합니다.',
      },
    },
  },
  args: {
    align: 'center',
  },
  render: args => {
    return (
      <div style={{ width: '500px', border: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>
        <ButtonGroup {...args}>
          <Button variant='outline' size={args.size}>
            수정
          </Button>
          <Button variant='solid' size={args.size}>
            저장
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

export const AlignRight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '오른쪽 정렬은 일반적인 웹 양식(Form)이나 데이터 상세 페이지 하단에서 다음 단계로 나아가는 주 액션 흐름을 배치할 때 권장됩니다.',
      },
    },
  },
  args: {
    align: 'right',
  },
  render: args => {
    return (
      <div style={{ width: '500px', border: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>
        <ButtonGroup {...args}>
          <Button variant='outline' size={args.size}>
            수정
          </Button>
          <Button variant='solid' size={args.size}>
            저장
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '시스템에서 정의한 5가지 표준 사이즈를 통해 내부 버튼들의 크기를 일괄적으로 제어합니다. <br> 버튼 그룹의 크기는 포함된 버튼들의 높이와 간격에 영향을 줍니다.',
      },
    },
  },
  args: {
    align: 'right',
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

            <div style={{ width: '500px', border: '1px dashed #ccc' }}>
              <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>부모 요소</p>

              <ButtonGroup {...args} size={size}>
                <Button variant='outline' size={size}>
                  수정
                </Button>
                <Button variant='solid' size={size}>
                  저장
                </Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
