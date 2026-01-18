import { forwardRef, useRef, useState } from 'react';
import Styles from '@/components/ui/organisms/FilePicker/FilePicker.module.scss';
import clsx from 'clsx';
import Icon from '../../atoms/Icon/Icon';
import Button from '../../molecules/Button/Button';
import ValidationMsg from '../../atoms/ValidationMsg/ValidationMsg';
import IconFrame from '../../molecules/IconFrame/IconFrame';
import RingSpinner from '../../atoms/Spinner/LoadingSpinner/RingSpinner';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    // 업로드 중 여부
    const isAnyFileUploading = files.some(file => file.status === 'uploading');
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleRemove = (id: string, index: number) => {
      onRemove(id);

      // 삭제 후 포커스 재배치
      setTimeout(() => {
        const itemButtons =
          pickerRef.current?.querySelectorAll<HTMLButtonElement>('.file-item button');

        if (itemButtons && itemButtons.length > 0) {
          const nextIndex = index < itemButtons.length ? index : itemButtons.length - 1;
          itemButtons[nextIndex]?.focus();
        } else {
          const selectBtn =
            pickerRef.current?.querySelector<HTMLLabelElement>('.file-picker-label');
          selectBtn?.focus();
        }
      }, 0);
    };

    // 파일 선택 버튼 클릭 처리
    const handleButtonClick = () => {
      if (isAnyFileUploading) return;
      fileInputRef.current?.click();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      // 파일 드래그가 아니거나 업로드 중이면 무시
      if (!e.dataTransfer.types.includes('Files') || isAnyFileUploading) return;

      dragCounter.current += 1;
      setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      if (isAnyFileUploading) return;

      onDrop(Array.from(e.dataTransfer.files));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!e.dataTransfer.types.includes('Files')) return;

      if (isAnyFileUploading) {
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
      e.target.value = '';
    };

    const getFileIconName = (ext: string) => {
      const extension = ext.toLowerCase();

      // 이미지
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(extension)) {
        return 'file-image';
      }
      // 문서
      if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
        return 'file-doc';
      }
      // 비디오
      if (['mp4', 'mov', 'avi', 'wmv', 'mkv'].includes(extension)) {
        return 'file-video';
      }
      // 압축 파일
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'file-zip';
      }

      return 'file';
    };

    return (
      <div
        ref={node => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;

          pickerRef.current = node;
        }}
        className={clsx(`${Styles['file-picker']} color--${color}`)}
      >
        <div className='head'>
          <h3 className='head-title'>{title ?? t('filepicker.base.title')}</h3>
          <p className='head-desc'>{desc ?? t('filepicker.base.desc')}</p>
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
          aria-label={t('filepicker.aria.dropzone')}
        >
          <div aria-live='polite' className='sr-only'>
            {isDragging && t('filepicker.drag-and-drop.announcement')}
          </div>
          <p className='hint-msg'>
            {isAnyFileUploading
              ? t('filepicker.drag-and-drop.uploading')
              : isDragging
                ? t('filepicker.drag-and-drop.draging')
                : t('filepicker.drag-and-drop.default')}
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
              {t('filepicker.btn')}
            </Button>
          </div>
        </div>
        <div className='file-list'>
          {files.length > 0 && (
            <div className='head'>
              <div className='count'>
                <span className='count-current'>
                  {files.length}
                  {t('filepicker.unit')}
                </span>
                <span className='count-divide'>/</span>
                <span className='count-max'>
                  {maxCount}
                  {t('filepicker.unit')}
                </span>
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
                {t('filepicker.delete-all-btn')}
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
                        {t('filepicker.delete-btn')}
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
