/* Modal.stories.tsx */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext } from 'react';
import ModalProvider from './ModalProvider';
import { ModalContext } from '@/components/contexts/ModalContext';
import Button from '../Button/Button';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import AlertModalContent, { type AlertModalContentProps } from './AlertModalContent';
import { useTranslation } from 'react-i18next';

const meta: Meta = {
  title: 'UI/Organisms/Modal/AlertModal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**AlertModal**은 중요한 정보 전달이나 사용자의 최종 의사 결정이 필요할 때 사용하는 고대비 대화 상자입니다. <br /><br />' +
          '• **Focus Management**: 모달 오픈 시 내부 컨텐츠로 포커스를 강제 이동시켜 키보드 사용자가 배경 요소와 상호작용하는 것을 방지합니다. <br />' +
          '• **Contextual Variants**: 정보성 안내(`info`)와 파괴적 액션 경고(`danger`)를 구분하여 심리적 주의를 환기합니다. <br />' +
          '• **Sequential Flow Support**: 연쇄적인 모달 노출 시에도 포커스 튕김 현상 없이 안정적인 전환을 보장합니다.',
      },
    },
  },
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
 * 알림 모달 컨텐츠의 가장 표준적인 렌더링 형태를 확인합니다.
 * - **Identity**: 고유 ID 중복 시 접근성 에러가 발생하므로 각 인스턴스의 식별자 관리가 중요합니다.
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
    const { t } = useTranslation();

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'min-content', gap: '80px' }}>
        <AlertModalContent
          {...props}
          config={{
            ...props.config,
            variant: 'alert-info',
            title: t('modal.alert.base.title'),
            description: t('modal.alert.base.description'),
            confirmText: t('modal.alert.base.footer.confirm'),
          }}
        />
      </GuideWrapper>
    );
  },
};

/**
 * 목적에 따른 두 가지 핵심 UX 패턴을 정의하고 비교합니다.
 * - **Information (Alert)**: 단일 버튼을 통해 사용자의 인지를 확인합니다. (예: 작업 완료)
 * - **Confirmation (Confirm)**: 두 개의 버튼(확인/취소)을 통해 사용자의 최종 결정을 유도합니다.
 */
export const InteractionPattern: Story = {
  args: {
    config: {
      title: '알림',
      description: '작업이 성공적으로 완료되었습니다.',
      confirmText: '확인',
    },
  },
  render: args => {
    const props = args as AlertModalContentProps;
    const { t } = useTranslation();

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'min-content', gap: '80px' }}>
        <GuideGroup direction='row'>
          <GuideRow direction='column'>
            <GuideCell caption='Information'>
              <AlertModalContent
                {...props}
                config={{
                  ...props.config,
                  variant: 'alert-info',
                  title: t('modal.alert.interaction.information.title'),
                  description: t('modal.alert.interaction.information.description'),
                  confirmText: t('modal.alert.interaction.information.footer.confirm'),
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
                  title: t('modal.alert.interaction.confirmation.title'),
                  description: t('modal.alert.interaction.confirmation.description'),
                  confirmText: t('modal.alert.interaction.confirmation.footer.confirm'),
                  cancelText: t('modal.alert.interaction.confirmation.footer.cancel'),
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
 * 시각적 위험도에 따른 베리에이션 가이드입니다.
 * - **alert-info**: 긍정적 알림이나 일반적인 안내 사항에 사용합니다.
 * - **alert-danger**: 데이터 삭제, 권한 거절 등 주의가 필요한 파괴적 액션 시 시각적 경고를 전달합니다.
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
    const { t } = useTranslation();

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
                  title: t('modal.alert.variants.info.interaction.information.title'),
                  description: t('modal.alert.variants.info.interaction.information.description'),
                  confirmText: t(
                    'modal.alert.variants.info.interaction.information.footer.confirm',
                  ),
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
                  title: t('modal.alert.variants.info.interaction.confirmation.title'),
                  description: t('modal.alert.variants.info.interaction.confirmation.description'),
                  confirmText: t('modal.alert.variants.info.interaction.confirmation.footer.save'),
                  cancelText: t('modal.alert.variants.info.interaction.confirmation.footer.cancel'),
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
                  title: t('modal.alert.variants.danger.interaction.information.title'),
                  description: t('modal.alert.variants.danger.interaction.information.description'),
                  confirmText: t(
                    'modal.alert.variants.danger.interaction.information.footer.confirm',
                  ),
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
                  title: t('modal.alert.variants.danger.interaction.confirmation.title'),
                  description: t(
                    'modal.alert.variants.danger.interaction.confirmation.description',
                  ),
                  confirmText: t(
                    'modal.alert.variants.danger.interaction.confirmation.footer.delete',
                  ),
                  cancelText: t(
                    'modal.alert.variants.danger.interaction.confirmation.footer.cancel',
                  ),
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
 * 실제 `ModalContext`와 연동된 연쇄 모달(Sequential Flow)의 안정성을 테스트합니다.
 * - **Scenario**: 삭제 확인 -> 삭제 완료로 이어지는 연속적인 모달 전환 흐름을 검증합니다.
 * - **Expectation**: 전환 시 배경 깜빡임이 없어야 하며, 모든 프로세스 종료 후 포커스가 최초 실행 버튼으로 정확히 복귀하는지 확인합니다.
 */
export const SequenceAndStackTest: StoryObj = {
  render: () => {
    const { openModal, closeModal } = useContext(ModalContext);
    const { t } = useTranslation();

    // ✅ 사용자가 공유한 연쇄 흐름 (Sequential Flow)
    const handleSequenceFlow = () => {
      openModal('alert-info', {
        title: t('modal.alert.test.sequential.parent.title'),
        description: t('modal.alert.test.sequential.parent.description'),
        cancelText: t('modal.alert.test.sequential.parent.footer.cancel'),
        confirmText: t('modal.alert.test.sequential.parent.footer.confirm'),
        onConfirm: (currentId?: string) => {
          // 1. 현재 모달 닫기
          closeModal(currentId || 'alert-info');

          // 2. 큐에 쌓인 상태 처리를 위해 지연 후 다음 모달 오픈
          setTimeout(() => {
            openModal('alert-info', {
              title: t('modal.alert.test.sequential.child.title'),
              description: t('modal.alert.test.sequential.child.description'),
              confirmText: t('modal.alert.test.sequential.child.footer.confirm'),
            });
          }, 0);
        },
      });
    };

    return (
      <GuideWrapper style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button variant='solid' color='secondary' onClick={handleSequenceFlow}>
          {t('modal.alert.test.sequential.parent.title')}
        </Button>
        <Button
          variant='outline'
          color='secondary'
          onClick={() =>
            openModal('alert-info', {
              title: t('modal.alert.test.default.title'),
              description: t('modal.alert.test.default.description'),
              confirmText: t('modal.alert.test.default.footer.confirm'),
            })
          }
        >
          {t('modal.alert.test.default.title')}
        </Button>
      </GuideWrapper>
    );
  },
};
