import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from './Tooltip';
import Button from '../../molecules/Button/Button';
import IconButton from '../../molecules/IconButton/IconButton';
import Icon from '../Icon/Icon';
import { within, userEvent } from 'storybook/test';
import { GuideCell, GuideGroup, GuideWrapper } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Tooltip**은 요소에 대한 추가 설명이나 도움말을 일시적으로 표시하는 컴포넌트입니다. <br />' +
          '트리거 요소의 위치와 뷰포트 경계를 계산하여 최적의 가독성을 확보하는 포지셔닝 로직이 내장되어 있습니다. <br /><br />' +
          '• **Positioning**: 화면 끝단에서 공간이 부족할 경우 반대 방향으로 자동 전환(Flip) <br />' +
          '• **Accessibility**: `aria-describedby` 연결을 통한 스크린 리더 지원 및 키보드 포커스 대응 <br />' +
          '• **Standard vs Rich**: 단순 텍스트 정보부터 인터랙티브한 상세 설명까지 대응하는 두 가지 유형 제공',
      },
    },
  },
  argTypes: {
    // --- [Data & Content] ---
    id: {
      name: 'ID',
      description: '접근성 연결을 위한 고유 식별자 (미지정 시 자동 생성)',
      control: false,
      table: { category: 'Data' },
    },
    content: {
      name: 'Content',
      description: '툴팁 내부에 표시할 내용',
      control: 'text',
      table: { category: 'Data' },
    },
    children: {
      name: 'Trigger Element',
      description: '툴팁을 활성화할 트리거 요소 (Button, Icon 등)',
      control: false,
      table: { category: 'Data' },
    },

    // --- [Appearance] ---
    variant: {
      name: 'Variant',
      description: '툴팁 구성 방식',
      options: ['standard', 'rich'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'standard' },
      },
    },
    shape: {
      name: 'Shape',
      description: '꼬리 포함 여부',
      options: ['balloon', 'plain'],
      control: { type: 'inline-radio' }, // select보다 빠른 조작 가능
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'balloon' },
      },
    },
    size: {
      name: 'Size',
      description: '크기 규격',
      options: ['sm', 'md'],
      control: { type: 'radio' },
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },

    // --- [Layout & Positioning] ---
    preferredPosition: {
      name: 'Preferred Position',
      description: '우선적으로 배치될 방향 (공간 부족 시 Flip 로직 작동)',
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'select' },
      table: {
        category: 'Layout',
        defaultValue: { summary: 'top' },
      },
    },
    align: {
      // ✅ 누락된 align 추가
      name: 'Alignment',
      description: '상하(top/bottom) 배치 시의 수평 정렬 기준',
      options: ['start', 'center', 'end'],
      control: { type: 'inline-radio' },
      table: {
        category: 'Layout',
        defaultValue: { summary: 'center' },
      },
    },
    className: {
      name: 'Custom Class',
      description: '외부 스타일 주입용 클래스명',
      control: 'text',
      table: { category: 'Layout' },
    },
  },
  args: {
    variant: 'standard',
    shape: 'plain',
    size: 'sm',
    content: '도움말 내용입니다.',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * 툴팁의 가장 기본적인 사용 사례입니다.
 * 주로 IconButton과 결합하여 해당 아이콘이 수행하는 기능을 짧은 텍스트로 보완합니다.
 */
export const Base: Story = {
  render: args => {
    const { t } = useTranslation();
    const baseLabels = [
      t('tooltip.base.items.label_a'),
      t('tooltip.base.items.label_b'),
      t('tooltip.base.items.label_c'),
    ];

    return (
      <GuideWrapper
        style={{ flexDirection: 'row', gap: '10px', margin: 'auto', width: 'fit-content' }}
      >
        <Tooltip
          content={baseLabels[0]}
          variant={args.variant}
          shape={args.shape}
          size={args.size}
          align={args.align}
        >
          <IconButton
            aria-label={baseLabels[0]}
            color='primary'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='search' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
        <Tooltip
          content={baseLabels[1]}
          variant={args.variant}
          shape={args.shape}
          size={args.size}
          align={args.align}
        >
          <IconButton
            aria-label={baseLabels[1]}
            color='secondary'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
        <Tooltip
          content={baseLabels[2]}
          variant={args.variant}
          shape={args.shape}
          size={args.size}
          align={args.align}
        >
          <IconButton
            aria-label={baseLabels[2]}
            color='tertiary'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='ellipsis' className='icon' strokeWidth={2.5} />}
          />
        </Tooltip>
      </GuideWrapper>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 버튼 역할을 하는 요소들 중 첫 번째 요소를 찾습니다.
    const buttons = canvas.getAllByRole('button');
    if (buttons[0]) {
      await userEvent.hover(buttons[0]);
    }
  },
};

/**
 * 트리거 요소를 지시하는 꼬리(Arrow)의 유무를 결정합니다.
 * - balloon: 꼬리가 있어 툴팁의 대상을 명확히 시각적으로 연결합니다.
 * - plain: 꼬리가 없는 사각형 형태로, 시각적 요소가 많은 화면에서 간결함을 유지합니다.
 */
export const Shape: Story = {
  render: () => {
    const { t } = useTranslation();
    const helpLabel = t('tooltip.base.items.label_a');
    const alertLabel = t('tooltip.base.items.label_b');

    return (
      <GuideWrapper
        style={{ flexDirection: 'row', gap: '60px', margin: 'auto', width: 'fit-content' }}
      >
        <GuideCell caption='balloon'>
          <Tooltip content={t('tooltip.shape.ballon')} shape='balloon' size='sm'>
            <IconButton
              aria-label={helpLabel}
              color='primary'
              size='md'
              variant='outline'
              shape='pill'
              icon={<Icon name='search' className='icon' strokeWidth={2.5} />}
            />
          </Tooltip>
        </GuideCell>
        <GuideCell caption='plain'>
          <Tooltip content={t('tooltip.shape.plain')} shape='plain' size='sm'>
            <IconButton
              aria-label={alertLabel}
              color='secondary'
              size='md'
              variant='outline'
              shape='pill'
              icon={<Icon name='bell' className='icon' strokeWidth={2.5} />}
            />
          </Tooltip>
        </GuideCell>
      </GuideWrapper>
    );
  },
  // 큐레이션을 위해 두 툴팁을 모두 보여주고 싶다면 play 함수에서 루프를 돌립니다.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    // 모든 버튼에 hover를 순차적으로 적용하여 툴팁들을 활성화 (구현 방식에 따라 하나만 남을 수 있음)
    for (const button of buttons) {
      await userEvent.hover(button);
    }
  },
};

