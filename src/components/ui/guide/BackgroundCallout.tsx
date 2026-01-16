import React, { useEffect, useRef } from 'react';
import styles from './BackgroundCallout.module.scss';
import gsap from 'gsap';

interface BackgroundCalloutProps {
  id?: string;
  type?: 'warning' | 'info' | 'success';
  title?: string;
  label?: string;
  items?: Array<string | React.ReactNode>;
  margin?: string;
  standalone?: boolean;
  children?: React.ReactNode;
}

const BackgroundCallout = ({
  id,
  type = 'warning',
  title,
  label,
  items,
  margin,
  standalone,
  children,
}: BackgroundCalloutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerClass = `${styles['bg-callout']} ${styles[`bg-callout--${type}`]} ${standalone && 'is-standalone'}`;

  return (
    <section id={id} ref={containerRef} className={containerClass}>
      {title && <h2 className='bg-callout__title'>{title}</h2>}
      <div
        className='bg-callout__container'
        style={{ '--callout-margin': margin } as React.CSSProperties}
      >
        <div className='bg-callout__content'>
          {label && <span className='bg-callout__label'>{label}</span>}
          {/* 리스트 형태일 때 */}
          {items && (
            <ul className='bg-callout__list'>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          {/* 단순 결론 텍스트일 때 */}
          {children && <div className='bg-callout__text'>{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default BackgroundCallout;
