import React from 'react';

// 아이콘 svg import
import SearchIcon from '@/assets/icons/icon-search.svg?react';
import LogoutIcon from '@/assets/icons/icon-logout.svg?react';

const iconMap = {
  search: SearchIcon,
  logout: LogoutIcon,
  // 다른 아이콘들도 여기에 추가
};

type IconName = keyof typeof iconMap;

interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
  name: IconName;
  size: 'sm' | 'md' | 'lg';
  color: string;
}

// size variant 매핑
const ICON_SIZES: Record<'sm' | 'md' | 'lg', number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const Icon: React.FC<IconProps> = ({ name, color, size, ...props }) => {
  const SvgIcon = iconMap[name]; // name에 맞는 아이콘 가져오기
  if (!SvgIcon) return null;

  const dimension = ICON_SIZES[size];

  return <SvgIcon fill={color} width={dimension} height={dimension} {...props} />;
};

export default Icon;