/**
 * 용도에 따른 구성 방식의 차이를 정의합니다.
 * - standard: 마우스 호버나 키보드 포커스 시 나타나는 정적인 도움말입니다.
 * - rich: 상세한 설명이 담기며, 상황에 따라 클릭으로 활성화되거나 내부 인터랙션이 포함될 수 있습니다.
 */
export const Variants: Story = {
  render: () => {
    const { t } = useTranslation();
    const standardContent = t('tooltip.sizes.standard.plain.content');
    const richContent = t('tooltip.sizes.rich.plain.content');

    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '40px' }}>
        <GuideGroup title='Standard' direction='column'>
          <Tooltip variant='standard' shape='balloon' size='sm' content={standardContent}>
            <Button color='primary' size='sm'>
              {t('tooltip.variants.standard.label')}
            </Button>
          </Tooltip>
        </GuideGroup>
        <GuideGroup title='Rich' direction='column'>
          <Tooltip variant='rich' shape='balloon' size='sm' content={richContent}>
            <Button color='secondary' size='sm'>
              {t('tooltip.variants.rich.label')}
            </Button>
          </Tooltip>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 콘텐츠의 양과 레이아웃 비중에 따른 크기 시스템입니다.
 * - sm: 최대 너비 260px로 제한되어 간결한 문장에 적합합니다.
 * - md: 최대 너비 320px로 제한되어 긴 설명이나 Rich 타입에 권장됩니다.
 */
