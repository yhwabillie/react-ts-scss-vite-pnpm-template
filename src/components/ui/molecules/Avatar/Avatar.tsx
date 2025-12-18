import { forwardRef, useState } from 'react';
import Styles from '@/components/ui/molecules/Avatar/Avatar.module.scss';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', shape = 'circle', status, ...props }, ref) => {
    const [isError, setIsError] = useState(false);
    const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : '');

    return (
      <div
        ref={ref}
        className={`${Styles.container} ${Styles[size]}`}
        {...props} // ✅ 중요: ProfilePopover가 전달하는 모든 이벤트와 속성을 수신
      >
        <div className={`${Styles.avatar} ${Styles[shape]}`}>
          {src && !isError ? (
            <img src={src} alt={alt} onError={() => setIsError(true)} className={Styles.image} />
          ) : (
            <div className={Styles.fallback} aria-label={alt} role='img'>
              {name ? getInitial(name) : <span aria-hidden='true'>👤</span>}
            </div>
          )}
        </div>

        {status && (
          <span
            className={`${Styles.status} ${Styles[status]}`}
            role='status'
            aria-label={`현재 상태: ${status === 'online' ? '접속 중' : status}`}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
export default Avatar;
