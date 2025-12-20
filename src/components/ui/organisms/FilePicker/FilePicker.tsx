import { forwardRef, useRef, useState } from 'react';
import Styles from '@/components/ui/organisms/FilePicker/FilePicker.module.scss';
import clsx from 'clsx';
import Icon from '../../atoms/Icon/Icon';
import Button from '../../molecules/Button/Button';
import ValidationMsg from '../../atoms/ValidationMsg/ValidationMsg';

interface FileItem {
  id: string;
  name: string;
  size: number;
  ext: string;
  error?: string;
}

interface FilePickerProps {
  files: FileItem[];
  onDrop: (files: File[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  accept: string;
  maxCount: number;
}

const FilePicker = forwardRef<HTMLDivElement, FilePickerProps>(
  ({ files, onDrop, onRemove, onClear, accept, maxCount }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      // 🔥 파일 드래그가 아닐 경우 무시
      if (!e.dataTransfer.types.includes('Files')) return;

      dragCounter.current += 1;
      setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      onDrop(Array.from(e.dataTransfer.files));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      if (!e.dataTransfer.types.includes('Files')) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
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

    return (
      <div ref={ref} className={clsx(`${Styles['file-picker']}`)}>
        <div className='head'>
          <h3 className='title'>파일 업로드 컴포넌트</h3>
          <p className='desc'>파일을 업로드하는 컴포넌트입니다.</p>
        </div>
        <div
          className={clsx('dropzone', isDragging && 'is-dragging')}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role='button'
          tabIndex={0}
          aria-label='파일 업로드 영역'
        >
          <div aria-live='polite' className='sr-only'>
            {isDragging && '파일을 업로드 영역에 올려두었습니다'}
          </div>
          <p className='hint-msg'>
            {isDragging
              ? '여기에 파일을 놓아 업로드하세요'
              : '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러주세요.'}
          </p>
          <div className='actions'>
            <input
              type='file'
              id='file-picker-input'
              className='file-picker-input'
              name='file-picker-input'
              accept={accept}
              onChange={handleInputChange}
              hidden
            />
            <label htmlFor='file-picker-input' className='file-picker-label'>
              <Icon
                name='upload'
                className='icon'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <span>파일 선택</span>
            </label>
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
                color='primary'
                shape='rounded'
                size='xs'
                className='clear-btn'
                onClick={onClear}
              >
                전체 파일 삭제
              </Button>
            </div>
          )}
          <ul className='file-items'>
            {files.map(file => (
              <li key={file.id} className='file-item'>
                <span>
                  {file.name}.{file.ext} ({file.size}KB)
                </span>

                <button onClick={() => onRemove(file.id)}>삭제</button>

                {file.error && (
                  <ValidationMsg
                    id='checkbox-error-msg'
                    variant='danger'
                    role='alert'
                    ariaLive='polite'
                    size='sm'
                    className='error'
                  >
                    <Icon name='x-circle' className='icon' />
                    <span className='text'>{file.error}</span>
                  </ValidationMsg>
                )}
              </li>
            ))}
            {/* <li className='file-item'>
              <div className='item-body'>
                <div className='file-info'>
                  <Icon name='file-image' className='icon' />
                  <span className='name'>
                    <span className='base'>screenshot_01</span>
                    <span className='ext'>.png</span>
                  </span>
                  <span className='size'>[120.5KB]</span>
                </div>
              </div>
              <div className='item-divider' aria-hidden={true}></div>
              <ValidationMsg
                id='checkbox-error-msg'
                variant='danger'
                role='alert'
                ariaLive='assertive'
                size='sm'
              >
                <Icon name='x-circle' className='icon' />
                <span className='text'>유효성검사 문구 : 에러</span>
              </ValidationMsg>
            </li> */}
          </ul>
        </div>
      </div>
    );
  },
);

FilePicker.displayName = 'FilePicker';

export default FilePicker;