export const Sizes: Story = {
  render: () => {
    const { t } = useTranslation();
    const standardPlain = {
      content: t('tooltip.sizes.standard.plain.content'),
      button: t('tooltip.sizes.standard.plain.button'),
    };
    const standardBalloon = {
      content: t('tooltip.sizes.standard.ballon.content'),
      button: t('tooltip.sizes.standard.ballon.button'),
    };
    const richPlain = {
      content: t('tooltip.sizes.rich.plain.content'),
      button: t('tooltip.sizes.rich.plain.button'),
    };
    const richBalloon = {
      content: t('tooltip.sizes.rich.ballon.content'),
      button: t('tooltip.sizes.rich.ballon.button'),
    };

    return (
      <GuideWrapper style={{ width: 'fit-content', margin: 'auto', gap: '50px' }}>
        <GuideGroup title='SM' direction='column'>
          <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto', width: '100%' }}>
            <Tooltip size='sm' shape='plain' content={standardPlain.content}>
              <Button type='button' variant='solid' size='sm'>
                {standardPlain.button}
              </Button>
            </Tooltip>
            <Tooltip size='sm' shape='balloon' content={standardBalloon.content}>
              <Button type='button' variant='outline' color='secondary' size='sm'>
                {standardBalloon.button}
              </Button>
            </Tooltip>
            <Tooltip size='sm' variant='rich' shape='balloon' content={richPlain.content}>
              <Button type='button' variant='solid' color='tertiary' size='sm'>
                {richPlain.button}
              </Button>
            </Tooltip>
            <Tooltip size='sm' variant='rich' shape='balloon' content={richBalloon.content}>
              <Button type='button' variant='outline' color='tertiary' size='sm'>
                {richBalloon.button}
              </Button>
            </Tooltip>
          </div>
        </GuideGroup>
        <GuideGroup title='MD' direction='column'>
          <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto', width: '100%' }}>
            <Tooltip size='md' shape='plain' content={standardPlain.content}>
              <Button type='button' variant='solid' size='md'>
                {standardPlain.button}
              </Button>
            </Tooltip>
            <Tooltip size='md' shape='balloon' content={standardBalloon.content}>
              <Button type='button' variant='outline' color='secondary' size='md'>
                {standardBalloon.button}
              </Button>
            </Tooltip>
            <Tooltip size='md' variant='rich' shape='balloon' content={richPlain.content}>
              <Button type='button' variant='solid' color='tertiary' size='md'>
                {richPlain.button}
              </Button>
            </Tooltip>
            <Tooltip size='md' variant='rich' shape='balloon' content={richBalloon.content}>
              <Button type='button' variant='outline' color='tertiary' size='md'>
                {richBalloon.button}
              </Button>
            </Tooltip>
          </div>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * preferredPosition 속성을 통해 표시될 방향의 우선순위를 설정합니다.
 * 실제 배치 시에는 뷰포트 여유 공간을 계산하여 요소가 화면 밖으로 나가지 않도록 보호합니다.
 */
export const Positions: Story = {
  args: {
    shape: 'balloon',
    size: 'md',
  },
  render: args => {
    const { t } = useTranslation();
    const top = {
      standard: {
        button: t('tooltip.positions.top.standard.button'),
        content: t('tooltip.positions.top.standard.content'),
      },
      rich: {
        button: t('tooltip.positions.top.rich.button'),
        content: t('tooltip.positions.top.rich.content'),
      },
    };
    const bottom = {
      standard: {
        button: t('tooltip.positions.bottom.standard.button'),
        content: t('tooltip.positions.bottom.standard.content'),
      },
      rich: {
        button: t('tooltip.positions.bottom.rich.button'),
        content: t('tooltip.positions.bottom.rich.content'),
      },
    };
    const left = {
      standard: {
        button: t('tooltip.positions.left.standard.button'),
        content: t('tooltip.positions.left.standard.content'),
      },
      rich: {
        button: t('tooltip.positions.left.rich.button'),
        content: t('tooltip.positions.left.rich.content'),
      },
    };
    const right = {
      standard: {
        button: t('tooltip.positions.right.standard.button'),
        content: t('tooltip.positions.right.standard.content'),
      },
      rich: {
        button: t('tooltip.positions.right.rich.button'),
        content: t('tooltip.positions.right.rich.content'),
      },
    };

    return (
      <div
        style={{
          width: 'fit-content',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '100px',
        }}
      >
        <GuideGroup title='Position: Top'>
          <GuideCell>
            <Tooltip {...args} preferredPosition='top' content={top.standard.content}>
              <Button size='sm'>{top.standard.button}</Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='top'
              variant='rich'
              size='sm'
              shape='balloon'
              content={top.rich.content}
            >
              <Button size='sm' variant='outline'>
                {top.rich.button}
              </Button>
            </Tooltip>
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Position: Bottom'>
          <GuideCell>
            <Tooltip {...args} preferredPosition='bottom' content={bottom.standard.content}>
              <Button size='sm'>{bottom.standard.button}</Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='bottom'
              variant='rich'
              size='sm'
              shape='balloon'
              content={bottom.rich.content}
            >
              <Button size='sm' variant='outline'>
                {bottom.rich.button}
              </Button>
            </Tooltip>
          </GuideCell>
        </GuideGroup>
        <GuideGroup title='Position: Left'>
          <GuideCell>
            <Tooltip {...args} preferredPosition='left' content={left.standard.content}>
              <Button size='sm'>{left.standard.button}</Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='left'
              variant='rich'
              size='sm'
              shape='balloon'
              content={left.rich.content}
            >
              <Button size='sm' variant='outline'>
                {left.rich.button}
              </Button>
            </Tooltip>
          </GuideCell>
        </GuideGroup>

        <GuideGroup title='Position: Right'>
          <GuideCell>
            <Tooltip {...args} preferredPosition='right' content={right.standard.content}>
              <Button size='sm'>{right.standard.button}</Button>
            </Tooltip>
            <Tooltip
              {...args}
              preferredPosition='right'
              variant='rich'
              size='sm'
              shape='balloon'
              content={right.rich.content}
            >
              <Button size='sm' variant='outline'>
                {right.rich.button}
              </Button>
            </Tooltip>
          </GuideCell>
        </GuideGroup>
      </div>
    );
  },
};

/**
 * 상단 또는 하단 배치 시 본체의 수평 정렬 기준을 정의합니다.
 * 본체가 좌/우측으로 정렬(`start`, `end`)되더라도 말풍선 꼬리는 항상 트리거 요소의 중앙을 유지합니다.
 */
export const Alignment: Story = {
  args: {
    size: 'md',
  },
  render: args => {
    const { t } = useTranslation();
    const alignments: ('start' | 'center' | 'end')[] = ['start', 'center', 'end'];

    return (
      <div
        style={{
          width: 'fit-content',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '100px',
        }}
      >
        {alignments.map(align => {
          const topStandardButton = t(`tooltip.alignment.top.${align}.standard.button`);
          const topStandardContent = t(`tooltip.alignment.top.${align}.standard.content`);
          const topRichButton = t(`tooltip.alignment.top.${align}.rich.button`);
          const topRichContent = t(`tooltip.alignment.top.${align}.rich.content`);

          return (
            <GuideCell key={`top-${align}`} caption={`align: ${align}`}>
              <Tooltip
                {...args}
                preferredPosition='top'
                align={align}
                content={topStandardContent}
                shape='balloon'
              >
                <Button variant='solid' color='primary' size='sm' style={{ width: 'max-content' }}>
                  {topStandardButton}
                </Button>
              </Tooltip>
              <Tooltip
                {...args}
                preferredPosition='top'
                align={align}
                shape='balloon'
                variant='rich'
                size='sm'
                content={topRichContent}
              >
                <Button
                  variant='outline'
                  color='primary'
                  size='sm'
                  style={{ width: 'max-content' }}
                >
                  {topRichButton}
                </Button>
              </Tooltip>
            </GuideCell>
          );
        })}

        {alignments.map(align => {
          const bottomStandardButton = t(`tooltip.alignment.bottom.${align}.standard.button`);
          const bottomStandardContent = t(`tooltip.alignment.bottom.${align}.standard.content`);
          const bottomRichButton = t(`tooltip.alignment.bottom.${align}.rich.button`);
          const bottomRichContent = t(`tooltip.alignment.bottom.${align}.rich.content`);

          return (
            <GuideCell key={`bottom-${align}`} caption={`align: ${align}`}>
              <Tooltip
                {...args}
                preferredPosition='bottom'
                align={align}
                content={bottomStandardContent}
                shape='balloon'
              >
                <Button variant='solid' color='primary' size='sm' style={{ width: 'max-content' }}>
                  {bottomStandardButton}
                </Button>
              </Tooltip>
              <Tooltip
                {...args}
                preferredPosition='bottom'
                align={align}
                shape='balloon'
                variant='rich'
                size='sm'
                content={bottomRichContent}
              >
                <Button
                  variant='outline'
                  color='primary'
                  size='sm'
                  style={{ width: 'max-content' }}
                >
                  {bottomRichButton}
                </Button>
              </Tooltip>
            </GuideCell>
          );
        })}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    // 첫 번째(start)와 세 번째(end) 버튼에 호버하여 꼬리 위치가 양 끝으로 가는지 확인 유도
    if (buttons[0]) await userEvent.hover(buttons[0]);
  },
};

/**
 * 뷰포트 경계면에서의 방어 로직(Collision handling)을 검증합니다.
 * - Flip: 상하좌우 끝단에서 공간이 부족할 경우 즉시 반대 방향으로 전환됩니다.
 * - Constraint: 화면 밖으로 요소가 잘리지 않도록 뷰포트 내부에 가두는 처리가 적용됩니다.
 */
export const ViewportEdgeCases: Story = {
  parameters: {
    // 스토리북 기본 패딩 제거하여 화면 끝까지 붙게 함
    layout: 'fullscreen',
  },
  args: {
    shape: 'balloon',
  },
  render: args => {
    const { t } = useTranslation();
    const viewportCopy = {
      top: {
        start: {
          button: t('tooltip.viewport.top.start.standard.button'),
          content: t('tooltip.viewport.top.start.standard.content'),
        },
        center: {
          button: t('tooltip.viewport.top.center.standard.button'),
          content: t('tooltip.viewport.top.center.standard.content'),
        },
        end: {
          button: t('tooltip.viewport.top.end.standard.button'),
          content: t('tooltip.viewport.top.end.standard.content'),
        },
      },
      bottom: {
        start: {
          button: t('tooltip.viewport.bottom.start.standard.button'),
          content: t('tooltip.viewport.bottom.start.standard.content'),
        },
        center: {
          button: t('tooltip.viewport.bottom.center.standard.button'),
          content: t('tooltip.viewport.bottom.center.standard.content'),
        },
        end: {
          button: t('tooltip.viewport.bottom.end.standard.button'),
          content: t('tooltip.viewport.bottom.end.standard.content'),
        },
      },
      left: {
        button: t('tooltip.viewport.center.left.standard.button'),
        content: t('tooltip.viewport.center.left.standard.content'),
      },
      right: {
        button: t('tooltip.viewport.center.right.standard.button'),
        content: t('tooltip.viewport.center.right.standard.content'),
      },
    };

    return (
      <div
        style={{
          position: 'relative',
          height: '100vh', // 뷰포트 전체 높이
          width: '100vw', // 뷰포트 전체 너비
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px', // 실제 화면 끝에서 툴팁이 어떻게 반응하는지 볼 수 있는 최소 여백
          boxSizing: 'border-box',
        }}
      >
        {/* 상단 배치 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip
            {...args}
            content={viewportCopy.top.start.content}
            preferredPosition='top'
            align='start'
          >
            <Button size='sm'>{viewportCopy.top.start.button}</Button>
          </Tooltip>
          <Tooltip {...args} content={viewportCopy.top.center.content} preferredPosition='top'>
            <Button size='sm'>{viewportCopy.top.center.button}</Button>
          </Tooltip>
          <Tooltip
            {...args}
            content={viewportCopy.top.end.content}
            preferredPosition='top'
            align='end'
          >
            <Button size='sm'>{viewportCopy.top.end.button}</Button>
          </Tooltip>
        </div>

        {/* 중앙/좌우 배치 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip {...args} content={viewportCopy.left.content} preferredPosition='left'>
            <Button size='sm'>{viewportCopy.left.button}</Button>
          </Tooltip>
          <Tooltip {...args} content={viewportCopy.right.content} preferredPosition='right'>
            <Button size='sm'>{viewportCopy.right.button}</Button>
          </Tooltip>
        </div>

        {/* 하단 배치 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip
            {...args}
            content={viewportCopy.bottom.start.content}
            preferredPosition='bottom'
            align='start'
          >
            <Button size='sm'>{viewportCopy.bottom.start.button}</Button>
          </Tooltip>
          <Tooltip
            {...args}
            content={viewportCopy.bottom.center.content}
            preferredPosition='bottom'
          >
            <Button size='sm'>{viewportCopy.bottom.center.button}</Button>
          </Tooltip>
          <Tooltip
            {...args}
            content={viewportCopy.bottom.end.content}
            preferredPosition='bottom'
            align='end'
          >
            <Button size='sm'>{viewportCopy.bottom.end.button}</Button>
          </Tooltip>
        </div>
      </div>
    );
  },
};
