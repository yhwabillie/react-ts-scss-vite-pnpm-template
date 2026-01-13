import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import FilePicker, { type FileItem } from './FilePicker';
import Button from '../../molecules/Button/Button';
import { GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof FilePicker> = {
  title: 'UI/Organisms/FilePicker',
  component: FilePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**FilePicker**는 사용자가 파일을 탐색하거나 드래그 앤 드롭으로 업로드할 수 있는 고기능성 입력 도구입니다. <br /><br />' +
          '• **Multi-Status Feedback**: 대기(`ready`), 업로드 중(`uploading`), 성공(`success`), 에러(`error`) 등 파일별 개별 상태를 시각화합니다. <br />' +
          '• **Strict Validation**: 파일 확장자(`accept`), 최대 개수(`maxCount`) 제한을 통해 서버 전송 전 1차적인 유효성 검사를 수행합니다. <br />' +
          '• **Interactive List**: 업로드된 파일의 정보를 리스트 형태로 제공하며, 개별 삭제 또는 전체 초기화 기능을 포함합니다.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '컴포넌트 상단에 표시될 제목입니다.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    desc: {
      control: 'text',
      description: '제목 하단에 표시될 보조 설명 문구입니다.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    files: {
      control: 'object',
      description: '업로드된 파일 목록 데이터 배열입니다.',
      table: {
        category: 'Data',
        type: { summary: 'FileItem[]' },
      },
    },
    accept: {
      control: 'text',
      placeholder: '.jpg, .png, .pdf',
      description: '허용할 파일 확장자를 지정합니다. (예: .jpg, .png)',
      table: {
        category: 'Config',
        type: { summary: 'string' },
      },
    },
    maxCount: {
      control: { type: 'number', min: 1, max: 20 },
      description: '최대 업로드 가능한 파일의 개수입니다.',
      table: {
        category: 'Config',
        type: { summary: 'number' },
        //   defaultValue: { summary: 10 },
      },
    },
    // 📌 이벤트 핸들러 그룹화
    onDrop: {
      action: 'dropped',
      description: '파일이 드롭되거나 선택되었을 때 실행되는 콜백 함수입니다.',
      table: { category: 'Events' },
    },
    onRemove: {
      action: 'removed',
      description: '개별 파일이 삭제될 때 실행되는 콜백 함수입니다.',
      table: { category: 'Events' },
    },
    onClear: {
      action: 'cleared',
      description: '전체 파일 삭제 버튼 클릭 시 실행되는 콜백 함수입니다.',
      table: { category: 'Events' },
    },
  },
  args: {
    color: 'primary',
    title: '타이틀 영역',
    desc: '컨텐츠 영역',
    files: [],
    accept: '.jpg, .png, .pdf, .zip',
    maxCount: 5,
  },
};

export default meta;
type Story = StoryObj<typeof FilePicker>;

// 📝 Mock 데이터 생성을 위한 헬퍼 함수
const createMockFile = (id: string, name: string, error?: string) => ({
  id,
  name,
  size: 102.4,
  ext: 'png',
  error,
});

/**
 * 파일 선택기의 기본 렌더링 상태를 확인합니다.
 * - **Checklist**: 타이틀과 설명 문구가 영역 내에 적절히 배치되는지, 드롭존의 가시성이 확보되었는지 점검합니다.
 */
export const Base: Story = {};

/**
 * 파일이 성공적으로 로드된 후의 리스트 UI를 확인합니다.
 * - **UX**: 파일 아이콘, 파일명, 확장자 정보가 가독성 있게 표시되는지 확인합니다.
 * - **Action**: 파일이 존재할 때만 나타나는 '전체 파일 삭제' 버튼의 동작을 점검합니다.
 */
export const WithFiles: Story = {
  args: {
    files: [createMockFile('1', 'design_system_v1'), createMockFile('2', 'logo_final_2026')],
    maxCount: 5,
  },
};

/**
 * 유효성 검사 실패 시의 에러 피드백을 확인합니다.
 * - **Visual**: 에러 메시지(ValidationMsg)의 컬러 대비와 아이콘 배치가 사용자에게 위험 신호를 충분히 전달하는지 확인합니다.
 * - **Dark Mode**: 어두운 배경에서도 에러 텍스트의 가독성이 유지되는지 점검합니다.
 */
