import { forwardRef, useRef, useState } from 'react';
import Styles from '@/components/ui/organisms/FilePicker/FilePicker.module.scss';
import clsx from 'clsx';
import Icon from '../../atoms/Icon/Icon';
import Button from '../../molecules/Button/Button';
import ValidationMsg from '../../atoms/ValidationMsg/ValidationMsg';
import IconFrame from '../../molecules/IconFrame/IconFrame';
import RingSpinner from '../../atoms/Spinner/LoadingSpinner/RingSpinner';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  ext: string;
  error?: string;
  status?: 'ready' | 'uploading' | 'success';
  progress?: number;
}

interface FilePickerProps {
  color?: 'primary' | 'secondary' | 'tertiary';
  title?: string;
  desc?: string;
  files: FileItem[];
  onDrop: (files: File[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  accept: string;
  maxCount: number;
}

const FilePicker = forwardRef<HTMLDivElement, FilePickerProps>(
  ({ color = 'primary', title, desc, files, onDrop, onRemove, onClear, accept, maxCount }, ref) => {
    // 📌 현재 하나라도 업로드 중인지 확인 (전체 제어용)
    const isAnyFileUploading = files.some(file => file.status === 'uploading');
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleRemove = (id: string, index: number) => {
      // 📌 1. 현재 삭제할 버튼의 인덱스를 기억
      onRemove(id);

      // 📌 2. 삭제 후 포커스 재배치 (DOM 업데이트 이후 실행)
      setTimeout(() => {
        const itemButtons =
          pickerRef.current?.querySelectorAll<HTMLButtonElement>('.file-item button');

        if (itemButtons && itemButtons.length > 0) {
          // 다음 아이템이 있으면 그곳으로, 없으면 마지막 아이템으로 포커스
          const nextIndex = index < itemButtons.length ? index : itemButtons.length - 1;
          itemButtons[nextIndex]?.focus();
        } else {
          // 파일이 하나도 없으면 파일 선택 버튼으로 포커스 이동
          const selectBtn =
            pickerRef.current?.querySelector<HTMLLabelElement>('.file-picker-label');
          selectBtn?.focus();
        }
      }, 0);
    };

    // 📌 2. 버튼 클릭 시 input을 대신 클릭해주는 함수
    const handleButtonClick = () => {
      if (isAnyFileUploading) return;
      fileInputRef.current?.click();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      // 🔥 파일 드래그가 아니거나 이미 업로드 중이면 시각적 효과 무시
      if (!e.dataTransfer.types.includes('Files') || isAnyFileUploading) return;

      dragCounter.current += 1;
      setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      // 📌 업로드 중일 때는 로직 실행 방지
      if (isAnyFileUploading) return;

      onDrop(Array.from(e.dataTransfer.files));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!e.dataTransfer.types.includes('Files')) return;

      if (isAnyFileUploading) {
        // 📌 커서를 금지(🚫) 모양으로 변경하여 시각적 차단 알림
        e.dataTransfer.dropEffect = 'none';
      } else {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current -= 1;

      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      onDrop(Array.from(e.target.files));
      e.target.value = ''; // 같은 파일 재선택 가능하게
    };

    const getFileIconName = (ext: string) => {
      const extension = ext.toLowerCase();

      // 1. 이미지 관련
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(extension)) {
        return 'file-image';
      }
      // 2. 문서 관련
      if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
        return 'file-doc'; // 또는 'file-text' 등 정의된 이름에 맞게
      }
      // 3. 비디오 관련
      if (['mp4', 'mov', 'avi', 'wmv', 'mkv'].includes(extension)) {
        return 'file-video';
      }
      // 4. 압축 파일 관련
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'file-zip';
      }

      // 기본 아이콘
      return 'file';
    };

