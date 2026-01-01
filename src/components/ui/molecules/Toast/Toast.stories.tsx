import type { Meta, StoryObj } from '@storybook/react-vite';
import Toast, { type ToastProps } from './Toast';
import { ToastProvider, useToast, type ToastPosition } from './ToastProvider';
import { within, userEvent, expect } from '@storybook/test';
import React, { useEffect } from 'react';
import Button from '../Button/Button';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof Toast> = {
  title: 'UI/Molecules/Toast',
  component: Toast,
  tags: ['autodocs'],
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

export const Base: Story = {
  args: {
    index: 1,
    id: 'toast-1',
    type: 'info',
    message: '정보가 업데이트되었습니다.',
  },
  render: args => {
    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content' }}>
        <Toast {...args} />
      </GuideWrapper>
    );
  },
};

/**
 * Toast 컴포넌트의 모든 시각적 상태(Type)와 구성 요소(Snackbar 형태 포함)를 한 화면에서 조망합니다.
 * 1. 타입별 컬러 시스템: 성공(Green), 에러(Red), 경고(Amber), 정보(Blue/White)의 아이콘 컬러와 배경 대비가 적절한지 확인합니다.
 * 2. 레이아웃 차이: 링크 버튼이 없는 일반 'Toast'와 링크 버튼이 포함된 'Snackbar' 형태의 너비 변화와 정렬을 비교합니다.
 * 3. 텍스트 가독성: 다크 모드 배경(rgba 25, 25, 25) 위에서 텍스트와 링크 버튼의 가독성을 점검합니다.
 * * * 접근성(A11y) 메모:
 * - 'Partially Obscured' 리마인드: 여러 토스트가 세로로 나열될 때, 개별 토스트가 너무 크면 화면의 상당 부분을 점유합니다.
 * 이로 인해 배경의 중요한 인터랙션 요소(예: title 속성이 있는 툴팁 트리거 등)가 가려지지 않는지 확인이 필요합니다.
 * - Role: 'error'와 'warning' 타입은 스크린 리더에서 'alert' 역할을 수행하여 즉각 공지되는지 확인합니다.
 */
export const States: Story = {
  render: args => {
    const states: ToastProps[] = [
      {
        index: 2,
        id: 'toast-2',
        type: 'info',
        message: '작성 중인 내용은 자동으로 저장됩니다.',
        onClose: () => {},
      },
      {
        index: 3,
        id: 'toast-3',
        type: 'info',
        message: '작성하신 글에 새로운 댓글이 달렸습니다.',
        link: {
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 4,
        id: 'toast-4',
        type: 'success',
        message: '변경사항이 성공적으로 저장되었습니다.',
        onClose: () => {},
      },
      {
        index: 5,
        id: 'toast-5',
        type: 'success',
        message: '송금이 완료되었습니다. 내역을 확인해보세요.',
        link: {
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 6,
        id: 'toast-6',
        type: 'warning',
        message: '현재 위치에서는 서비스 이용이 제한될 수 있습니다',
        onClose: () => {},
      },
      {
        index: 7,
        id: 'toast-7',
        type: 'warning',
        message: '보안 등급이 낮습니다. 2단계 인증을 설정할까요?',
        link: {
          url: 'https://www.naver.com/',
          external: true,
        },
        onClose: () => {},
      },
      {
        index: 8,
        id: 'toast-8',
        type: 'error',
        message: '네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
        onClose: () => {},
      },
      {
        index: 9,
        id: 'toast-9',
        type: 'error',
        message: '인증 세션이 만료되었습니다. 다시 로그인해 주세요.',
        link: {
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
 * 토스트가 화면의 각 방향(6개 위치)에서 나타나고 사라지는 동작을 테스트합니다.
 * 1. 위치 전환: 버튼 클릭 시 `ToastProvider`의 `position` 상태가 변경되며 컨테이너가 즉시 이동합니다.
 * 2. 3D 애니메이션: 사다리꼴(Trapezoid) 모양으로 뒤로 젖혀지며 사라지는 효과가 각 위치에서 자연스러운지 확인합니다.
 * 3. 레이아웃 흐름: 토스트가 사라질 때 뒤쪽 토스트들이 뚝 끊기지 않고 부드럽게 위치를 잡는지 점검합니다.
 * * 접근성(A11y) 점검 사항:
 * - Partially Obscured: 토스트가 나타나거나 사라지는 과정에서 뒤쪽 버튼(특히 title 속성이 있는 요소)을
 * 오랫동안 가리지 않는지 확인하세요. (현재 0.5s 애니메이션 설정)
 * - 모바일 대응: Viewport를 768px 미만으로 줄였을 때, 설정된 위치와 상관없이
 * 'bottom-center'로 강제 고정되는지 확인이 필요합니다.
 */
export const AllPositions: Story = {
  render: args => {
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
            <ToastTriggerHelper message={args.message} type={args.type} />
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
