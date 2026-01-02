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

const meta: Meta = {
  title: 'UI/Organisms/Modal/CustomModal',
  tags: ['autodocs'],
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

export const Base: Story = {
  render: args => {
    const props = args as CustomModalContentProps;

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideGroup direction='row'>
          <GuideRow direction='column'>
            <GuideCell>
              <CustomModalContent {...props} />
            </GuideCell>
          </GuideRow>
        </GuideGroup>
      </GuideWrapper>
    );
  },
};

/**
 * [Story Case] Interaction Pattern (Information vs Confirmation)
 * * 💡 시나리오:
 * - 모달의 버튼 구성에 따른 사용자의 심리적 흐름을 정의합니다.
 * * 1. Information Pattern:
 * - 단순 인지 및 확인이 목적입니다. '확인' 버튼 하나만 제공하여 명시적 동의를 구합니다.
 * * 2. Confirmation Pattern:
 * - 실행 전 단계에서 사용자의 최종 결정을 요구합니다. '확인/취소' 버튼을 통해
 * 부정적인 피드백(취소)의 기회를 명확히 제공합니다.
 * * 🎯 테스트 포인트:
 * - [포커스 트랩]: 버튼이 1개일 때와 2개일 때 모두 모달 내부에서 탭 키가 순환되는지 확인합니다.
 * - [title 속성]: 버튼 개수에 상관없이 배경 버튼의 'title' 속성 툴팁이 튀어나오지 않도록
 * ModalProvider가 포커스를 완벽히 선점하고 있는지 검증합니다.
 */