export const WithErrors: Story = {
  args: {
    files: [
      createMockFile('1', 'large_video_file', '용량이 너무 큽니다 (최대 10MB)'),
      createMockFile('2', 'unknown_format', '지원하지 않는 파일 형식입니다'),
    ],
    maxCount: 5,
  },
};

/**
 * 실제 서버 전송 프로세스를 가정한 인터랙션 시뮬레이션입니다.
 * - **Flow**: '전송 시작' 클릭 시 모든 파일이 순차적으로 업로드 완료(`success`) 상태로 전환되는 애니메이션을 검증합니다.
 * - **Interaction Control**: 업로드 진행 중에는 리셋 버튼을 비활성화하여 데이터 무결성을 보장합니다.
 */
export const States: Story = {
  args: {
    maxCount: 5,
    files: [
      {
        id: 'file-1',
        name: 'brand_identity_guideline',
        size: 2450,
        ext: 'pdf',
        status: 'uploading', // 📌 업로드 중 상태
      },
      {
        id: 'file-2',
        name: 'product_showcase_video',
        size: 45200,
        ext: 'mp4',
        status: 'success', // 📌 업로드 중 상태
      },
      {
        id: 'file-3',
        name: 'meeting_notes',
        size: 120,
        ext: 'docx',
        status: 'ready', // 대기 상태
      },
    ],
  },
};

/**
 * [Story Case] Full Submission Simulation
 * 💡 테스트 포인트:
 * - '전체 파일 업로드' 버튼 클릭 시 모든 파일의 UI가 `RingSpinner`로 전환되는지 확인합니다.
 * - 파일별로 업로드 완료 시점에 따라 `RingSpinner`가 `check-circle` 아이콘으로 부드럽게 교체되는지 확인합니다.
 * - [A11y]: 업로드 중에는 '삭제' 버튼이 사라져 포커스가 유실될 수 있으므로, 상태 변화를 시각적으로 명확히 인지할 수 있는지 점검합니다.
 */
export const Submitting: Story = {
  render: args => {
    const initialFiles: FileItem[] = [
      { id: '1', name: 'UI_Design_Final', size: 1240, ext: 'fig', status: 'ready' },
      { id: '2', name: 'Resource_Pack', size: 5400, ext: 'zip', status: 'ready' },
      { id: '3', name: 'Presentation_Draft', size: 850, ext: 'pptx', status: 'ready' },
    ];

    const [files, setFiles] = useState<FileItem[]>(initialFiles);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStartUpload = () => {
      setIsSubmitting(true);
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));

      files.forEach((file, index) => {
        setTimeout(
          () => {
            setFiles(current =>
              current.map(f => (f.id === file.id ? { ...f, status: 'success' } : f)),
            );
            if (index === files.length - 1) {
              setTimeout(() => setIsSubmitting(false), 500);
            }
          },
          (index + 1) * 1500,
        );
      });
    };

    // 📌 파일을 삭제하지 않고 상태만 'ready'로 리셋하는 로직
    const handleResetStatus = () => {
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          status: 'ready',
          error: undefined, // 에러가 있었다면 에러도 함께 초기화
        })),
      );
      setIsSubmitting(false);
    };

    return (
      <GuideWrapper>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <Button
            onClick={handleStartUpload}
            disabled={isSubmitting || files.length === 0}
            color='primary'
          >
            서버로 전송 시작
          </Button>
          <Button
            onClick={handleResetStatus}
            variant='outline'
            disabled={isSubmitting} // 업로드 중에는 리셋 방지
          >
            업로드 상태 초기화
          </Button>
        </div>

        <FilePicker
          {...args}
          files={files}
          onClear={() => setFiles([])} // FilePicker 내부의 전체 삭제는 기능을 유지
          onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
          onDrop={newFiles => {
            // 신규 파일 드롭 시 로직 (참고용)
            const mapped = newFiles.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name.split('.').shift() || '',
              ext: f.name.split('.').pop() || '',
              size: Math.round(f.size / 1024),
              status: 'ready' as const,
            }));
            setFiles(prev => [...prev, ...mapped]);
          }}
        />
      </GuideWrapper>
    );
  },
  args: {
    title: '파일 전송 시뮬레이션',
    desc: '전송 후 [업로드 상태 초기화] 버튼을 눌러 다시 테스트해보세요.',
    maxCount: 10,
  },
};
