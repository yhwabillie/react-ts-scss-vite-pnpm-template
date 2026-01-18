/* Modal.stories.tsx */
import type { Meta, StoryObj } from '@storybook/react-vite';
import ModalProvider from './ModalProvider';
import { GuideCell, GuideGroup, GuideRow, GuideWrapper } from '../../guide/Guide';
import AlertModalContent, { type AlertModalContentProps } from './AlertModalContent';
import CustomModalContent, { type CustomModalContentProps } from './CustomModalContent';
import AnatomyWrapper from '../../guide/AnatomyWrapper';
import { useContext } from 'react';
import { ModalContext } from '@/components/contexts/ModalContext';
import Button from '../Button/Button';
import { useTranslation } from 'react-i18next';

const meta: Meta = {
  title: 'UI/Organisms/Modal/CustomModal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**CustomModal**은 기본적인 알림을 넘어 복잡한 레이아웃이나 인터랙티브한 콘텐츠를 담기 위한 범용 모달 컨테이너입니다. <br /><br />' +
          '• **Size Versatility**: 콘텐츠의 양에 따라 SM(400px)부터 LG(800px)까지 유연한 너비 설정을 지원합니다. <br />' +
          '• **Dual Scroll Strategy**: 페이지 전체의 흐름을 따르는 `outer` 스크롤과, 헤더/푸터를 고정하는 `inner` 스크롤 방식을 선택할 수 있습니다. <br />',
      },
    },
  },
  component: CustomModalContent,
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
    size: {
      table: {
        category: 'Style',
        control: 'inline-radio',
        options: ['sm', 'md', 'lg'],
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
    children: {
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
      options: ['custom', 'alert-info', 'alert-error'],
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
    id: 'custom-modal-id',
    firstFocusableRef: undefined,
    size: 'md',
    config: {
      variant: 'custom',
      title: '타이틀',
      description: '내용',
      showCloseButton: true,
    },
    onClose: () => console.log('close'),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 커스텀 모달의 가장 표준적인 렌더링 상태를 확인합니다.
 * - **Identity**: 중복 ID 사용 시 포커스 트래핑 에러가 발생하므로 식별자 관리에 유의합니다.
 */
export const Base: Story = {
  render: args => {
    const props = args as CustomModalContentProps;
    const { t } = useTranslation();

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideGroup direction='row'>
          <GuideRow direction='column'>
            <GuideCell>
              <CustomModalContent
                {...props}
                config={{
                  ...props.config,
                  title: t('modal.custom.base.title'),
                  description: t('modal.custom.base.content'),
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
 * 버튼 구성에 따른 사용자의 결정 단계를 정의합니다.
 * - **Information**: 단일 버튼을 통한 명시적 동의 확인.
 * - **Confirmation**: 확인/취소 버튼을 제공하여 최종 결정 및 철회 기회 제공.
 * - **Check**: 버튼 개수와 무관하게 모달 내부에서만 포커스가 순환(Trap)되는지 검증합니다.
 */
export const InteractionPattern: Story = {
  args: {
    size: 'md',
  },
  render: args => {
    const props = args as CustomModalContentProps;
    const { t } = useTranslation();

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideRow direction='column'>
          <GuideCell caption='Information'>
            <CustomModalContent
              {...props}
              config={{
                ...props.config,
                variant: 'custom',
                title: t('modal.custom.interation.information.title'),
                confirmText: t('modal.custom.interation.information.footer.confirm'),
                description: t('modal.custom.interation.information.content'),
                showCloseButton: false,
              }}
            />
          </GuideCell>
        </GuideRow>
        <GuideRow direction='column'>
          <GuideCell caption='Confirmation'>
            <CustomModalContent
              {...props}
              config={{
                ...props.config,
                variant: 'custom',
                title: t('modal.custom.interation.confirmation.title'),
                description: t('modal.custom.interation.confirmation.content'),
                confirmText: t('modal.custom.interation.confirmation.footer.confirm'),
                cancelText: t('modal.custom.interation.confirmation.footer.cancel'),
                showCloseButton: false,
              }}
            />
          </GuideCell>
        </GuideRow>
      </GuideWrapper>
    );
  },
};

/**
 * 콘텐츠 중요도에 따른 3단계 너비(SM, MD, LG) 변형입니다.
 * - **UX**: SM은 짧은 확인, MD는 일반 폼, LG는 데이터 그리드 등에 최적화되어 있습니다.
 * - **Response**: 화면 폭이 좁아질 때(Mobile) `width: 90%` 수준의 유연한 반응형 동작을 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const props = args as CustomModalContentProps;
    const { t } = useTranslation();
    const sizeOptions: Array<'lg' | 'md' | 'sm'> = ['lg', 'md', 'sm'];

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideRow direction='column'>
          {sizeOptions.map((size, idx) => (
            <GuideCell caption={size.toUpperCase()} key={idx}>
              <CustomModalContent
                {...props}
                size={size}
                config={{
                  ...props.config,
                  variant: 'custom',
                  title: t('modal.custom.sizes.title'),
                  confirmText: t('modal.custom.sizes.footer.confirm'),
                  cancelText: t('modal.custom.sizes.footer.cancel'),
                  description: t('modal.custom.sizes.content'),
                  showCloseButton: true,
                }}
              />
            </GuideCell>
          ))}
        </GuideRow>
      </GuideWrapper>
    );
  },
};

/**
 * 콘텐츠가 뷰포트 높이를 초과할 때의 스크롤 거동을 테스트합니다.
 * - **Outer**: 전체 문서 스크롤. 헤더/푸터가 콘텐츠와 함께 이동합니다.
 * - **Inner**: 헤더/푸터 고정 및 내부 바디만 스크롤. 복잡한 폼 작업 시 유리합니다.
 */
export const ScrollType: StoryObj = {
  render: () => {
    const { openModal } = useContext(ModalContext);
    const { t } = useTranslation();

    return (
      <GuideWrapper style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          variant='solid'
          color='secondary'
          onClick={() =>
            openModal('custom', {
              scrollType: 'outer',
              title: t('modal.custom.scroll-type.outer.title'),
              children: (
                <div style={{ width: '100%', height: '3000px', backgroundColor: '#dddd' }}>
                  {t('modal.custom.scroll-type.outer.content')}
                </div>
              ),
            })
          }
        >
          Modal Body 외부 스크롤
        </Button>
        <Button
          variant='outline'
          color='secondary'
          onClick={() =>
            openModal('custom', {
              scrollType: 'inner',
              title: t('modal.custom.scroll-type.inner.title'),
              children: (
                <div style={{ width: '100%', height: '3000px', backgroundColor: '#dddd' }}>
                  {t('modal.custom.scroll-type.inner.content')}
                </div>
              ),
            })
          }
        >
          Modal Body 내부 스크롤
        </Button>
      </GuideWrapper>
    );
  },
};

/**
 * 삭제 프로세스와 같은 연쇄적인 모달 흐름의 안정성을 검증합니다.
 * - **Focus Logic**: 모달 교체 시 포커스가 바닥 버튼으로 잠시 유출되어 `title` 툴팁이 튀어나오는 '번쩍임' 현상을 방지해야 합니다.
 * - **Transition**: `setTimeout`을 통한 연속 호출 시에도 스크린 리더가 흐름을 놓치지 않는지 확인합니다.
 */
export const SequenceAndStackTest: StoryObj = {
  render: () => {
    const { openModal, closeModal } = useContext(ModalContext);
    const { t } = useTranslation();

    // ✅ 사용자가 공유한 연쇄 흐름 (Sequential Flow)
    const handleSequenceFlow = () => {
      openModal('custom', {
        title: t('modal.custom.test.sequential.parent.title'),
        description: t('modal.custom.test.sequential.parent.description'),
        cancelText: t('modal.custom.test.sequential.parent.footer.cancel'),
        onConfirm: (currentId?: string) => {
          // 1. 현재 모달 닫기
          closeModal(currentId || 'custom');

          // 2. 큐에 쌓인 상태 처리를 위해 지연 후 다음 모달 오픈
          setTimeout(() => {
            openModal('custom', {
              title: t('modal.custom.test.sequential.child.title'),
              description: t('modal.custom.test.sequential.child.description'),
              confirmText: t('modal.custom.test.sequential.child.footer.confirm'),
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
            openModal('custom', {
              title: t('modal.custom.test.default.title'),
              description: t('modal.custom.test.default.description'),
              confirmText: t('modal.custom.test.default.footer.confirm'),
            })
          }
        >
          단일 모달 실행
        </Button>
      </GuideWrapper>
    );
  },
};
