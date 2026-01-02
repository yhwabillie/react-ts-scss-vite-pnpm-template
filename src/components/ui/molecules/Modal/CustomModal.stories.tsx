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
  title: 'UI/Organisms/Modal/CustomModal',
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
        </GuideGroup>
      </GuideWrapper>
    );
  },
};
