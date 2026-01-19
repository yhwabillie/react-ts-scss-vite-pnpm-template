import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBar from './ActionBar';
import ButtonGroup from '../../molecules/ButtonGroup/ButtonGroup';
import Button from '../../molecules/Button/Button';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'UI/Organisms/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**ActionBar**는 상세 페이지의 하단이나 모달의 푸터 영역에서 데이터의 저장, 수정, 삭제 등의 핵심 액션을 모아 제공하는 컴포넌트입니다. <br /><br />' +
          '• **Layout Orchestration**: 좌측(보조 액션)과 우측(주요 액션)으로 버튼 그룹을 분리 배치하여 사용자 시선 흐름을 유도합니다. <br />' +
          '• **Hierarchy Design**: 시각적 중요도에 따라 Solid와 Outline 버튼을 조합하여 가장 우선순위가 높은 액션을 강조합니다. <br />' +
          '• **Responsive Sizing**: XS부터 XL까지 5단계 사이즈 옵션을 통해 페이지 컨텍스트에 맞는 일관된 스케일을 유지합니다.',
      },
    },
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
 * 액션바의 가장 기본적인 레이아웃 형태를 확인합니다.
 * - **Checklist**: 부모 컨테이너의 너비 내에서 좌측 '목록' 버튼과 우측 '수정/저장' 그룹이 양 끝으로 올바르게 배치되는지 확인합니다.
 */
const renderActionBarContent = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  labels: {
    list: string;
    edit: string;
    save: string;
  },
) => (
  <>
    <ButtonGroup size={size} align='left'>
      <Button as='a' href='#' color='tertiary' size={size} variant='outline' shape='rounded'>
        {labels.list}
      </Button>
    </ButtonGroup>
    <ButtonGroup size={size} align='right' role='group' ariaLabel='편집 작업'>
      <Button color='primary' size={size} variant='outline' shape='rounded'>
        {labels.edit}
      </Button>
      <Button color='primary' size={size} variant='solid' shape='rounded'>
        {labels.save}
      </Button>
    </ButtonGroup>
  </>
);

/**
 * 액션바의 가장 기본적인 레이아웃 형태를 확인합니다.
 * - **Checklist**: 부모 컨테이너의 너비 내에서 좌측 '목록' 버튼과 우측 '수정/저장' 그룹이 양 끝으로 올바르게 배치되는지 확인합니다.
 */
export const Base: Story = {
  args: {
    size: 'xl',
  },
  render: args => {
    const { t } = useTranslation();
    // args.size가 undefined일 경우를 대비한 안전장치
    const size = args.size ?? 'md';
    const labels = {
      list: t('action-bar.left-group.label'),
      edit: t('action-bar.right-group.item.edit'),
      save: t('action-bar.right-group.item.save'),
    };
    return (
      <AnatomyWrapper title='부모 요소 (800px)' style={{ width: '800px' }}>
        <ActionBar {...args}>{renderActionBarContent(size, labels)}</ActionBar>
      </AnatomyWrapper>
    );
  },
};

/**
 * XS부터 XL까지 총 5가지 사이즈에 따른 스케일링을 검증합니다.
 * - **Consistency**: 사이즈가 변함에 따라 액션바 내부의 패딩뿐만 아니라 포함된 `ButtonGroup`과 `Button`의 크기가 유기적으로 함께 변화하는지 점검합니다.
 * - **A11y Check**: 작은 사이즈(XS, SM)에서도 버튼 사이의 간격이 충분하여 터치 오류가 발생하지 않는지 확인합니다.
 */
export const Sizes: Story = {
  args: {
    ...meta.args,
  },
  render: args => {
    const { t } = useTranslation();
    const sizeOptions: Array<'xl' | 'lg' | 'md' | 'sm' | 'xs'> = ['xl', 'lg', 'md', 'sm', 'xs'];
    const labels = {
      list: t('action-bar.left-group.label'),
      edit: t('action-bar.right-group.item.edit'),
      save: t('action-bar.right-group.item.save'),
    };

    return (
      <div style={{ display: 'inline-flex', gap: '24px', flexDirection: 'column' }}>
        {sizeOptions.map(size => (
          <AnatomyWrapper
            key={size}
            title={`Size: ${size.toUpperCase()}`}
            style={{ width: '800px' }}
          >
            <ActionBar {...args} size={size}>
              {renderActionBarContent(size, labels)}
            </ActionBar>
          </AnatomyWrapper>
        ))}
      </div>
    );
  },
};
