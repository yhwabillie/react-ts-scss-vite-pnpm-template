import React from 'react';
import Styles from '@/components/ui/guide/Specimen.module.scss';
import clsx from 'clsx';

export const SpecimenWrapper = ({
  children,
  title,
  style,
}: {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}) => (
  <div className={Styles['specimen-wrapper']} style={style}>
    {title && <p className='title'>{title}</p>}
    {children}
  </div>
);

export const SpecimenGroup = ({
  children,
  title,
  direction = 'row',
}: {
  children: React.ReactNode;
  title?: string;
  direction?: 'column' | 'row';
}) => (
  <div className={clsx(Styles['specimen-group'], direction === 'column' && 'is-column')}>
    <span className='title'>{title}</span>
    {children}
  </div>
);

interface SpecimenRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SpecimenRow = ({ children, style, className, ...rest }: SpecimenRowProps) => (
  <div className={Styles['specimen-row']} style={style} {...rest}>
    {children}
  </div>
);

interface SpecimenCellwProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  caption?: string;
}

export const SpecimenCell = ({
  caption,
  children,
  style,
  className,
  ...rest
}: SpecimenCellwProps) => (
  <div className={Styles['specimen-cell']} style={style} {...rest}>
    {children}
    {caption && <span className='caption'>{caption}</span>}
  </div>
);
