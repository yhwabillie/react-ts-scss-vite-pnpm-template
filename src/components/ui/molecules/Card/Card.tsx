import type React from 'react';
import Styles from './Card.module.scss';

interface CardProps<T extends React.ElementType = 'div'> {
  as?: T;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Card = <T extends React.ElementType = 'div'>({
  as,
  children,
  size = 'xs',
  ...rest
}: CardProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof CardProps<T>>) => {
  const Component = as || 'div';
  return (
    <Component {...rest} className={`${Styles['card']} size--${size}`}>
      {children}
    </Component>
  );
};

export default Card;
