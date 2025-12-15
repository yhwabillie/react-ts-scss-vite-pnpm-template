import React from 'react';

// 아이콘 svg import
import SearchIcon from '@/assets/icons/icon-search.svg?react';
import LogoutIcon from '@/assets/icons/icon-logout.svg?react';
import CheckCircleIcon from '@/assets/icons/icon-check_circle.svg?react';
import CheckInfoIcon from '@/assets/icons/icon-info_circle.svg?react';
import XCircleIcon from '@/assets/icons/icon-x_circle.svg?react';
import WarningTriangleIcon from '@/assets/icons/icon-warning_triangle.svg?react';
import CheckIcon from '@/assets/icons/icon-check.svg?react';
import XIcon from '@/assets/icons/icon-x.svg?react';
import EyeOffIcon from '@/assets/icons/icon-eye-off.svg?react';
import EyeIcon from '@/assets/icons/icon-eye.svg?react';
import ArrowDownIcon from '@/assets/icons/icon-arrow-down.svg?react';
import ArrowUpIcon from '@/assets/icons/icon-arrow-up.svg?react';
import RoundCheckIcon from '@/assets/icons/icon-round_check.svg?react';
import SearchXIcon from '@/assets/icons/icon-search-x.svg?react';
import GlobeIcon from '@/assets/icons/icon-globe.svg?react';

const iconMap = {
  search: SearchIcon,
  logout: LogoutIcon,
  'check-circle': CheckCircleIcon,
  'info-circle': CheckInfoIcon,
  'x-circle': XCircleIcon,
  'warning-triangle': WarningTriangleIcon,
  check: CheckIcon,
  x: XIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-up': ArrowUpIcon,
  'round-check': RoundCheckIcon,
  'search-x': SearchXIcon,
  globe: GlobeIcon,
  // 다른 아이콘들도 여기에 추가
};

type IconName = keyof typeof iconMap;

interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'bevel' | 'miter';
}

// size variant 매핑
const ICON_SIZES: Record<'sm' | 'md' | 'lg', number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const Icon: React.FC<IconProps> = ({
  name,
  color,
  size,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  ...props
}) => {
  const SvgIcon = iconMap[name]; // name에 맞는 아이콘 가져오기
  if (!SvgIcon) return null;

  // size가 지정되었을 때만 width/height 적용
  const dimensionProps = size ? { width: ICON_SIZES[size], height: ICON_SIZES[size] } : {};

  return (
    <SvgIcon
      fill={color}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden
      {...dimensionProps}
      {...props}
    />
  );
};
export default Icon;
