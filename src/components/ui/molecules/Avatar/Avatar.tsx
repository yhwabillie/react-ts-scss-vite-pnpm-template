import {
  useState,
  type ElementType,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from 'react';
import Styles from '@/components/ui/molecules/Avatar/Avatar.module.scss';
import Icon from '../../atoms/Icon/Icon';

// 1. 순수 속성 정의
interface AvatarProps<T extends ElementType> {
  as?: T;
  src?: string;
  alt: string;
  name?: string;
  color?: 'primary' | 'secondary' | 'tertiary';
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'square' | 'rounded' | 'pill';
}

// 2. 가독성과 타입 안정성을 위해 명확하게 합집합 타입 정의
type AvatarCombinedProps<T extends ElementType> = AvatarProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof AvatarProps<T>>;

// 3. 최종 내보낼 컴포넌트의 타입 인터페이스
type AvatarComponent = <T extends ElementType = 'div'>(
  props: AvatarCombinedProps<T> & { ref?: ForwardedRef<any> },
) => ReactElement | null;

// 4. 구현부: forwardRef 내부 타입을 'any'로 우회하여 Omit 에러 해결
const Avatar = forwardRef((props: any, ref: ForwardedRef<any>) => {
  const {
    as: Component = 'div',
    src,
    alt,
    name,
    color = 'primary',
    variant = 'outline',
    size = 'md',
    shape = 'pill',
    className,
    ...rest
  } = props as AvatarCombinedProps<ElementType>;

  const [isError, setIsError] = useState(false);
  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : '');

  return (
    <Component
      ref={ref}
      className={`${Styles['avatar']} variant--${variant} color--${color} shape--${shape} size--${size} ${className || ''}`}
      {...rest}
    >
      {src && !isError ? (
        <img src={src} alt={alt} onError={() => setIsError(true)} className={Styles.image} />
      ) : (
        <div className='avatar__fallback' aria-label={alt} role='img'>
          {name ? getInitial(name) : <Icon name='user' className='icon' strokeWidth={2.5} />}
        </div>
      )}
    </Component>
  );
}) as unknown as AvatarComponent; // 마지막에 정의한 인터페이스로 강제 캐스팅

(Avatar as any).displayName = 'Avatar';
export default Avatar;
