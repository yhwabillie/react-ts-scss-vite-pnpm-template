import React, { forwardRef } from 'react';
import Styles from '@/components/ui/guide/Guide.module.scss';
import clsx from 'clsx';

interface GuideWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  minimal?: boolean; // 추가된 Props
}

export const GuideWrapper = forwardRef<HTMLDivElement, GuideWrapperProps>(
  ({ children, title, minimal = false, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={Styles['guide-wrapper']}
        data-minimal={minimal} // data 속성으로 전달
        {...rest}
      >
        {title && <p className='title'>{title}</p>}
        {children}
      </div>
    );
  },
);

export const GuideGroup = ({
  children,
  title,
  direction = 'row',
}: {
  children: React.ReactNode;
  title?: string;
  direction?: 'column' | 'row';
}) => (
  <div className={clsx(Styles['guide-group'], direction === 'column' && 'is-column')}>
    <span className='title'>{title}</span>
    {children}
  </div>
);

interface GuideRowProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: 'row' | 'column';
  children: React.ReactNode;
}

export const GuideRow = ({
  direction = 'row',
  children,
  style,
  className,
  ...rest
}: GuideRowProps) => (
  <div
    className={clsx(Styles['guide-row'], direction === 'row' ? 'is-row' : 'is-column')}
    style={style}
    {...rest}
  >
    {children}
  </div>
);

interface GuideCellwProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  caption?: string;
}

export const GuideCell = ({ caption, children, style, className, ...rest }: GuideCellwProps) => (
  <div className={Styles['guide-cell']} style={style} {...rest}>
    {caption && <span className='caption'>{caption}</span>}
    {children}
  </div>
);
