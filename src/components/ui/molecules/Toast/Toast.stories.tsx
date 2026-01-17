import type { Meta, StoryObj } from '@storybook/react-vite';
import Toast, { type ToastProps } from './Toast';
import { ToastProvider, useToast, type ToastPosition } from './ToastProvider';
import { within, userEvent, expect } from 'storybook/test';
import React, { useEffect } from 'react';
import Button from '../Button/Button';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import { useTranslation } from 'react-i18next';

const meta: Meta<typeof Toast> = {
  title: 'UI/Molecules/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Toast**는 사용자의 액션에 대한 결과나 시스템의 상태 변화를 피드백하기 위해 나타나는 일시적인 알림 요소입니다. <br /><br />' +
          '• **Contextual Feedback**: 성공, 에러, 정보, 경고 등 4가지 의미론적(Semantic) 테마를 제공합니다. <br />' +
          '• **Provider**: `ToastProvider`를 통해 화면 내 위치 조절 및 여러 토스트의 동시 노출 순서를 지능적으로 관리합니다. <br />' +
          '• **Interactive Actions**: 단순히 메시지만 보여주는 단계를 넘어, 링크 버튼(`link`)을 포함한 스낵바 형태로 확장 가능합니다.',
      },
    },
  },
  // ToastProvider를 데코레이터로 설정하여 모든 스토리에 기본 적용
  decorators: [
    Story => (
      <ToastProvider position='bottom-right'>
        <Story />
      </ToastProvider>
    ),
  ],
  argTypes: {
    // 식별자 (일반적으로 문서화에서 숨기거나 텍스트로 노출)
    id: {
      description: '토스트의 고유 식별자',
      control: 'text',
      table: {
        category: 'Data',
      },
    },
    // 메시지 본문
    message: {
      description: '사용자에게 노출될 메시지 텍스트',
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    // 토스트 타입 (이미 정의하신 부분 최적화)
    type: {
      description: '토스트의 성격에 따른 스타일 타입',
      control: { type: 'select' },
      options: ['success', 'error', 'info', 'warning'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'info' },
      },
    },
    // 노출 시간
    duration: {
      description: '토스트가 자동으로 닫히기까지의 시간 (ms)',
      control: { type: 'number', step: 1000 },
      table: {
        category: 'Behavior',
      },
    },
    // 노출 순서
    index: {
      description: '현재 화면에 표시된 토스트 중 순서',
      control: { type: 'number', min: 1 },
      table: {
        category: 'Data',
      },
    },
    // 링크 객체 (JSON 형태로 입력 가능)
    link: {
      description: '토스트 내부에 포함될 링크 버튼 정보',
      control: 'object',
      table: {
        category: 'Content',
      },
    },
    // 이벤트 핸들러
    onClose: {
      description: '토스트가 닫힐 때 실행되는 콜백 함수',
      action: 'closed',
      table: {
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/**
 * 토스트의 가장 표준적인 렌더링 상태를 확인합니다.
 * - **Checkpoint**: 메시지 길이와 인덱스에 따른 기본 레이아웃 및 닫기 버튼 동작을 점검합니다.
 */
export const Base: Story = {
  args: {
    index: 1,
    id: 'toast-1',
    type: 'info',
    message: '정보가 업데이트되었습니다.',
  },
  render: args => {
    const { t } = useTranslation();
    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content' }}>
        <Toast {...args} message={t('toast.info.default.label')} />
      </GuideWrapper>
    );
  },
};

/**
 * 모든 시각적 타입(Type)과 스낵바(Snackbar) 확장 형태를 한눈에 비교합니다.
 * - **Semantic Check**: 타입별 아이콘 및 테마 컬러가 의도한 의미(성공, 에러 등)를 명확히 전달하는지 점검합니다.
 * - **A11y**: 'error/warning' 타입이 스크린 리더에서 `alert` 역할을 적절히 수행하는지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const { t } = useTranslation();
    const states: ToastProps[] = [
      {
        index: 2,
        id: 'toast-2',
        type: 'info',
        message: t('toast.info.default.label'),
        onClose: () => {},
      },
      {
        index: 3,
        id: 'toast-3',
        type: 'info',
        message: t('toast.info.link.label'),
        link: {
          label: t('toast.info.link.btn'),
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 4,
        id: 'toast-4',
        type: 'success',
        message: t('toast.success.label'),
        onClose: () => {},
      },
      {
        index: 5,
        id: 'toast-5',
        type: 'success',
        message: t('toast.success.link.label'),
        link: {
          label: t('toast.success.link.btn'),
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 6,
        id: 'toast-6',
        type: 'warning',
        message: t('toast.warning.label'),
        onClose: () => {},
      },
      {
        index: 7,
        id: 'toast-7',
        type: 'warning',
        message: t('toast.warning.link.label'),
        link: {
          label: t('toast.warning.link.btn'),
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 8,
        id: 'toast-8',
        type: 'error',
        message: t('toast.error.label'),
        onClose: () => {},
      },
      {
        index: 9,
        id: 'toast-9',
        type: 'error',
        message: t('toast.error.link.label'),
        link: {
          label: t('toast.error.link.btn'),
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
    ];

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideGroup direction='row' title='Info'>
          <GuideRow direction='column'>
            {states.map(state => (
              <React.Fragment key={state.id}>
                {state.type === 'info' && (
                  <GuideCell caption={state.link ? 'Snackbar' : 'Toast'}>
                    <Toast {...state} />
                  </GuideCell>
                )}
              </React.Fragment>
            ))}
          </GuideRow>
        </GuideGroup>
        <GuideGroup direction='row' title='success'>
          <GuideRow direction='column'>
            {states.map(state => (
              <React.Fragment key={state.id}>
                {state.type === 'success' && (
                  <GuideCell caption={state.link ? 'Snackbar' : 'Toast'}>
                    <Toast {...state} />
                  </GuideCell>
                )}
              </React.Fragment>
            ))}
          </GuideRow>
        </GuideGroup>
        <GuideGroup direction='row' title='warning'>
          <GuideRow direction='column'>
            {states.map(state => (
              <React.Fragment key={state.id}>
                {state.type === 'warning' && (
                  <GuideCell caption={state.link ? 'Snackbar' : 'Toast'}>
                    <Toast {...state} />
                  </GuideCell>
                )}
              </React.Fragment>
            ))}
          </GuideRow>
        </GuideGroup>
        <GuideGroup direction='row' title='error'>
          <GuideRow direction='column'>
            {states.map(state => (
              <React.Fragment key={state.id}>
                {state.type === 'error' && (
                  <GuideCell caption={state.link ? 'Snackbar' : 'Toast'}>
                    <Toast {...state} />
                  </GuideCell>
                )}
              </React.Fragment>
            ))}
          </GuideRow>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * 화면의 6개 위치별 노출 및 3D 애니메이션 효과를 테스트합니다.
 * - **Animation**: 토스트가 나타나고 사라질 때 뒤로 젖혀지는 효과가 각 위치(Top/Bottom)에서 자연스러운지 확인합니다.
 * - **Responsive**: 모바일 환경(768px 미만)에서 설정된 위치와 관계없이 중앙 하단으로 강제 고정되는 대응 로직을 점검합니다.
 */
export const AllPositions: Story = {
  render: args => {
    const { t } = useTranslation();
    const InteractiveTester = () => {
      const [currentPos, setCurrentPos] = React.useState<ToastPosition>('bottom-center');

      return (
        <ToastProvider position={currentPos}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              'top-left',
              'top-center',
              'top-right',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ].map(pos => (
              <Button
                key={pos}
                onClick={() => {
                  setCurrentPos(pos as ToastPosition);
                }}
                variant={currentPos === pos ? 'solid' : 'outline'}
              >
                {pos}
              </Button>
            ))}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <ToastTriggerHelper message={t('toast.info.default.label')} type={args.type} />
          </div>
        </ToastProvider>
      );
    };

    return <InteractiveTester />;
  },
  args: {
    message: '위치 테스트 메시지입니다.',
    type: 'info',
  },
};

// 버튼 클릭 시 토스트를 띄워줄 헬퍼 컴포넌트
const ToastTriggerHelper = ({ message, type }: any) => {
  const { addToast } = useToast();
  return (
    <Button color='primary' onClick={() => addToast(message, type)}>
      현재 위치에 토스트 실행
    </Button>
  );
};
