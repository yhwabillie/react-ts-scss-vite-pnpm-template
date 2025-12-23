import React, { forwardRef } from 'react';
import Styles from '@/components/ui/guide/AnatomyWrapper.module.scss';

interface AnatomyWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
}

const AnatomyWrapper = forwardRef<HTMLDivElement, AnatomyWrapperProps>(
  ({ children, title, style, ...rest }, ref) => {
    return (
      <div ref={ref} style={style} className={Styles['anatomy-wrapper']} {...rest}>
        {title && <p className='title'>{title}</p>}
        {children}
      </div>
    );
  },
);

export default AnatomyWrapper;
