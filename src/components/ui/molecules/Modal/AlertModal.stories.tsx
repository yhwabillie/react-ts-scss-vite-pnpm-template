/* Modal.stories.tsx */
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useContext, useId, useRef } from 'react';
import ModalProvider from './ModalProvider';
import { ModalContext } from '@/components/contexts/ModalContext';
import Button from '../Button/Button';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import Modal from './Modal';
import AlertModalContent, { type AlertModalContentProps } from './AlertModalContent';
import { fn } from '@storybook/test';
import { SpecimenGroup, SpecimenRow, SpecimenWrapper } from '../../guide/Specimen';

const meta: Meta = {
  title: 'UI/Organisms/Modal/AlertModal',
  tags: ['autodocs'],
  component: AlertModalContent,
  decorators: [
    Story => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
  argTypes: {
    id: {
      description:
        '고유 식별자, <strong style="color: #d32f2f;">중복 시 포커스 트래핑 접근성 에러 발생</strong>',
      control: 'text',
      table: {
        category: 'Identification',
        type: {
          summary: 'string',
        },
      },
    },
    firstFocusableRef: {
      description:
        '모달이 열릴 때 처음으로 포커싱될 요소의 `ref`입니다. **웹 접근성(Focus Trapping)을 위해 필수**로 설정해야 합니다.',
      table: {
        category: 'Technical',
        type: {
          summary: 'React.RefObject<HTMLElement>',
        },
        control: false,
      },
    },
    config: {
      description: '모달 설정 객체 전체',
      table: { category: 'Config' },
      control: false,
    },
    'config.variant': {
      name: '  └ variant',
      description: '모달 타입',
      table: { category: 'Config', type: { summary: 'ModalVariant' } },
      control: 'inline-radio',
      options: ['default', 'alert-info', 'alert-error'],
    },
    'config.title': {
      name: '  └ title',
      description: '모달 제목',
      table: {
        category: 'Config',
        type: {
          summary: 'string',
        },
      },
      control: 'text',
    },
    'config.subTitle': {
      name: '  └ subTitle',
      description: '모달 부 제목',
      table: {
        category: 'Config',
        type: {
          summary: 'string',
        },
      },
      control: 'text',
    },
    'config.description': {
      name: '  └ description',
      description: '모달 설명',
      table: {
        category: 'Config',
        type: {
          summary: 'string',
        },
      },
      control: 'text',
    },
    'config.content': {
      name: '  └ content',
      description: '모달 내부에 포함될 DOM 요소',
      table: { category: 'Config', type: { summary: 'React.ReactNode' } },
      control: 'text',
    },

    onClose: {
      description: '모달을 닫을 때 실행되는 콜백 함수입니다. (Overlay 클릭, ESC 키, 닫기 버튼)',
      table: {
        category: 'Events',
        type: { summary: '() => void' },
      },
      action: 'closed',
    },
  },

  args: {
    id: 'base-modal-id',
    firstFocusableRef: undefined,
    config: {
      variant: 'alert-info',
      title: '저장 완료',
      description: '설정 내용이 안전하게 저장되었습니다.',
      confirmText: '확인',
    },
    onClose: () => console.log('close'),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * [Story Case] AlertModalContent 기본 구성 (Base)
 * * 💡 시나리오:
 * - 컴포넌트의 가장 전형적인 두 가지 형태(단순 정보 전달 및 사용자 확인)를 가이드함.
 * - 'Information' 케이스: 단일 확인 버튼으로 사용자의 인지만 확인.
 * - 'Confirmation' 케이스: 취소/확인 버튼을 통해 사용자의 명시적 의사결정을 유도.
 * * 🎯 가이드 포인트:
 * 1. 텍스트 레이아웃: 긴 문장의 description이 포함될 때 모달의 너비와 텍스트 정렬이 깨지지 않는지 확인.
 * 2. 버튼 그룹: 버튼이 1개일 때와 2개일 때의 정렬(우측 정렬) 및 간격이 일관적인지 확인.
 */
export const Base: Story = {
  args: {
    config: {
      title: '알림',
      description: '작업이 성공적으로 완료되었습니다.',
      confirmText: '확인',
    },
  },
  render: args => {
    const props = args as AlertModalContentProps;

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideGroup direction='row'>
          <GuideRow direction='column'>
            <GuideCell caption='Information'>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-info',
                  title: '복사 완료',
                  description:
                    '링크가 클립보드에 복사되었습니다. 이제 원하는 곳에 붙여넣기 할 수 있습니다.',
                }}
              />
            </GuideCell>
          </GuideRow>
          <GuideRow direction='column'>
            <GuideCell caption='Confirmation'>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-info',
                  title: '변경 사항 저장',
                  description: '수정하신 내용을 저장하시겠습니까? 저장 후에는 즉시 반영됩니다.',
                  confirmText: '저장',
                  cancelText: '취소',
                }}
              />
            </GuideCell>
          </GuideRow>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * [Story Case] AlertModalContent 디자인 베리에이션 가이드
 * * 💡 시나리오:
 * - UI 가이드 문서(Storybook)에서 다양한 변형(Variant)을 한눈에 확인하기 위한 용도.
 * - 실제 모달 시스템(Portal) 없이 컨텐츠 컴포넌트의 레이아웃만 단독으로 렌더링함.
 * * 🎯 가이드 포인트:
 * 1. alert-info: 일반적인 정보성 알림 및 긍정적인 액션(저장 등)에 사용.
 * 2. alert-danger: 경고, 권한 거절, 파괴적 액션(삭제 등)에 사용되어 시각적 주의를 환기함.
 * 3. [중요] 해당 가이드에서는 포커스 이동 로직(firstFocusableRef)이 시각적으로만 존재하며,
 * 실제 동작은 ModalProvider와 연동될 때 활성화됨.
 */
export const Variant: Story = {
  args: {
    config: {
      title: '알림',
      description: '작업이 성공적으로 완료되었습니다.',
      confirmText: '확인',
    },
  },
  render: args => {
    const props = args as AlertModalContentProps;

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideGroup direction='row' title='alert-info'>
          <GuideRow direction='column'>
            <GuideCell>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-info',
                  title: '복사 완료',
                  description:
                    '링크가 클립보드에 복사되었습니다. 이제 원하는 곳에 붙여넣기 할 수 있습니다.',
                }}
              />
            </GuideCell>
          </GuideRow>
          <GuideRow direction='column'>
            <GuideCell>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-info',
                  title: '저장 확인',
                  description:
                    '수정하신 내용을 저장하시겠습니까? 저장 후에는 즉시 목록으로 이동합니다.',
                  confirmText: '저장',
                  cancelText: '취소',
                }}
              />
            </GuideCell>
          </GuideRow>
        </GuideGroup>
        <GuideGroup direction='row' title='alert-danger'>
          <GuideRow direction='column'>
            <GuideCell>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-danger',
                  title: '접근 권한 없음',
                  description:
                    '해당 메뉴에 접근할 수 있는 권한이 없습니다. 관리자에게 승인을 요청하세요.',
                }}
              />
            </GuideCell>
          </GuideRow>
          <GuideRow direction='column'>
            <GuideCell>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-danger',
                  title: '영구 삭제 확인',
                  description:
                    '데이터를 삭제하시겠습니까? 삭제된 정보는 시스템에서 즉시 제거되며 복구할 수 없습니다.',
                  confirmText: '삭제',
                  cancelText: '취소',
                }}
              />
            </GuideCell>
          </GuideRow>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * [Test Case] 연쇄 모달 흐름 (Sequential Modal Flow)
 * * 💡 시나리오:
 * 1. 사용자가 '연쇄 모달 실행' 버튼 클릭 -> [삭제 확인] 모달 오픈
 * 2. [삭제 확인]에서 '확인' 클릭 -> [삭제 확인] 닫힘과 동시에 [삭제 완료] 오픈
 * 3. [삭제 완료]에서 '확인' 클릭 -> 모든 모달 닫힘
 * * 🎯 기대 결과:
 * - 모달이 교체되는 찰나(Sequential)에 배경이 번쩍이거나 포커스가 바닥으로 튕기지 않아야 함.
 * - 모든 모달이 종료된 후, 포커스는 정확히 '연쇄 모달 실행' 버튼으로 복귀해야 함.
 */