export const InteractionPattern: Story = {
  args: {
    size: 'md',
  },
  render: args => {
    const props = args as CustomModalContentProps;

    return (
      <GuideWrapper style={{ margin: 'auto', width: 'fit-content', gap: '80px' }}>
        <GuideRow direction='column'>
          <GuideCell caption='Information'>
            <CustomModalContent
              {...props}
              config={{
                ...props.config,
                variant: 'custom',
                title: '복사 완료',
                confirmText: '저장',
                description:
                  '링크가 클립보드에 복사되었습니다. 이제 원하는 곳에 붙여넣기 할 수 있습니다.',
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
                title: '변경 사항 저장',
                description: '수정하신 내용을 저장하시겠습니까? 저장 후에는 즉시 반영됩니다.',
                confirmText: '저장',
                cancelText: '취소',
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
 * [Story Case] Modal Size Variations (SM, MD, LG)
 * * 💡 시나리오:
 * - 콘텐츠의 양과 중요도에 따라 모달의 너비를 최적화합니다.
 * * 1. SM (Small): 400px 권장. 단순 확인창이나 삭제 재확인 등 짧은 메시지에 적합합니다.
 * * 2. MD (Medium): 600px 권장. 일반적인 폼 입력이나 상세 정보 조회에 최적화된 너비입니다.
 * * 3. LG (Large): 800px 권장. 데이터 테이블이나 복잡한 대시보드 콘텐츠를 담기에 적합합니다.
 * * 🎯 테스트 포인트:
 * - [반응형]: 브라우저 너비가 모달 설정값보다 작아질 때(모바일), `width: 90%` 등으로 유연하게 축소되는지 확인합니다.
 * - [Partially Obscured]: 모노톤 라이트 모드에서 LG 사이즈 모달이 화면 대부분을 가릴 때,
 * 활성 레이어임을 인지할 수 있도록 배경(Dimmed)과의 명암 대비와 그림자 처리를 확인합니다.
 */
export const Sizes: Story = {
  render: args => {
    const props = args as CustomModalContentProps;
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
                  title: '복사 완료',
                  confirmText: '저장',
                  cancelText: '취소',
                  description:
                    '링크가 클립보드에 복사되었습니다. 이제 원하는 곳에 붙여넣기 할 수 있습니다.',
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
 * [Test Case] 모달 스크롤 타입 (Outer vs Inner)
 * * 💡 시나리오:
 * - 콘텐츠가 뷰포트 높이(3000px)보다 길 때 모달의 스크롤 거동을 테스트합니다.
 * * 1. Outer Scroll (전체 스크롤):
 * - 모달 컨텐츠 전체가 하나의 긴 문서처럼 동작하며, 브라우저 자체 스크롤바를 사용합니다.
 * - 모달의 Header와 Footer가 콘텐츠와 함께 위로 올라갑니다.
 * * 2. Inner Scroll (내부 스크롤):
 * - 모달의 높이를 브라우저 높이에 고정(예: max-height: 90vh)하고 내부 body만 스크롤합니다.
 * - Header와 Footer가 화면에 고정되어야 할 때 유용합니다.
 * * 🎯 테스트 포인트:
 * - [포커스 관리]: 스크롤이 길어지더라도 `firstFocusableRef`가 최상단에 정확히 위치하여
 * 모달 오픈 시 사용자가 컨텐츠의 시작점을 즉시 인지하는지 확인합니다.
 * - [title 속성 충돌]: 외부 스크롤 시, 모달 밖 배경 영역이 노출될 때 마우스 위치에 따라
 * 배경 요소의 'title' 속성 툴팁이 활성 모달 위로 튀어나오지 않는지 체크합니다.
 * - [Partially Obscured]: 모노톤 라이트 모드에서 내부 스크롤 시, 콘텐츠가 위아래로
 * 가려지는 경계선(Header/Footer)이 시각적으로 명확히 구분되는지 확인합니다.
 */
export const ScrollType: StoryObj = {
  render: () => {
    const { openModal } = useContext(ModalContext);

    return (
      <GuideWrapper style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button
          variant='solid'
          color='secondary'
          onClick={() =>
            openModal('custom', {
              scrollType: 'outer',
              title: '단순 알림',
              children: (
                <div style={{ width: '100%', height: '3000px', backgroundColor: '#dddd' }}>
                  길게 스크롤할 수 있는 모달입니다.
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
              title: '단순 알림',
              children: (
                <div style={{ width: '100%', height: '3000px', backgroundColor: '#dddd' }}>
                  브라우저 높이에 맞춰 내부 스크롤할 수 있는 모달입니다.
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
 * [Test Case] 연쇄 모달 흐름 (Sequential Modal Flow)
 * * 💡 시나리오:
 * 1. [삭제 확인] 모달 오픈 -> '확인' 클릭
 * 2. 현재 모달이 닫힘과 동시에 `setTimeout(..., 0)`으로 [삭제 완료] 모달 오픈
 * 3. [삭제 완료] 모달 종료 후 최종적으로 처음 클릭했던 버튼으로 포커스 복귀 확인
 * * 🎯 테스트 포인트:
 * - [포커스 경합]: closeModal 호출 시 Provider의 포커스 복귀 타이머(100ms)가 시작됨.
 * 이때 0ms 지연으로 새 모달이 뜨면, Provider는 '연쇄 흐름'임을 인지하고
 * 바닥 버튼으로 포커스를 뺏어가지 않아야 함 (번쩍임 방지).
 * - [접근성]: 모달 교체 시 스크린 리더가 "닫힘"과 "열림"을 연속해서 매끄럽게 인지하는지 확인.
 * - [title 속성 방어]: 포커스가 아주 잠깐이라도 바닥 버튼으로 유출되면, 마우스 커서 위치에 따라
 * 배경 버튼의 'title' 툴팁이 활성 모달 위로 튀어나오는 현상이 발생할 수 있으므로 주의.
 */
export const SequenceAndStackTest: StoryObj = {
  render: () => {
    const { openModal, closeModal } = useContext(ModalContext);

    // ✅ 사용자가 공유한 연쇄 흐름 (Sequential Flow)
    const handleSequenceFlow = () => {
      openModal('custom', {
        title: '삭제 확인',
        description: '삭제하면 복구할 수 없습니다. 삭제하시겠습니까?', // TS 에러 방지를 위해 message로 통일 제안
        cancelText: '취소',
        onConfirm: (currentId?: string) => {
          // 1. 현재 모달 닫기
          closeModal(currentId || 'custom');

          // 2. 큐에 쌓인 상태 처리를 위해 지연 후 다음 모달 오픈
          setTimeout(() => {
            openModal('custom', {
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
            openModal('custom', { title: '단순 알림', description: '단일 모달입니다.' })
          }
        >
          단일 모달 실행
        </Button>
      </GuideWrapper>
    );
  },
};