    return (
      <div
        ref={node => {
          // 1. 외부에서 받은 ref 처리
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;

          // 2. 내부 포커스 제어용 pickerRef 처리
          pickerRef.current = node;
        }}
        className={clsx(`${Styles['file-picker']} color--${color}`)}
      >
        <div className='head'>
          <h3 className='head-title'>{title}</h3>
          <p className='head-desc'>{desc}</p>
        </div>
        <div
          className={clsx(
            'dropzone',
            isDragging && 'is-dragging',
            isAnyFileUploading && 'is-disabled',
          )}
          tabIndex={isAnyFileUploading ? -1 : 0}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-disabled={isAnyFileUploading}
          role='button'
          aria-label='파일 업로드 영역'
        >
          <div aria-live='polite' className='sr-only'>
            {isDragging && '파일을 업로드 영역에 올려두었습니다'}
          </div>
          <p className='hint-msg'>
            {isAnyFileUploading
              ? '현재 파일 업로드 중에는 추가로 파일을 등록할 수 없습니다.'
              : isDragging
                ? '여기에 파일을 놓아 업로드하세요.'
                : '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러주세요.'}
          </p>
          <div className='actions'>
            <input
              type='file'
              ref={fileInputRef}
              id='file-picker-input'
              className='file-picker-input'
              name='file-picker-input'
              accept={accept}
              onChange={handleInputChange}
              disabled={isAnyFileUploading}
              hidden
            />
            <Button
              type='button'
              color={color}
              className='file-picker-label'
              aria-disabled={isAnyFileUploading}
              onClick={handleButtonClick}
              startIcon={
                <Icon
                  className='icon'
                  name='upload'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              }
            >
              파일 선택
            </Button>
          </div>
        </div>
        <div className='file-list'>
          {files.length > 0 && (
            <div className='head'>
              <div className='count'>
                <span className='count-current'>{files.length}개</span>
                <span className='count-divide'>/</span>
                <span className='count-max'>{maxCount}개</span>
              </div>
              <Button
                variant='outline'
                color={color}
                shape='rounded'
                size='sm'
                className='clear-btn'
                onClick={onClear}
                disabled={isAnyFileUploading}
                startIcon={
                  <Icon
                    className='icon'
                    name='trashcan'
                    strokeWidth={2.5}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                }
              >
                전체 파일 삭제
              </Button>
            </div>
          )}
          <ul className='file-items'>
            {files.map((file, idx) => {
              const isUploading = file.status === 'uploading';
              const isSuccess = file.status === 'success';

              return (
                <li key={file.id} className='file-item'>
                  <span className='file-item-container'>
                    <span className='file-info'>
                      <IconFrame size='sm' color={color}>
                        <Icon
                          name={getFileIconName(file.ext)}
                          className='icon'
                          strokeWidth={2.5}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </IconFrame>
                      <span className='file-name'>
                        <span className='basename'>{file.name}</span>
                        <span className='ext'>.{file.ext}</span>
                      </span>
                      <span className='file-volume'>[{file.size}KB]</span>
                    </span>

                    {isUploading ? (
                      <IconFrame size='md'>
                        <RingSpinner color={color} size='lg' variant='closed-ring' />
                      </IconFrame>
                    ) : isSuccess ? (
                      <IconFrame color='success' size='md'>
                        <Icon
                          name='check-circle'
                          className='icon'
                          strokeWidth={2.5}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </IconFrame>
                    ) : (
                      <Button
                        variant='ghost'
                        color='danger'
                        size='sm'
                        disabled={isAnyFileUploading}
                        onClick={() => handleRemove(file.id, idx)}
                      >
                        삭제
                      </Button>
                    )}
                  </span>
                  {file.error && (
                    <ValidationMsg
                      id='checkbox-error-msg'
                      variant='danger'
                      role='alert'
                      ariaLive='polite'
                      size='sm'
                      className='error'
                    >
                      <Icon
                        name='x-circle'
                        className='icon'
                        strokeWidth={2.5}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <span className='text'>{file.error}</span>
                    </ValidationMsg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);

FilePicker.displayName = 'FilePicker';

export default FilePicker;
