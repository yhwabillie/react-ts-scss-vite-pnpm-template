import React, { forwardRef } from 'react';
import Styles from '@/components/ui/guide/AnatomyWrapper.module.scss';

interface AnatomyWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  minimal?: boolean; // 추가된 Props
}

const AnatomyWrapper = forwardRef<HTMLDivElement, AnatomyWrapperProps>(
  ({ children, title, minimal = false, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={Styles['anatomy-wrapper']}
        data-minimal={minimal} // data 속성으로 전달
        {...rest}
      >
        {title && <p className='title'>{title}</p>}
        {children}
      </div>
    );
  },
);

export default AnatomyWrapper;
