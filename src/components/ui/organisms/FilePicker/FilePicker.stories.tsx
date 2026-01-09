import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import FilePicker, { type FileItem } from './FilePicker';
import Button from '../../molecules/Button/Button';
import { GuideWrapper } from '../../guide/Guide';

const meta: Meta<typeof FilePicker> = {
  title: 'UI/Organisms/FilePicker',
  component: FilePicker,
  tags: ['autodocs'],
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

export const Base: Story = {};

/**
 * [Story Case] Files Loaded
 * 💡 테스트 포인트:
 * - 파일이 업로드된 후 리스트 렌더링과 개수 표시(Count)가 정상적인지 확인합니다.
 * - '전체 파일 삭제' 버튼이 노출되는지 확인합니다.
 */
export const WithFiles: Story = {
  args: {
    files: [createMockFile('1', 'design_system_v1'), createMockFile('2', 'logo_final_2026')],
    maxCount: 5,
  },
};

/**
 * [Story Case] Validation Error
 * 💡 테스트 포인트:
 * - 파일별 에러 메시지(ValidationMsg)가 디자인 가이드에 맞게 출력되는지 확인합니다.
 * - 다크모드(#121212)에서 에러 아이콘과 텍스트의 대비가 명확한지 점검합니다.
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
 * [Story Case] Uploading Status
 * 💡 테스트 포인트:
 * - `status: 'uploading'`인 파일에 대해 `RingSpinner`가 정상적으로 노출되는지 확인합니다.
 * - 업로드 중인 파일은 '삭제' 버튼 대신 스피너가 표시되어 사용자의 중복 조작을 방지하는지 확인합니다.
 * - [A11y]: 스피너가 돌아가는 동안 보조기기 사용자에게 '업로드 중'임을 알리는 시각적/청각적 피드백을 점검합니다.
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