export const SequenceAndStackTest: StoryObj = {
  render: () => {
    const { openModal, closeModal } = useContext(ModalContext);

    // ✅ 사용자가 공유한 연쇄 흐름 (Sequential Flow)
    const handleSequenceFlow = () => {
      openModal('alert-info', {
        title: '삭제 확인',
        description: '삭제하면 복구할 수 없습니다. 삭제하시겠습니까?', // TS 에러 방지를 위해 message로 통일 제안
        cancelText: '취소',
        onConfirm: (currentId?: string) => {
          // 1. 현재 모달 닫기
          closeModal(currentId || 'alert-info');

          // 2. 큐에 쌓인 상태 처리를 위해 지연 후 다음 모달 오픈
          setTimeout(() => {
            openModal('alert-info', {
              title: '삭제 완료',
              description: '정상적으로 삭제되었습니다.',
              confirmText: '확인',
            });
          }, 0);
        },
      });
    };

    return (
      <GuideWrapper style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button variant='solid' color='secondary' onClick={handleSequenceFlow}>
          연쇄 모달 실행 (삭제 흐름)
        </Button>
        <Button
          variant='outline'
          color='secondary'
          onClick={() =>
            openModal('alert-info', { title: '단순 알림', description: '단일 모달입니다.' })
          }
        >
          단일 모달 실행
        </Button>
      </GuideWrapper>
    );
  },
};
